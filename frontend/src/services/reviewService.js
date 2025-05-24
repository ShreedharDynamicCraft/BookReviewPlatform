/**
 * Review Service - Handles all API interactions related to reviews
 * This service centralizes API calls and provides consistent error handling
 */

/**
 * Get all reviews for a specific book
 * @param {String} bookId - Book ID to get reviews for
 * @returns {Promise<Array>} - Array of reviews
 */
import { apiRequest } from './apiConfig';

export const getBookReviews = async (bookId) => {
  try {
    if (!bookId) {
      throw new Error('Book ID is required');
    }
    
    return await apiRequest(`reviews?bookId=${bookId}`);
  } catch (error) {
    console.error(`Error fetching reviews for book ${bookId}:`, error);
    throw error;
  }
};

/**
 * Submit a new review for a book
 * @param {Object} reviewData - Review data with rating, comment, bookId
 * @param {String} token - User authentication token
 * @returns {Promise<Object>} - Created review data
 */
export const submitReview = async (reviewData, token) => {
  try {
    if (!reviewData.bookId || !reviewData.rating || !reviewData.comment) {
      throw new Error('Missing required review data');
    }
    
    const data = await apiRequest('reviews', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    
    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

/**
 * Get all reviews (admin only)
 * @param {String} token - Admin authentication token
 * @returns {Promise<Array>} - Array of all reviews
 */
export const getAllReviews = async (token) => {
  try {
    const data = await apiRequest('reviews/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};

/**
 * Toggle like/unlike for a review
 * @param {String} reviewId - Review ID to like/unlike
 * @param {String} token - User authentication token
 * @returns {Promise<Object>} - Updated review data
 */
export const toggleReviewLike = async (reviewId, token) => {
  try {
    return await apiRequest(`reviews/${reviewId}/like`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Error toggling review like:', error);
    throw error;
  }
};
