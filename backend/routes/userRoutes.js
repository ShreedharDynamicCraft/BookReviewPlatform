const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Route to get all users (admin only)
router.route('/').get(protect, admin, getUsers);

// Routes for authentication
router.post('/login', authUser);
router.post('/register', registerUser);

// Routes for user profile
router
  .route('/:id')
  .get(getUserProfile)
  .put(protect, updateUserProfile);

module.exports = router;
