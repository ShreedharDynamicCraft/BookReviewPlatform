import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const BookshelfPage = () => {
  const { userInfo, toggleBookLike } = useContext(AuthContext);
  const [likedBooks, setLikedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to properly handle API requests with better error handling
  const fetchFromAPI = async (url) => {
    const response = await fetch(url);
    
    if (!response.ok) {
      // Try to parse error as JSON first
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch data');
      } catch (jsonError) {
        // If JSON parsing fails, use text
        const errorText = await response.text();
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}...`);
      }
    }
    
    // Successful response, parse as JSON
    return response.json();
  };

  useEffect(() => {
    const fetchLikedBooks = async () => {
      if (!userInfo || !userInfo.likedBooks || userInfo.likedBooks.length === 0) {
        setLikedBooks([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use the fully qualified URL to avoid proxy issues
        const ids = userInfo.likedBooks.join(',');
        console.log("Fetching books with IDs:", ids);
        
        // Use our improved fetch function
        const baseUrl = process.env.REACT_APP_API_URL || '';
        const url = `${baseUrl}/api/bookshelf?ids=${ids}`;
        console.log("API URL:", url);
        
        const data = await fetchFromAPI(url);
        console.log("Books fetched:", data);
        setLikedBooks(data);
      } catch (err) {
        console.error('Error fetching bookshelf:', err);
        setError(err.message || 'Failed to fetch your bookshelf');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedBooks();
  }, [userInfo]);

  // Handle removing a book from bookshelf
  const handleRemoveBook = async (bookId) => {
    try {
      const result = await toggleBookLike(bookId);
      if (result === false) {
        // Book was unliked, so remove it from the displayed list
        setLikedBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
        toast.success('Book removed from your bookshelf');
      }
    } catch (err) {
      toast.error('Failed to update your bookshelf');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-indigo-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold mb-4">My Bookshelf</h1>
            <p className="text-lg max-w-2xl mx-auto">
              {userInfo ? 
                `Welcome back, ${userInfo.name}! Here are all the books you've liked.` :
                'Please sign in to view your bookshelf'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!userInfo ? (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-indigo-500 text-5xl mb-4">
              <i className="fas fa-user-lock"></i>
            </div>
            <h2 className="text-xl font-bold mb-4">Sign in to view your bookshelf</h2>
            <p className="text-gray-600 mb-6">Your bookshelf helps you keep track of books you're interested in.</p>
            <Link 
              to="/login" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign In <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </motion.div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div 
              className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-indigo-700 mt-4 font-medium">Loading your bookshelf...</p>
          </div>
        ) : error ? (
          <motion.div 
            className="bg-red-50 border border-red-100 rounded-xl p-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-red-500 text-5xl mb-4">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-4">Something went wrong</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <details className="mb-6 text-left bg-red-100 p-3 rounded-md">
              <summary className="cursor-pointer text-red-700 font-medium">Technical Details</summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-red-50 rounded whitespace-pre-wrap">
                {error}
              </pre>
            </details>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </motion.div>
        ) : likedBooks.length === 0 ? (
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-amber-500 text-5xl mb-4">
              <i className="fas fa-book-open"></i>
            </div>
            <h2 className="text-xl font-bold mb-4">Your bookshelf is empty</h2>
            <p className="text-gray-600 mb-6">Start adding books to your collection by clicking the heart icon on books you like.</p>
            <Link 
              to="/books" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Books <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </motion.div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Your Collection ({likedBooks.length})</h2>
              <Link to="/books" className="text-indigo-600 hover:text-indigo-800 flex items-center">
                <i className="fas fa-arrow-left mr-2"></i> Browse More Books
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedBooks.map((book, index) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative h-48 bg-gray-200">
                    {book.coverImage ? (
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/300x450?text=No+Cover";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                        <span className="text-4xl font-bold">{book.title.charAt(0)}</span>
                      </div>
                    )}
                    
                    {/* Remove from bookshelf button */}
                    <button
                      onClick={() => handleRemoveBook(book._id)}
                      className="absolute top-2 right-2 bg-white/90 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-full p-2 shadow-md transition-colors"
                      title="Remove from bookshelf"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                    
                    {/* Genre badge */}
                    {book.genre && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-md">
                          {book.genre}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">by {book.author}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-sm font-medium">{book.rating?.toFixed(1) || 'N/A'}</span>
                        <span className="mx-1 text-gray-400">|</span>
                        <span className="text-xs text-gray-500">{book.numReviews || 0} reviews</span>
                      </div>
                      <Link
                        to={`/books/${book._id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookshelfPage;
