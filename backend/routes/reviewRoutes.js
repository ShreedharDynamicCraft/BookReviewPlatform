const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Book = require('../models/bookModel');
const Review = require('../models/reviewModel');

// Get reviews for a book
router.get('/', async (req, res) => {
  try {
    const { bookId } = req.query;
    
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }
    
    const reviews = await Review.find({ book: bookId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

// Create a new review
router.post('/', protect, async (req, res) => {
  try {
    const { rating, comment, bookId } = req.body;
    
    if (!rating || !comment || !bookId) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ user: req.user._id, book: bookId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    // Create review
    const review = await Review.create({
      user: req.user._id,
      book: bookId,
      rating,
      comment
    });
    
    // Update book rating
    await book.calculateRating();
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create review', error: error.message });
  }
});

// Like/unlike a review
router.put('/:id/like', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if the user already liked the review
    const userLikedIndex = review.likes.indexOf(req.user._id);
    
    if (userLikedIndex === -1) {
      // User hasn't liked the review yet, add like
      review.likes.push(req.user._id);
      await review.save();
      res.json({ liked: true, likesCount: review.likes.length });
    } else {
      // User already liked the review, remove like
      review.likes.splice(userLikedIndex, 1);
      await review.save();
      res.json({ liked: false, likesCount: review.likes.length });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update review likes', error: error.message });
  }
});

module.exports = router;
