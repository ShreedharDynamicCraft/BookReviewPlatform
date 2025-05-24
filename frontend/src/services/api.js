/**
 * API service module for making requests to the backend
 * Uses the deployed Vercel backend URL
 */

// Base URL for API requests - points to the deployed Vercel backend
const API_BASE_URL = 'https://book-review-platform-wnr7.vercel.app/api';

/**
 * Makes a request to the API
 * @param {string} endpoint - API endpoint without leading slash
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('userInfo') ? 
    JSON.parse(localStorage.getItem('userInfo')).token : null;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {})
  };

  const url = `${API_BASE_URL}/${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;
  
  try {
    console.log(`Making API request to: ${url}`);
    const response = await fetch(url, {
      ...options,
      headers
    });

    // For non-JSON responses
    if (!response.headers.get('content-type')?.includes('application/json')) {
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error (${response.status}): ${text}`);
      }
      return { success: true };
    }

    // For JSON responses
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

/**
 * API services organized by entity
 */

export const userService = {
  // User authentication and profile
  login: (email, password) => apiRequest('users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  
  register: (name, email, password) => apiRequest('users/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  }),
  
  getProfile: (userId) => apiRequest(`users/${userId}`),
  
  updateProfile: (userId, userData) => apiRequest(`users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  })
};

export const bookService = {
  // Book-related API calls
  getBooks: (params = {}) => {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    return apiRequest(`books?${queryString}`);
  },
  
  getBookById: (bookId) => apiRequest(`books/${bookId}`),
  
  getFeaturedBooks: () => apiRequest('books/featured'),
  
  createBook: (bookData) => apiRequest('books', {
    method: 'POST',
    body: JSON.stringify(bookData)
  }),
  
  updateBook: (bookId, bookData) => apiRequest(`books/${bookId}`, {
    method: 'PUT',
    body: JSON.stringify(bookData)
  }),
  
  deleteBook: (bookId) => apiRequest(`books/${bookId}`, {
    method: 'DELETE'
  }),
  
  toggleLike: (bookId) => apiRequest(`books/${bookId}/like`, {
    method: 'PUT'
  })
};

export const reviewService = {
  // Review-related API calls
  getBookReviews: (bookId) => apiRequest(`reviews?bookId=${bookId}`),
  
  createReview: (reviewData) => apiRequest('reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  }),
  
  toggleLike: (reviewId) => apiRequest(`reviews/${reviewId}/like`, {
    method: 'PUT'
  })
};

export const bookshelfService = {
  // Bookshelf-related API calls
  getBookshelf: (bookIds) => apiRequest(`bookshelf?ids=${bookIds.join(',')}`),
};

export default {
  apiRequest,
  userService,
  bookService,
  reviewService,
  bookshelfService
};
