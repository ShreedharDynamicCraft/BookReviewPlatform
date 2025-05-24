/**
 * Review Service - Handles all API interactions related to reviews
 * This service centralizes API calls and provides consistent error handling
 */

/**
 * Get all reviews for a specific book
 * @param {String} bookId - Book ID to get reviews for
 * @returns {Promise<Array>} - Array of reviews
 */
export const getBookReviews = async (bookId) => {
  try {
    if (!bookId) {
      throw new Error('Book ID is required');
    }
    
    const response = await fetch(`/api/reviews?bookId=${bookId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
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
    
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(reviewData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit review');
    }
    
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
    const response = await fetch('/api/reviews/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reviews');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    throw error;
  }
};
