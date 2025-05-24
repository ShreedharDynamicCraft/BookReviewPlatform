const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getFeaturedBooks,
} = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');
const Book = require('../models/bookModel'); 

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/featured').get(getFeaturedBooks);

// Remove the user-bookshelf route from here since we now have a separate route for it

router
  .route('/:id')
  .get(getBookById)
  .put(protect, admin, updateBook)
  .delete(protect, admin, deleteBook);

module.exports = router;
