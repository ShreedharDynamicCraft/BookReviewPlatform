import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { apiRequest } from '../services/apiConfig';
import './ReviewForm.css';

const ReviewForm = ({ bookId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userInfo) {
      toast.info('Please login to submit a review');
      navigate('/login');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const data = await apiRequest('reviews', {
        method: 'POST',
        token: userInfo.token,
        body: JSON.stringify({
          rating,
          comment,
          bookId,
        }),
      });
      
      // Reset form fields
      setRating(0);
      setComment('');
      
      // Notify parent component that a review was added
      onReviewAdded();
      
      toast.success('Review submitted successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-5 px-6">
        <h3 className="text-white font-semibold text-lg flex items-center">
          <i className="fas fa-star mr-2"></i>
          Write a Review
        </h3>
      </div>
      
      {!userInfo ? (
        <div className="p-6">
          <div className="text-center py-6 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <i className="fas fa-user-lock text-2xl"></i>
            </div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Login to Share Your Thoughts</h4>
            <p className="text-gray-600 mb-6">Join our community to review this book and discover personalized recommendations.</p>
            <button 
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
            >
              <i className="fas fa-sign-in-alt mr-2"></i> Sign in to Review
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Don't have an account? <button onClick={() => navigate('/register')} className="text-primary-600 font-medium hover:underline">Register</button>
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">How would you rate this book?</label>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={ratingValue}
                      className={`text-4xl focus:outline-none transform transition-transform ${
                        ratingValue <= (hoverRating || rating)
                          ? 'text-yellow-400 hover:scale-110'
                          : 'text-gray-300 hover:text-yellow-200 hover:scale-110'
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </button>
                  );
                })}
              </div>
              <span className="ml-2 text-xl font-medium text-gray-800">
                {rating > 0 ? rating + '/5' : ''}
              </span>
            </div>
            {rating > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                {rating === 1 && 'Poor - Not recommended'}
                {rating === 2 && 'Fair - Has some issues'}
                {rating === 3 && 'Good - Enjoyable read'}
                {rating === 4 && 'Great - Highly recommended'}
                {rating === 5 && 'Excellent - A must-read!'}
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label htmlFor="comment" className="block font-medium text-gray-700 mb-2">
              Share your thoughts:
            </label>
            <div className="relative">
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What did you like or dislike about this book? Would you recommend it to others?"
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                required
              ></textarea>
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {comment.length} / 10+ characters
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-8">
            <div className="text-sm text-gray-500 italic">
              <i className="fas fa-info-circle mr-1"></i> Your review will be publicly visible
            </div>
            <button 
              type="submit" 
              className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-medium hover:from-primary-700 hover:to-secondary-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={submitting || comment.length < 10 || rating === 0}
            >
              {submitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Publish Review
                </>
              )}
            </button>
          </div>
          
        </form>
      )}
    </div>
  );
};

export default ReviewForm;
