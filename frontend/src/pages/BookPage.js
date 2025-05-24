import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Add this import
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import AuthContext from '../context/AuthContext';
import { apiRequest } from '../services/apiConfig';
import './BookPage.css';

const BookPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);
  
  const { userInfo, toggleBookLike } = useContext(AuthContext);

  // Check if the book is liked by the current user
  const isBookLiked = userInfo?.likedBooks?.includes(id);

  // Function to handle book like/unlike
  const handleLikeToggle = async () => {
    try {
      const result = await toggleBookLike(id);
      if (result) {
        toast.success(`Added "${book.title}" to your bookshelf`);
      } else {
        toast.info(`Removed "${book.title}" from your bookshelf`);
      }
    } catch (err) {
      console.error('Error toggling book like:', err);
      toast.error('Failed to update bookshelf. Please try again.');
    }
  };

  // Function to refresh reviews after adding a new one
  const refreshReviews = () => {
    fetchReviews();
  };

  // Function to fetch book details
  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log the URL being used for debugging
      console.log(`Fetching book details from: https://book-review-platform-wnr7.vercel.app/api/books/${id}`);
      
      const response = await fetch(`https://book-review-platform-wnr7.vercel.app/api/books/${id}`);
      
      // Log response status and headers for debugging
      console.log("Response status:", response.status);
      console.log("Response content-type:", response.headers.get('content-type'));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(`Failed to fetch book: ${response.statusText}`);
      }
      
      // Try to parse the response as JSON
      try {
        const data = await response.json();
        console.log("Book data received:", data);
        setBook(data);
      } catch (jsonError) {
        console.error("JSON parsing error:", jsonError);
        
        // Try to get the raw text to see what was returned
        const responseText = await response.text();
        console.error("Raw response:", responseText);
        throw new Error("Invalid JSON response from server");
      }
    } catch (err) {
      console.error("Error fetching book details:", err);
      setError(err.message || "Failed to fetch book details");
      
      // If API fails, use mock data for demo purposes
      setBook({
        _id: id,
        title: "The Mahabharata",
        author: "Vyasa",
        genre: "Epic",
        description: "One of the two major Sanskrit epics of ancient India, the other being the Ramayana. The Mahabharata narrates the struggle between two groups of cousins in the Kurukshetra War and the fates of the Kaurava and the Pāṇḍava princes and their successors.",
        coverImage: "https://m.media-amazon.com/images/I/81JSM5lKj0L._AC_UF1000,1000_QL80_.jpg",
        publishedYear: "5th century BCE",
        rating: 5,
        numReviews: 1500,
        featured: true
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch reviews
  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      setReviewsError(null);
      
      console.log(`Fetching reviews from: https://book-review-platform-wnr7.vercel.app/api/reviews?bookId=${id}`);
      
      const response = await fetch(`https://book-review-platform-wnr7.vercel.app/api/reviews?bookId=${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Reviews data received:", data);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviewsError(err.message);
      
      // Mock data for demo
      setReviews([
        {
          _id: '1',
          user: { _id: 'u1', name: 'John Doe' },
          rating: 5,
          comment: 'One of the greatest epics ever written. The depth of characters and philosophical discussions are unmatched.',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2',
          user: { _id: 'u2', name: 'Jane Smith' },
          rating: 4,
          comment: 'A complex narrative that weaves together mythology, philosophy, and human drama. Sometimes difficult to follow all the characters.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
    } finally {
      setReviewsLoading(false);
    }
  };

  // Fetch book details and reviews when component mounts
  useEffect(() => {
    fetchBook();
    fetchReviews();
  }, [id]);

  // Generate star rating display
  const renderStars = (rating) => {
    return (
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading book details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Book</h2>
        <p>{error}</p>
        <button onClick={fetchBook} className="retry-button">
          Try Again
        </button>
        <div className="error-details">
          <h3>Technical Details:</h3>
          <pre>{JSON.stringify({error, bookId: id}, null, 2)}</pre>
        </div>
      </div>
    );
  }

  if (!book) {
    return <div className="not-found">Book not found</div>;
  }

  return (
    <div className="book-page">
      <div className="book-details">
        <div className="book-cover-container">
          <img 
            src={book.coverImage || "https://via.placeholder.com/300x450?text=No+Cover+Available"} 
            alt={book.title} 
            className="book-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/300x450?text=No+Cover+Available";
            }} 
          />
          
          {userInfo && (
            <button 
              onClick={handleLikeToggle} 
              className={`like-button ${isBookLiked ? 'liked' : ''}`}
            >
              <i className={`${isBookLiked ? 'fas' : 'far'} fa-heart`}></i> 
              {isBookLiked ? 'In Your Bookshelf' : 'Add to Bookshelf'}
            </button>
          )}
        </div>
        
        <div className="book-info">
          <h1 className="book-title">{book.title}</h1>
          <h2 className="book-author">by {book.author}</h2>
          
          <div className="book-rating">
            {renderStars(book.rating)}
            <span className="rating-value">{book.rating?.toFixed(1)}</span>
            <span className="rating-count">({book.numReviews} reviews)</span>
          </div>
          
          <div className="book-metadata">
            {book.genre && <p><strong>Genre:</strong> {book.genre}</p>}
            {book.publishedYear && <p><strong>Published:</strong> {book.publishedYear}</p>}
            {book.featured && <p className="featured-badge">✨ Featured Book</p>}
          </div>
          
          <div className="book-description">
            <h3>Description</h3>
            <p>{book.description}</p>
          </div>
        </div>
      </div>
      
      <div className="reviews-section">
        <h2>Reviews & Ratings</h2>
        <ReviewForm bookId={id} onReviewAdded={refreshReviews} />
        <ReviewList 
          reviews={reviews} 
          loading={reviewsLoading} 
          error={reviewsError} 
          onRefresh={fetchReviews}
        />
      </div>
    </div>
  );
};

export default BookPage;
