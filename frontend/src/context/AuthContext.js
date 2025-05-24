import React, { createContext, useState, useEffect } from 'react';
import { apiRequest, getApiUrl } from '../services/apiConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Get user info from local storage if exists
  const [userInfo, setUserInfo] = useState(
    localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null
  );
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Store user info in local storage when it changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  // Function to login user with improved error handling
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest('users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      setUserInfo(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to register new user
  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      // Send register request to backend
      const response = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      const data = await response.json();
      
      // Check if registration was successful
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Save user data and return it
      setUserInfo(data);
      setLoading(false);
      return data;
    } catch (err) {
      // Handle errors
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Simple logout function that clears user data
  const logout = () => {
    setUserInfo(null);
  };

  // Function to update user profile data
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      // Need token for authorization
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, // Include JWT token for auth
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }
      
      // Update the user info with new data
      setUserInfo({ ...userInfo, ...data });
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Modified loginAsAdmin to include a secret code verification
  const loginAsAdmin = (secretCode) => {
    try {
      // Verify the secret code (38)
      if (secretCode !== "38") {
        setError('Invalid admin secret code');
        return false;
      }

      // Create hardcoded admin user data with a properly formatted JWT token
      const adminUserData = {
        _id: 'admin123456',
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
        bio: 'System administrator',
        favoriteGenres: [],
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTIzNDU2IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjE2MTIzNDU2fQ.hMWGYzxcnNb7eTF5j6xc6LAZGGGNWxYIdrGIDpZk9eM',
        likedBooks: [], // Initialize empty likedBooks array
      };
      
      localStorage.setItem('userInfo', JSON.stringify(adminUserData));
      setUserInfo(adminUserData);
      setError(null);
      return true;
    } catch (error) {
      setError('Admin login failed');
      return false;
    }
  };

  // Add like/dislike book functionality using apiRequest
  const toggleBookLike = async (bookId) => {
    try {
      if (!userInfo) {
        throw new Error('You must be logged in to like books');
      }

      // Update in local state first for responsive UI
      let updatedLikedBooks;
      const isCurrentlyLiked = userInfo.likedBooks?.includes(bookId);
      
      if (isCurrentlyLiked) {
        // Remove bookId from likedBooks
        updatedLikedBooks = userInfo.likedBooks.filter(id => id !== bookId);
      } else {
        // Add bookId to likedBooks
        updatedLikedBooks = [...(userInfo.likedBooks || []), bookId];
      }
      
      // Update user info in state and localStorage
      const updatedUserInfo = { ...userInfo, likedBooks: updatedLikedBooks };
      setUserInfo(updatedUserInfo);
      localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
      
      // Make API call using apiRequest utility
      try {
        await apiRequest(`books/${bookId}/like`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
      } catch (apiError) {
        console.log('API call failed but continuing with local state:', apiError);
      }
      
      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Error toggling book like:', error);
      throw error;
    }
  };

  // Add like comment functionality
  const toggleCommentLike = async (reviewId) => {
    if (!userInfo) {
      setError('Please login to like comments');
      return false;
    }

    try {
      // Check if comment is already liked
      const isLiked = userInfo.likedComments && userInfo.likedComments.includes(reviewId);
      
      // Create new array of liked comments
      let updatedLikedComments;
      
      if (isLiked) {
        // Remove from liked comments if already liked
        updatedLikedComments = userInfo.likedComments.filter(id => id !== reviewId);
      } else {
        // Add to liked comments if not already liked
        updatedLikedComments = [...(userInfo.likedComments || []), reviewId];
      }
      
      // Update user info with new liked comments array
      const updatedUserInfo = {
        ...userInfo,
        likedComments: updatedLikedComments
      };
      
      setUserInfo(updatedUserInfo);
      
      // Call API to update likes in the backend
      if (userInfo.token !== 'admin-token-123456') { // Skip API call for admin demo user
        await fetch(`/api/reviews/${reviewId}/like`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          }
        });
      }
      
      return !isLiked; // Return new like state
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  // Update context value with new functions
  const contextValue = {
    userInfo,
    error,
    loading,
    login,
    logout,
    register,
    updateProfile,
    loginAsAdmin,
    toggleBookLike,
    toggleCommentLike
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
