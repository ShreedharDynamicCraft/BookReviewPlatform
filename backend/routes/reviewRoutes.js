const express = require('express');
const router = express.Router();
const { 
  getReviews, 
  createReview,
  getAllReviews 
} = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getReviews).post(protect, createReview);
router.route('/all').get(protect, admin, getAllReviews);

module.exports = router;
