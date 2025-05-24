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

  // Function to login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest('users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      setUserInfo(data);
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
      const data = await apiRequest('users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });
      
      setUserInfo(data);
      return data;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Simple logout function that clears user data
  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('userInfo');
  };

  // Function to update user profile data
  const updateProfile = async (userId, userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiRequest(`users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        token: userInfo?.token
      });
      
      setUserInfo(prev => ({
        ...prev,
        ...data
      }));
      return data;
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Modified loginAsAdmin to include a secret code verification
  const loginAsAdmin = (secretCode) => {
    try {
      if (secretCode !== "38") {
        setError('Invalid admin secret code');
        return false;
      }

      // Create hardcoded admin user data
      const adminUserData = {
        _id: 'admin123456',
        name: 'Admin User',
        email: 'admin@example.com',
        isAdmin: true,
        bio: 'System administrator',
        favoriteGenres: [],
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFkbWluMTIzNDU2IiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNjE2MTIzNDU2fQ.hMWGYzxcnNb7eTF5j6xc6LAZGGGNWxYIdrGIDpZk9eM',
        likedBooks: [],
      };
      
      setUserInfo(adminUserData);
      setError(null);
      return true;
    } catch (error) {
      setError('Admin login failed');
      return false;
    }
  };

  // Add like/dislike book functionality
  const toggleBookLike = async (bookId) => {
    try {
      if (!userInfo) {
        throw new Error('You must be logged in to like books');
      }
      
      // Optimistic update - assume the API call will succeed
      const isCurrentlyLiked = userInfo.likedBooks?.includes(bookId);
      
      // Update local state first for better UX
      let updatedLikedBooks = [...(userInfo.likedBooks || [])];
      
      if (isCurrentlyLiked) {
        updatedLikedBooks = updatedLikedBooks.filter(id => id !== bookId);
      } else {
        updatedLikedBooks.push(bookId);
      }
      
      setUserInfo(prev => ({
        ...prev,
        likedBooks: updatedLikedBooks
      }));
      
      // Make the actual API call
      await apiRequest(`books/${bookId}/like`, {
        method: 'PUT',
        token: userInfo.token
      });
      
      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Error toggling book like:', error);
      throw error;
    }
  };

  // Add like comment functionality
  const toggleCommentLike = async (reviewId) => {
    try {
      if (!userInfo) {
        throw new Error('You must be logged in to like reviews');
      }
      
      // Make API call to like/unlike review
      const data = await apiRequest(`reviews/${reviewId}/like`, {
        method: 'PUT',
        token: userInfo.token
      });
      
      return data;
    } catch (error) {
      console.error('Error toggling review like:', error);
      throw error;
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
