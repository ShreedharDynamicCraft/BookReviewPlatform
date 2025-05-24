const asyncHandler = require('express-async-handler');
const Book = require('../models/bookModel');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  // Get limit from query params or set to 0 (no limit) if not provided
  const limit = req.query.limit ? Number(req.query.limit) : 0;
  const page = Number(req.query.pageNumber) || 1;
  
  const keyword = req.query.keyword
    ? {
        title: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};
  
  const genre = req.query.genre
    ? { genre: req.query.genre }
    : {};
    
  const count = await Book.countDocuments({ ...keyword, ...genre });
  
  // If limit is 0 or undefined, don't apply a limit to return all books
  let query = Book.find({ ...keyword, ...genre }).sort({ createdAt: -1 });
  
  // Only apply limit and skip if limit is greater than 0
  if (limit > 0) {
    query = query.limit(limit).skip((page - 1) * limit);
  }
  
  const books = await query;

  console.log(`Returning ${books.length} books from database`);

  res.json({ 
    books, 
    page, 
    pages: limit > 0 ? Math.ceil(count / limit) : 1
  });
});

// @desc    Get a book by ID
// @route   GET /api/books/:id
// @access  Public
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (book) {
    // Make sure the coverImage URL is properly formatted
    let formattedBook = {
      ...book._doc,
      coverImage: book.coverImage
    };
    
    // If the coverImage doesn't start with http or https, it's probably a relative path
    // so we append the base URL to make it absolute
    if (book.coverImage && !book.coverImage.startsWith('http')) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      formattedBook.coverImage = `${baseUrl}${book.coverImage.startsWith('/') ? '' : '/'}${book.coverImage}`;
    }
    
    // If there's no cover image, use a placeholder
    if (!book.coverImage) {
      formattedBook.coverImage = 'https://via.placeholder.com/400x600?text=Book+Cover+Not+Available';
    }
    
    res.json(formattedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
const createBook = asyncHandler(async (req, res) => {
  const { title, author, genre, description, publishedYear, coverImage, featured } = req.body;

  const book = new Book({
    title,
    author,
    genre,
    description,
    publishedYear,
    coverImage,
    featured: featured || false,
    rating: 0,
    numReviews: 0,
  });

  const createdBook = await book.save();
  res.status(201).json(createdBook);
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
const updateBook = asyncHandler(async (req, res) => {
  const { title, author, genre, description, publishedYear, coverImage, featured } = req.body;

  const book = await Book.findById(req.params.id);

  if (book) {
    book.title = title || book.title;
    book.author = author || book.author;
    book.genre = genre || book.genre;
    book.description = description || book.description;
    book.publishedYear = publishedYear || book.publishedYear;
    book.coverImage = coverImage || book.coverImage;
    book.featured = featured !== undefined ? featured : book.featured;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private/Admin
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    await Book.deleteOne({ _id: book._id });
    res.json({ message: 'Book removed' });
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Get featured books
// @route   GET /api/books/featured
// @access  Public
const getFeaturedBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ featured: true });
  res.json(books);
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
};
