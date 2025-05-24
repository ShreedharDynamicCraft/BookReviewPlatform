import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { apiRequest } from '../services/apiConfig';
import './ReviewList.css';

const ReviewList = ({ reviews, loading, error, onRefresh }) => {
  const { userInfo, toggleCommentLike } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Handle like/unlike review
  const handleToggleLike = async (reviewId) => {
    if (!userInfo) {
      toast.info('Please login to like reviews');
      navigate('/login');
      return;
    }
    
    try {
      await toggleCommentLike(reviewId);
      // No need to call onRefresh since the likes are handled in the UI
    } catch (err) {
      toast.error('Failed to update review likes');
    }
  };
  
  if (loading) {
    return (
      <div className="reviews-loading">
        <i className="fas fa-spinner"></i>
        <p>Loading reviews...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="reviews-error">
        <i className="fas fa-exclamation-circle"></i>
        <p>{error}</p>
        <button onClick={onRefresh} className="px-4 py-2 mt-4 bg-blue-600 text-white rounded">
          Try Again
        </button>
      </div>
    );
  }
  
  if (!reviews || reviews.length === 0) {
    return (
      <div className="no-reviews">
        <i className="fas fa-comments"></i>
        <p>No reviews yet. Be the first to review!</p>
      </div>
    );
  }
  
  return (
    <div className="reviews-list">
      <h2>Reader Reviews <span className="review-count">({reviews.length})</span></h2>
      
      {reviews.map((review, index) => (
        <motion.div 
          key={review._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="review-card"
        >
          <div className="review-header">
            <div className="reviewer-info">
              <a href={`/profile/${review.user?._id}`} className="reviewer-name">
                <i className="fas fa-user-circle"></i>
                {review.user?.name || 'Unknown User'}
              </a>
            </div>
            
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < review.rating ? 'star-filled' : 'star-empty'}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          <div className="review-content">
            {review.comment}
          </div>
          
          <div className="review-footer">
            <span className="review-date">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ReviewList;
