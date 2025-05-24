import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import AuthContext from '../context/AuthContext';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  
  const { userInfo, toggleBookLike } = useContext(AuthContext);
  const navigate = useNavigate();

  // Define fetchBook using useCallback to avoid recreating it on each render
  const fetchBook = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/books/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch book details');
      }
      
      const data = await response.json();
      setBook(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Define fetchReviews using useCallback
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const response = await fetch(`/api/reviews?bookId=${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }
      
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setReviewsError(err.message);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  // Check if book is liked by current user
  useEffect(() => {
    if (userInfo && userInfo.likedBooks && book) {
      setIsLiked(userInfo.likedBooks.includes(id));
    }
  }, [userInfo, book, id]);

  // Fetch like counts
  const fetchLikeStats = useCallback(async () => {
    try {
      const response = await fetch(`/api/books/${id}/likes`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch like statistics');
      }
      
      const data = await response.json();
      setLikeCount(data.likes || 0);
    } catch (err) {
      console.error('Error fetching like stats:', err);
    }
  }, [id]);

  // Fetch book data when component mounts or id changes
  useEffect(() => {
    fetchBook();
    fetchLikeStats();
  }, [fetchBook, fetchLikeStats]);

  // Fetch reviews when component mounts or id changes
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle when a new review is added
  const handleReviewAdded = () => {
    // Refetch both book and reviews to get updated ratings
    fetchBook();
    fetchReviews();
  };

  // Handle book like/dislike
  const handleToggleLike = async () => {
    if (!userInfo) {
      toast.info('Please login to like books');
      navigate('/login');
      return;
    }
    
    const newLikeState = await toggleBookLike(id);
    
    if (newLikeState !== null) {
      setIsLiked(newLikeState);
      
      // Update like count based on new state
      if (newLikeState) {
        setLikeCount(prev => prev + 1);
        toast.success('Book added to your favorites!');
      } else {
        setLikeCount(prev => Math.max(0, prev - 1));
        toast.info('Book removed from your favorites');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-primary text-4xl mb-4"></i>
          <p className="text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center bg-red-50 text-red-600 p-6 rounded-lg max-w-md mx-auto">
          <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center bg-gray-50 p-6 rounded-lg max-w-md mx-auto">
          <i className="fas fa-book-dead text-4xl text-gray-400 mb-4"></i>
          <p className="text-gray-600">Book not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Breadcrumb navigation */}
      <nav className="flex text-sm font-medium text-gray-500 mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-primary-700 transition-colors">Home</Link>
          </li>
          <li className="flex items-center">
            <i className="fas fa-chevron-right text-xs mx-2"></i>
            <Link to="/books" className="hover:text-primary-700 transition-colors">Books</Link>
          </li>
          <li className="flex items-center">
            <i className="fas fa-chevron-right text-xs mx-2"></i>
            <span className="text-gray-700">{book?.title}</span>
          </li>
        </ol>
      </nav>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-gray-100" data-aos="fade-up">
        <div className="lg:flex">
          {/* Book cover section with gradient background */}
          <div className="lg:w-1/3 bg-gradient-to-br from-primary-50 to-secondary-50 p-8 flex justify-center items-center">
            <div className="relative w-64 h-96 group">
              {book.coverImage ? (
                <img 
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-full object-cover rounded-lg shadow-lg transform transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x600?text=Cover+Not+Available';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                  <span className="text-gray-400 text-lg">Cover image not available</span>
                </div>
              )}
              {book.featured && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-3 shadow-lg">
                  Featured
                </div>
              )}
              
              {/* Add book status badge */}
              <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {book.status || 'Available'}
              </div>
            </div>
          </div>
          
          {/* Book details section */}
          <div className="lg:w-2/3 p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-700 italic">by <span className="font-medium">{book.author}</span></p>
              </div>
              
              {/* Book actions */}
              <div className="mt-4 lg:mt-0 flex items-center space-x-3">
                <button 
                  onClick={handleToggleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                    isLiked 
                      ? 'bg-accent-100 text-accent-600 hover:bg-accent-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  data-aos="zoom-in"
                  data-aos-delay="200"
                >
                  <i className={`${isLiked ? 'fas' : 'far'} fa-heart`}></i>
                  <span>{likeCount > 0 ? likeCount : ''}</span>
                </button>
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all">
                    <i className="fas fa-share-alt"></i>
                    <span className="sr-only">Share</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 p-2 hidden group-hover:block z-10 animate-slide-up">
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center">
                      <i className="fab fa-facebook text-blue-600 w-5"></i>
                      <span>Facebook</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center">
                      <i className="fab fa-twitter text-blue-400 w-5"></i>
                      <span>Twitter</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-50 flex items-center">
                      <i className="fas fa-envelope text-gray-600 w-5"></i>
                      <span>Email</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Book rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center bg-amber-50 px-3 py-1 rounded-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`text-2xl ${i < Math.round(book.rating) ? 'text-amber-400' : 'text-gray-300'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="ml-2 font-semibold text-gray-800">{book.rating ? book.rating.toFixed(1) : '0.0'}</span>
                <span className="ml-1 text-gray-600">({book.numReviews || 0} {book.numReviews === 1 ? 'review' : 'reviews'})</span>
              </div>
              
              <div className="ml-4 text-sm text-gray-600">
                <span className="font-medium">Published:</span> {book.publishedYear}
              </div>
            </div>
            
            {/* Book tags and genre */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="px-3 py-1 bg-primary-50 text-primary-700 text-sm font-medium rounded-full">
                {book.genre}
              </span>
              {book.tags && book.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Book description */}
            <div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-book-open text-primary-600 mr-2"></i>
                About this book
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>
            
            {/* Additional book details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Pages</p>
                <p className="text-lg font-medium text-gray-800">{book.pages || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Language</p>
                <p className="text-lg font-medium text-gray-800">{book.language || 'English'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">Publisher</p>
                <p className="text-lg font-medium text-gray-800">{book.publisher || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-gray-500">ISBN</p>
                <p className="text-lg font-medium text-gray-800">{book.isbn || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 order-2 md:order-1">
          <ReviewList 
            reviews={reviews} 
            loading={reviewsLoading} 
            error={reviewsError} 
          />
        </div>
        <div className="md:col-span-4 order-1 md:order-2">
          <div className="sticky top-24">
            <ReviewForm bookId={id} onReviewAdded={handleReviewAdded} />
            
            {/* Similar books recommendation */}
            <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100" data-aos="fade-up">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <i className="fas fa-bookmark text-primary-600 mr-2"></i>
                Similar Books
              </h3>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">If you enjoyed this book, you might also like:</p>
                <div className="flex overflow-x-auto pb-2 space-x-4 scrollbar-hide">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex-shrink-0 w-32">
                      <div className="bg-gray-200 w-full h-48 rounded-lg animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mt-2 w-5/6 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded mt-2 w-4/6 animate-pulse"></div>
                    </div>
                  ))}
                </div>
                <button className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center">
                  View More <i className="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPage;
