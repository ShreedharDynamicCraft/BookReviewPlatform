/**
 * Book Service - Handles all API interactions related to books
 * This service centralizes API calls and provides consistent error handling
 */

/**
 * Create a new book (admin only)
 * @param {Object} bookData - Book data including title, author, etc.
 * @param {String} token - Admin authentication token
 * @returns {Promise<Object>} - Created book data
 */
export const createBook = async (bookData, token) => {
  try {
    const response = await fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create book');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating book:', error);
    throw error;
  }
};

/**
 * Update an existing book (admin only)
 * @param {String} id - Book ID
 * @param {Object} bookData - Updated book data
 * @param {String} token - Admin authentication token
 * @returns {Promise<Object>} - Updated book data
 */
export const updateBook = async (id, bookData, token) => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(bookData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update book');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating book:', error);
    throw error;
  }
};

/**
 * Delete a book (admin only)
 * @param {String} id - Book ID to delete
 * @param {String} token - Admin authentication token
 * @returns {Promise<Object>} - Deletion confirmation
 */
export const deleteBook = async (id, token) => {
  try {
    const response = await fetch(`/api/books/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete book');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw error;
  }
};

/**
 * Fetch all books with optional filtering
 * @param {Object} params - Query parameters for filtering and pagination
 * @returns {Promise<Object>} - Books with pagination data
 */
export const getBooks = async (params = {}) => {
  try {
    // Build query string from params
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    
    const response = await fetch(`/api/books?${queryString}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch books');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
};

/**
 * Get a single book by ID
 * @param {String} id - Book ID
 * @returns {Promise<Object>} - Book data
 */
export const getBookById = async (id) => {
  try {
    const response = await fetch(`/api/books/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch book');
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Get featured books
 * @returns {Promise<Array>} - Array of featured books
 */
export const getFeaturedBooks = async () => {
  try {
    const response = await fetch('/api/books/featured');
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch featured books');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching featured books:', error);
    throw error;
  }
};
