const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Book = require('../models/bookModel');

// @desc    Get reviews for a book
// @route   GET /api/reviews
// @access  Public
const getReviews = asyncHandler(async (req, res) => {
  const { bookId } = req.query;
  
  if (!bookId) {
    res.status(400);
    throw new Error('Book ID is required');
  }
  
  const reviews = await Review.find({ book: bookId })
    .populate('user', 'name');
    
  res.json(reviews);
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, bookId } = req.body;

  if (!rating || !comment || !bookId) {
    res.status(400);
    throw new Error('Please add a rating, comment, and book ID');
  }

  // Check if user already reviewed this book
  const alreadyReviewed = await Review.findOne({
    user: req.user._id,
    book: bookId,
  });

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('Book already reviewed');
  }

  // Create the new review with current timestamp
  const review = new Review({
    rating: Number(rating),
    comment,
    user: req.user._id,
    book: bookId,
    createdAt: new Date()
  });

  await review.save();

  // Update book rating with real calculation
  const book = await Book.findById(bookId);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  // Get all reviews for this book
  const allReviews = await Review.find({ book: bookId });
  
  // Calculate real average rating
  book.numReviews = allReviews.length;
  
  if (allReviews.length > 0) {
    book.rating = allReviews.reduce((acc, item) => acc + item.rating, 0) / allReviews.length;
  } else {
    book.rating = 0;
  }

  await book.save();

  // Return the newly created review
  res.status(201).json({ 
    message: 'Review added',
    review: {
      ...review.toObject(),
      user: {
        _id: req.user._id,
        name: req.user.name
      }
    }
  });
});

// @desc    Get all reviews (for admin)
// @route   GET /api/reviews/all
// @access  Private/Admin
const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({})
    .populate('user', 'name')
    .populate('book', 'title');
    
  res.json(reviews);
});

module.exports = {
  getReviews,
  createReview,
  getAllReviews,
};
