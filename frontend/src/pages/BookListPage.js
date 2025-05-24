import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import AuthContext from '../context/AuthContext';
import { apiRequest } from '../services/apiConfig';

// Create DebugPanel component to avoid importing it separately
const DebugPanel = ({ data, title = "Debug Info" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-800 text-white px-3 py-1 rounded-t-md text-sm"
      >
        {isOpen ? 'Hide' : 'Show'} {title}
      </button>
      
      {isOpen && (
        <div className="bg-gray-900 text-green-400 p-4 rounded-md shadow-lg max-h-96 overflow-auto w-96">
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

const BookCard = ({ book, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { userInfo, toggleBookLike } = useContext(AuthContext); // Add AuthContext
  
  // Check if the book is liked by the user
  const isLiked = userInfo?.likedBooks?.includes(book._id);
  
  // Handle like/unlike book
  const handleToggleLike = (e) => {
    e.preventDefault(); // Prevent navigation to book details page
    e.stopPropagation(); // Stop event propagation
    
    if (!userInfo) {
      toast.info("Please login to add books to your bookshelf");
      return;
    }
    
    toggleBookLike(book._id)
      .then(result => {
        if (result) {
          toast.success(`Added "${book.title}" to your bookshelf`);
        } else {
          toast.info(`Removed "${book.title}" from your bookshelf`);
        }
      })
      .catch(err => {
        toast.error("Failed to update bookshelf");
      });
  };
  
  // Generate random rotation for 3D effect
  const randomRotation = (Math.random() - 0.5) * 5;

  // Better fallback for cover images with genre-specific gradients
  const getGenreGradient = (genre) => {
    const genreMap = {
      'Fantasy': 'from-indigo-500 to-purple-500',
      'Science Fiction': 'from-blue-500 to-cyan-500',
      'Mystery': 'from-slate-700 to-slate-900',
      'Romance': 'from-pink-500 to-red-400',
      'Thriller': 'from-gray-800 to-red-900',
      'Historical Fiction': 'from-amber-700 to-yellow-600',
      'Biography': 'from-green-700 to-emerald-500',
      'Self-Help': 'from-yellow-500 to-orange-500',
      'Philosophy': 'from-slate-600 to-blue-800',
      'Poetry': 'from-purple-400 to-pink-400',
      'Fiction': 'from-emerald-400 to-teal-600',
      'Non-Fiction': 'from-blue-400 to-cyan-600',
      'Children': 'from-rose-400 to-pink-600',
      'Young Adult': 'from-violet-400 to-purple-600',
      'Comic': 'from-yellow-400 to-amber-600',
      'Classics': 'from-stone-500 to-stone-700',
    };
    
    return genreMap[genre] || 'from-amber-400 to-orange-600';
  };
  
  // Get first letter of title and author for fallback cover
  const getInitials = () => {
    const titleInitial = book.title?.charAt(0).toUpperCase() || 'B';
    const authorInitial = book.author?.split(' ')[0]?.charAt(0)?.toUpperCase() || 'A';
    return `${titleInitial}${authorInitial}`;
  };

  // Create a more appealing custom fallback cover
  const renderFallbackCover = () => (
    <div className={`w-full h-full bg-gradient-to-br ${getGenreGradient(book.genre)} flex flex-col items-center justify-center p-3 text-center text-white relative overflow-hidden`}>
      {/* Enhanced abstract book design elements */}
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
      <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute top-1/4 left-1/3 w-12 h-12 bg-white/5 rounded-full"></div>
      
      <div className="relative z-10">
        <span className="text-4xl font-bold drop-shadow-lg font-serif tracking-wider">{getInitials()}</span>
        <div className="w-10 h-0.5 bg-white/70 mx-auto my-2 rounded-full"></div>
        <span className="text-xs font-medium line-clamp-1 drop-shadow-lg font-serif">{book.title}</span>
        <span className="text-[10px] opacity-80 italic line-clamp-1 drop-shadow">{book.author}</span>
      </div>
      
      {/* Genre label with enhanced style */}
      {book.genre && (
        <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md text-[9px] font-medium border border-white/20">
          {book.genre}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        rotateY: 5, 
        rotateX: -3, 
        z: 50,
        boxShadow: "0px 15px 30px -5px rgba(234, 88, 12, 0.5)"
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="perspective-700 transform-3d h-[280px]"
    >
      <Link 
        to={`/books/${book._id}`}
        className="block bg-gradient-to-br from-white to-orange-50 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform-3d preserve-3d h-full border border-orange-200"
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isHovered ? `rotate3d(0.1, 0.1, 0, ${randomRotation}deg)` : '',
          boxShadow: isHovered ? '0 20px 30px -10px rgba(234, 88, 12, 0.4)' : '0 8px 20px -5px rgba(234, 88, 12, 0.2)'
        }}
      >
        {/* Enhanced Book Cover with Shine Effect */}
        <div className="relative aspect-w-3 aspect-h-4 max-h-[180px] bg-gradient-to-br from-orange-100 to-white overflow-hidden">
          {/* Add Bookmark/Like Button */}
          <div className="absolute top-2 right-2 z-30">
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggleLike}
              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-md 
                ${isLiked 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white'}`}
            >
              <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-xs`}></i>
            </motion.button>
          </div>
          
          {/* Always show genre badge on top left - persistent, not just on hover */}
          {book.genre && (
            <div className="absolute top-2 left-2 z-20">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-lg"
              >
                {book.genre}
              </motion.div>
            </div>
          )}

          {/* Shine effect overlay with higher contrast */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0 z-10"
            animate={{
              opacity: isHovered ? [0, 0.7, 0] : 0,
              left: isHovered ? ['-150%', '150%', '150%'] : '-150%',
            }}
            transition={{
              duration: 1,
              ease: "easeInOut",
              times: [0, 0.5, 1],
              repeat: isHovered ? 1 : 0,
              repeatDelay: 0.5
            }}
          />
          
          {/* Book cover image with enhanced error handling */}
          {book.coverImage && !imageError ? (
            <motion.div 
              className="w-full h-full relative overflow-hidden"
              initial={{ scale: 1 }}
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.4 }}
            >
              <img 
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error(`Failed to load image for: ${book.title}`);
                  setImageError(true);
                }}
                loading="lazy"
              />
              
              {/* Enhanced overlay for better text readability with more contrast */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                animate={{ opacity: isHovered ? 0.9 : 0.5 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ) : (
            renderFallbackCover()
          )}
          
          {/* Enhanced book spine effect with more vivid coloring */}
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-orange-700 via-red-600 to-orange-800 transform translate-z-10" 
               style={{ transform: 'translateZ(2px)' }}></div>
          
          {/* Book page effect */}
          <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-orange-50 shadow-inner"></div>
          
          {/* Enhanced title overlay with better contrast */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black via-black/70 to-transparent"
            style={{ 
              opacity: book.coverImage && !imageError ? 1 : 0,
              transform: isHovered ? 'translateY(0)' : 'translateY(100%)', 
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <motion.h3 
              className="text-white font-serif font-bold text-sm truncate drop-shadow-md tracking-wide"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: isHovered ? 0 : 10, opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {book.title}
            </motion.h3>
          </motion.div>
          
          {/* Enhanced featured badge with vibrant colors */}
          {book.featured && (
            <div className="absolute top-2 right-2 z-20">
              <motion.div 
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 500, 
                  damping: 15,
                  delay: index * 0.05 + 0.2
                }}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-yellow-300"
                style={{
                  animation: 'pulse-vivid 2s infinite',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                }}
              >
                ✨ Featured
              </motion.div>
            </div>
          )}
          
          {/* Enhanced rating badge with higher contrast - REMOVED from here, moved to info section */}
        </div>
        
        {/* Enhanced book details section with clearer display of ratings and reviews */}
        <div className="p-3 relative bg-gradient-to-b from-white to-orange-50 transform translate-z-5" style={{ transform: 'translateZ(5px)' }}>
          <motion.h3 
            className="font-serif text-sm font-bold text-orange-950 line-clamp-1 tracking-wide"
            initial={{ y: 0 }}
            animate={{ y: isHovered ? -2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {book.title}
          </motion.h3>
          
          <motion.div
            className="w-7 h-0.5 bg-orange-500 my-1 rounded-full"
            initial={{ width: 7 }}
            animate={{ width: isHovered ? 40 : 7 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          
          <motion.p 
            className="text-orange-800 text-xs mb-2 line-clamp-1 italic"
            initial={{ y: 0 }}
            animate={{ y: isHovered ? -1 : 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            by <span className="font-medium">{book.author}</span>
          </motion.p>
          
          {/* Redesigned rating and review count display */}
          <motion.div 
            className="flex items-center justify-between mt-1 bg-gradient-to-r from-orange-50 to-amber-50 p-1 rounded-lg border border-orange-100"
            initial={{ opacity: 0.8, y: 3 }}
            animate={{ opacity: 1, y: 0, scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <motion.span 
                  key={i} 
                  className={`text-xs ${i < Math.round(book.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: isHovered && i < Math.round(book.rating || 0) ? 1.3 : 1,
                    rotate: isHovered && i < Math.round(book.rating || 0) ? [0, 15, -15, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.2, 
                    delay: 0.05 + i * 0.03,
                    rotate: { repeat: isHovered ? 1 : 0, duration: 0.3 }
                  }}
                >
                  ★
                </motion.span>
              ))}
            </div>
            <div className="flex items-center px-1 py-0.5 bg-orange-100 rounded-md">
              <span className="text-orange-700 text-[9px] font-bold">{book.rating ? book.rating.toFixed(1) : '—'}</span>
              <span className="mx-1 text-orange-300 text-[8px]">|</span>
              <span className="text-orange-600 text-[9px]">
                <i className="fas fa-comment-alt text-[7px] mr-0.5"></i>
                {book.numReviews || 0}
              </span>
            </div>
          </motion.div>
          
          {/* View details button for better call to action */}
          <motion.div 
            className="absolute right-3 bottom-1 bg-orange-600 text-white text-[9px] font-bold flex items-center opacity-0 px-3 py-1 rounded-full shadow-md"
            animate={{ 
              opacity: isHovered ? 1 : 0,
              x: isHovered ? 0 : 5,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            View <i className="fas fa-arrow-right ml-1 text-[8px]"></i>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
};

const BookListPage = () => {
  const { userInfo, toggleBookLike } = useContext(AuthContext); // Make sure toggleBookLike is destructured here
  
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOption, setSortOption] = useState('oldest'); // Changed default sort from 'newest' to 'oldest'
  const [genres, setGenres] = useState([]);
  const [view, setView] = useState('grid'); // 'grid' or 'list' view
  const [filterOpen, setFilterOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  // State for image error handling in list view
  const [imageErrors, setImageErrors] = useState({});

  // Move the CSS style effect inside the component
  useEffect(() => {
    // Add CSS for pulse animation used in featured badge
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(234, 88, 12, 0.7);
        }
        70% {
          box-shadow: 0 0 0 10px rgba(234, 88, 12, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(234, 88, 12, 0);
        }
      }
      
      @keyframes pulse-vivid {
        0% {
          box-shadow: 0 0 0 0 rgba(250, 204, 21, 0.8);
        }
        70% {
          box-shadow: 0 0 0 15px rgba(250, 204, 21, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(250, 204, 21, 0);
        }
      }
      
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-5px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
      .perspective-700 {
        perspective: 700px;
      }
      .transform-3d {
        transform-style: preserve-3d;
      }
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;  
        overflow: hidden;
      }
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;  
        overflow: hidden;
      }
      /* Fancy text styles for book cards */
      .font-serif {
        font-family: 'Libre Baskerville', 'Georgia', serif;
        letter-spacing: 0.02em;
      }
      .book-title-shadow {
        text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.4);
      }
      /* No results button fix */
      .bg-primary-600 {
        background-color: #ea580c;
      }
      .hover\\:bg-primary-700:hover {
        background-color: #c2410c;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Better fallback for cover images with genre-specific gradients
  // Move this function inside BookListPage for access in renderListView
  const getGenreGradient = (genre) => {
    const genreMap = {
      'Fantasy': 'from-indigo-500 to-purple-500',
      'Science Fiction': 'from-blue-500 to-cyan-500',
      'Mystery': 'from-slate-700 to-slate-900',
      'Romance': 'from-pink-500 to-red-400',
      'Thriller': 'from-gray-800 to-red-900',
      'Historical Fiction': 'from-amber-700 to-yellow-600',
      'Biography': 'from-green-700 to-emerald-500',
      'Self-Help': 'from-yellow-500 to-orange-500',
      'Philosophy': 'from-slate-600 to-blue-800',
      'Poetry': 'from-purple-400 to-pink-400',
      'Fiction': 'from-emerald-400 to-teal-600',
      'Non-Fiction': 'from-blue-400 to-cyan-600',
      'Children': 'from-rose-400 to-pink-600',
      'Young Adult': 'from-violet-400 to-purple-600',
      'Comic': 'from-yellow-400 to-amber-600',
      'Classics': 'from-stone-500 to-stone-700',
    };
    
    return genreMap[genre] || 'from-amber-400 to-orange-600';
  };

  // Enhanced fetch books function with improved pagination
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add timestamp to avoid caching issues
      const timestamp = new Date().getTime();
      
      // Use apiRequest utility with the configured backend URL
      const data = await apiRequest(`books?limit=0&timestamp=${timestamp}`);
      
      if (!data.books || !Array.isArray(data.books)) {
        throw new Error('Invalid book data received');
      }
      
      console.log('Books fetched:', data.books.length);
      
      // Process the book data to ensure cover images have proper URLs
      const processedBooks = data.books.map(book => {
        let coverImage = book.coverImage;
        
        // Better handling of cover image URLs
        if (coverImage) {
          // Log the original cover image URL for debugging
          console.log(`Original cover URL for "${book.title}":`, coverImage);
          
          // If it's just a filename or relative path, construct a full URL
          if (!coverImage.match(/^(http|https):\/\//)) {
            // If it begins with a slash, append to origin, otherwise add a slash
            coverImage = coverImage.startsWith('/') 
              ? `${window.location.origin}${coverImage}`
              : `${window.location.origin}/${coverImage}`;
          }
          
          // Log the processed URL
          console.log(`Processed cover URL for "${book.title}":`, coverImage);
        }
        
        return { ...book, coverImage };
      });
      
      setBooks(processedBooks);
      
      // Extract unique genres
      const uniqueGenres = [...new Set(processedBooks.filter(book => book.genre).map(book => book.genre))];
      setGenres(uniqueGenres);
      
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to load books');
      toast.error('Failed to load books: ' + (err.message || 'Unknown error'));
      
      // Add mock data as fallback when API fails
      const mockBooks = [
        { _id: '1', title: 'The Mahabharata', author: 'Vyasa', rating: 5, numReviews: 1500, genre: 'Epic', coverImage: 'https://m.media-amazon.com/images/I/81JSM5lKj0L._AC_UF1000,1000_QL80_.jpg' },
        { _id: '2', title: 'The God of Small Things', author: 'Arundhati Roy', rating: 4, numReviews: 1200, genre: 'Fiction', coverImage: 'https://m.media-amazon.com/images/I/71mytsXgpoL._AC_UF1000,1000_QL80_.jpg' },
        { _id: '3', title: 'Shantaram', author: 'Gregory David Roberts', rating: 5, numReviews: 980, genre: 'Adventure', coverImage: 'https://m.media-amazon.com/images/I/71oYy4zf3iL._AC_UF1000,1000_QL80_.jpg' },
        { _id: '4', title: 'A Fine Balance', author: 'Rohinton Mistry', rating: 4, numReviews: 750, genre: 'Historical Fiction', coverImage: 'https://m.media-amazon.com/images/I/61tz0rTu0NL._AC_UF1000,1000_QL80_.jpg' },
        { _id: '5', title: 'Sacred Games', author: 'Vikram Chandra', rating: 4, numReviews: 890, genre: 'Thriller', coverImage: 'https://m.media-amazon.com/images/I/71xmODEk6SL._AC_UF1000,1000_QL80_.jpg' },
        { _id: '6', title: 'The Rozabal Line', author: 'Ashwin Sanghi', rating: 4, numReviews: 650, genre: 'Historical Fiction', coverImage: 'https://m.media-amazon.com/images/I/81zo3Aj1gsL._AC_UF1000,1000_QL80_.jpg' },
      ];
      setBooks(mockBooks);
      const uniqueGenres = [...new Set(mockBooks.filter(book => book.genre).map(book => book.genre))];
      setGenres(uniqueGenres);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch books on component mount or when refresh key changes
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks, refreshKey]);

  // Add manual refresh function
  const refreshBooks = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  // Filter and sort books based on search term, genre, and sort option
  useEffect(() => {
    if (!books) return;
    
    let result = [...books];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        book => book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre) {
      result = result.filter(book => book.genre === selectedGenre);
    }
    
    // Sort books based on selected option
    switch (sortOption) {
      case 'title_asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title_desc':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'rating_high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'most_reviewed':
        result.sort((a, b) => b.numReviews - a.numReviews);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default:
        // Changed default sort to oldest
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    setFilteredBooks(result);
  }, [books, searchTerm, selectedGenre, sortOption]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle genre selection change
  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setSortOption('oldest'); // Changed default reset value to 'oldest'
  };

  // Animation variants for the container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
      } 
    }
  };

  // Handle image errors in list view
  const handleImageError = (bookId) => {
    setImageErrors(prev => ({
      ...prev,
      [bookId]: true
    }));
  };

  // Refactor renderListView to add like button
  const renderListView = (book, index) => {
    const hasImageError = imageErrors[book._id];
    const isLiked = userInfo?.likedBooks?.includes(book._id);
    
    // Handle like/unlike book
    const handleToggleLike = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!userInfo) {
        toast.info("Please login to add books to your bookshelf");
        return;
      }
      
      toggleBookLike(book._id) // Now toggleBookLike is properly defined
        .then(result => {
          if (result) {
            toast.success(`Added "${book.title}" to your bookshelf`);
          } else {
            toast.info(`Removed "${book.title}" from your bookshelf`);
          }
        })
        .catch(err => {
          toast.error("Failed to update bookshelf");
        });
    };
    
    return (
      <motion.div
        key={book._id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.03 }}
        whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 237, 213, 0.3)' }}
        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 border border-orange-100"
      >
        <Link 
          to={`/books/${book._id}`}
          className="flex overflow-hidden"
        >
          <div className="w-24 h-36 flex-shrink-0 relative overflow-hidden">
            {/* Add like button to list view */}
            <div className="absolute top-1 right-1 z-30">
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleToggleLike}
                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm 
                  ${isLiked 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500 hover:bg-white'}`}
              >
                <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-[8px]`}></i>
              </motion.button>
            </div>
            
            {/* Always show genre badge */}
            {book.genre && (
              <div className="absolute top-1 left-1 z-20">
                <div className="bg-orange-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm">
                  {book.genre}
                </div>
              </div>
            )}
            
            {book.coverImage && !hasImageError ? (
              <img 
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={() => handleImageError(book._id)}
                loading="lazy"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${getGenreGradient(book.genre)} flex items-center justify-center p-2 text-white`}>
                <div className="text-center">
                  <span className="text-xl font-bold block">{book.title.charAt(0)}</span>
                  <span className="text-xs opacity-80">{book.author?.charAt(0) || ''}</span>
                </div>
              </div>
            )}
            
            {/* Book spine effect */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-700 via-amber-600 to-orange-800"></div>
            
            {/* Featured indicator */}
            {book.featured && (
              <div className="absolute bottom-1 right-1 z-20">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white text-[7px] font-bold px-1 py-0.5 rounded-sm shadow-sm">
                  ✨
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-serif font-bold text-gray-900">{book.title}</h3>
                <p className="text-gray-600 text-xs">by {book.author}</p>
              </div>
              
              {/* Improved rating display */}
              <div className="flex items-center bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-sm font-medium text-orange-800">{book.rating ? book.rating.toFixed(1) : '—'}</span>
                <span className="mx-1 text-orange-300 text-xs">|</span>
                <span className="text-xs text-orange-700">
                  <i className="fas fa-comment-alt text-[8px] mr-1"></i>
                  {book.numReviews || 0}
                </span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center">
                {/* Read more button */}
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-orange-600 text-xs font-medium flex items-center"
                >
                  Read more <i className="fas fa-chevron-right ml-1 text-[8px]"></i>
                </motion.span>
              </div>
              
              {/* Published year if available */}
              {book.publishedYear && (
                <span className="text-xs text-gray-500">
                  {book.publishedYear}
                </span>
              )}
            </div>
          </div>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-white">
      {/* Add debug panel to help diagnose issues */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel 
          data={{ 
            booksCount: books.length,
            filteredBooksCount: filteredBooks.length,
            genres
          }} 
          title="Books Data"
        />
      )}

      {/* Dynamic Hero Background */}
      <div className="relative bg-gradient-to-b from-orange-600 to-amber-600 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute top-0 -right-20 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 -left-20 w-72 h-72 bg-red-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-1/3 left-1/3 w-40 h-40 bg-amber-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.h1 
              className="font-serif text-4xl md:text-5xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Discover Your Next Great Read
            </motion.h1>
            
            <motion.p 
              className="text-lg text-orange-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Explore our curated collection of books spanning various genres, from timeless classics to contemporary masterpieces.
            </motion.p>
            
            <motion.div
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-1 flex overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ boxShadow: '0 0 15px rgba(255,255,255,0.3)' }}
            >
              <input
                type="text"
                placeholder="Search by title, author or keyword..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-transparent text-white placeholder-white/60 px-4 py-3 focus:outline-none"
              />
              <motion.button 
                className="bg-white text-orange-700 px-6 py-2 rounded-lg font-medium hover:bg-white/90 transition-colors flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-search mr-2"></i>
                Search
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Book icon divider */}
      <div className="relative h-6 overflow-hidden">
        <div className="absolute left-0 right-0 -top-3 h-6">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#f97316" fillOpacity="1" d="M0,160L48,138.7C96,117,192,75,288,69.3C384,64,480,96,576,128C672,160,768,192,864,181.3C960,171,1056,117,1152,96C1248,75,1344,85,1392,90.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-4 md:mb-0">
              {searchTerm ? `Search results for "${searchTerm}"` : 'Browse All Books'}
            </h2>
            
            <div className="flex items-center space-x-3">
              {/* Add refresh button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refreshBooks}
                className="flex items-center text-orange-700 border border-orange-300 rounded-lg px-4 py-2 hover:bg-orange-50 transition-colors"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh Books
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <i className="fas fa-filter mr-2"></i>
                {filterOpen ? 'Hide Filters' : 'Show Filters'}
              </motion.button>
              
              <div className="bg-white border border-gray-200 rounded-lg flex overflow-hidden">
                <button 
                  onClick={() => setView('grid')} 
                  className={`px-3 py-2 ${view === 'grid' ? 'bg-gray-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button 
                  onClick={() => setView('list')} 
                  className={`px-3 py-2 ${view === 'list' ? 'bg-gray-100 text-primary-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {filterOpen && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Genre</label>
                      <select
                        value={selectedGenre}
                        onChange={handleGenreChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="">All Genres</option>
                        {genres.map(genre => (
                          <option key={genre} value={genre}>{genre}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="oldest">Oldest First</option> {/* Moved this option to the top */}
                        <option value="newest">Newest First</option>
                        <option value="title_asc">Title (A-Z)</option>
                        <option value="title_desc">Title (Z-A)</option>
                        <option value="rating_high">Highest Rated</option>
                        <option value="rating_low">Lowest Rated</option>
                        <option value="most_reviewed">Most Reviewed</option>
                      </select>
                    </div>
                    
                    <div className="md:col-span-2 flex items-end">
                      <button 
                        onClick={clearFilters}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none flex items-center"
                      >
                        <i className="fas fa-sync-alt mr-2"></i>
                        Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span className="font-medium">
              Showing {filteredBooks.length} of {books.length} books
            </span>
            
            {selectedGenre && (
              <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                Genre: {selectedGenre}
                <button 
                  onClick={() => setSelectedGenre('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
            
            {searchTerm && (
              <span className="bg-gray-100 px-2 py-1 rounded-full flex items-center">
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </span>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 relative">
              <motion.div 
                className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-book text-orange-600 animate-pulse"></i>
              </div>
            </div>
            <p className="text-orange-800 font-medium">Loading your literary adventures...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-center rounded-xl p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10, stiffness: 100 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-red-500 text-2xl"
            >
              <i className="fas fa-exclamation"></i>
            </motion.div>
            <h3 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchBooks}
              className="bg-red-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              <i className="fas fa-redo mr-2"></i> Try Again
            </motion.button>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="bg-white border border-orange-200 rounded-xl p-12 text-center shadow-md">
            <motion.img 
              src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" 
              alt="No books found"
              className="w-48 h-48 mx-auto mb-4 rounded-full object-cover"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Books Found</h3>
            <p className="text-gray-600 mb-6">We couldn't find any books matching your criteria.</p>
            <button 
              onClick={clearFilters}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-between items-center">
              <p className="text-gray-700">
                <span className="font-semibold">{filteredBooks.length}</span> books displayed
              </p>
            </div>
            
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={view === 'grid' ? 
                "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6" : 
                "space-y-3"
              }
            >
              {filteredBooks.map((book, index) => (
                view === 'grid' ? (
                  <BookCard key={book._id} book={book} index={index} />
                ) : (
                  renderListView(book, index)
                )
              ))}
            </motion.div>
            
            {/* Book page divider */}
            <div className="flex items-center my-12">
              <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
              <div className="px-4 text-orange-500">
                <i className="fas fa-book"></i>
              </div>
              <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>
            </div>
          </>
        )}
        
        {/* Pagination - only show if we have enough books */}
        {filteredBooks.length > 20 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center space-x-1">
              <motion.button 
                className="px-2 py-2 border border-orange-300 text-orange-800 rounded-lg hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-chevron-left"></i>
              </motion.button>
              
              <motion.button 
                className="px-4 py-2 bg-orange-600 text-white rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                1
              </motion.button>
              <motion.button 
                className="px-4 py-2 border border-orange-300 text-orange-800 rounded-lg hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                2
              </motion.button>
              <motion.button 
                className="px-4 py-2 border border-orange-300 text-orange-800 rounded-lg hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                3
              </motion.button>
              
              <motion.button 
                className="px-2 py-2 border border-orange-300 text-orange-800 rounded-lg hover:bg-orange-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
