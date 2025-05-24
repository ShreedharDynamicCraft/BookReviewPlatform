import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const ReviewList = ({ reviews, loading, error }) => {
  const { userInfo, toggleCommentLike } = useContext(AuthContext);
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle like toggle for a review
  const handleLikeReview = async (reviewId) => {
    if (!userInfo) {
      toast.info('Please login to like reviews');
      return;
    }
    
    const success = await toggleCommentLike(reviewId);
    
    if (success) {
      toast.success('Review liked!');
    } else if (success === false) {
      toast.info('Like removed');
    }
  };

  // Check if a review is liked by the current user
  const isReviewLiked = (reviewId) => {
    return userInfo && 
           userInfo.likedComments && 
           userInfo.likedComments.includes(reviewId);
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <i className="fas fa-spinner fa-spin text-primary text-3xl mb-3"></i>
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-6 rounded-xl text-center">
        <i className="fas fa-exclamation-circle text-3xl mb-3"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-xl text-center">
        <i className="fas fa-comment-slash text-gray-400 text-4xl mb-4"></i>
        <h3 className="text-xl font-medium text-gray-700 mb-2">No Reviews Yet</h3>
        <p className="text-gray-600">Be the first to share your thoughts on this book!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6 flex items-center">
        Reader Reviews 
        <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {reviews.length}
        </span>
      </h2>
      
      <div className="space-y-6">
        {reviews.map((review) => (
          <div 
            key={review._id} 
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                  {review.user && (
                    <Link 
                      to={`/profile/${review.user._id}`} 
                      className="font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                        <i className="fas fa-user"></i>
                      </div>
                      {review.user.name}
                    </Link>
                  )}
                </div>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>
              
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => handleLikeReview(review._id)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md text-sm transition-all ${
                    isReviewLiked(review._id)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <i className={`${isReviewLiked(review._id) ? 'fas' : 'far'} fa-thumbs-up`}></i>
                  <span>{review.likes > 0 ? review.likes : 'Helpful'}</span>
                </button>
                
                <div className="text-right text-sm text-gray-500 italic">
                  {review.createdAt ? formatDate(review.createdAt) : 'Recently added'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
