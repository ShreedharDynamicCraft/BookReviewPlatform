// importing stuff i need
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { apiRequest, getApiUrl } from '../services/apiConfig';
import './AdminDashboard.css';

// Debug panel to show API responses/errors
const DebugPanel = ({ isOpen, data, onClose }) => (
  <div className={`fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-lg max-h-96 overflow-auto z-50 transition-all ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold">Debug Information</h3>
      <button onClick={onClose} className="text-gray-400 hover:text-white">×</button>
    </div>
    <pre className="text-xs text-green-400">{JSON.stringify(data, null, 2)}</pre>
  </div>
);

// admin dashboard component
const AdminDashboard = () => {
  // states for storing data
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  const [debugInfo, setDebugInfo] = useState({});
  const [showDebug, setShowDebug] = useState(false);

  // get auth context and navigation
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Verify admin status and redirect if not admin
  useEffect(() => {
    if (!userInfo) {
      toast.error('Please login to access the admin dashboard');
      navigate('/login');
      return;
    }

    if (!userInfo.isAdmin) {
      toast.error('You do not have admin privileges');
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  // Function to fetch books data with better error handling
  const fetchBooks = async () => {
    try {
      // Log the API URL for debugging
      const apiUrl = getApiUrl('books');
      console.log('Fetching books from:', apiUrl);
      
      // Make the API request
      const response = await fetch(apiUrl);
      console.log('Books response status:', response.status);
      
      // Check if response is valid
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      // Parse response as JSON
      const data = await response.json();
      
      // Save debug info
      setDebugInfo(prev => ({
        ...prev,
        books: {
          url: apiUrl,
          status: response.status,
          data: data
        }
      }));
      
      // Set books state
      setBooks(data.books || []);
      
      return data.books || [];
    } catch (err) {
      console.error('Error fetching books:', err);
      setDebugInfo(prev => ({
        ...prev,
        booksError: err.message
      }));
      
      // Use mock data as fallback
      const mockBooks = [
        { _id: '1', title: 'The Mahabharata', author: 'Vyasa', genre: 'Epic', rating: 5, numReviews: 1500, featured: true },
        { _id: '2', title: 'The God of Small Things', author: 'Arundhati Roy', genre: 'Fiction', rating: 4, numReviews: 1200, featured: false },
        { _id: '3', title: 'Shantaram', author: 'Gregory David Roberts', genre: 'Adventure', rating: 5, numReviews: 980, featured: false }
      ];
      
      setBooks(mockBooks);
      return mockBooks;
    }
  };

  // Function to fetch users data with better error handling
  const fetchUsers = async () => {
    if (!userInfo || !userInfo.token) {
      return [];
    }

    try {
      // Log the API URL for debugging
      const apiUrl = getApiUrl('users');
      console.log('Fetching users from:', apiUrl);
      
      // Make the API request with authentication
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Users response status:', response.status);
      
      // Check if response is valid
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      // Parse response as JSON
      const data = await response.json();
      
      // Save debug info
      setDebugInfo(prev => ({
        ...prev,
        users: {
          url: apiUrl,
          status: response.status,
          data: data
        }
      }));
      
      // Set users state
      setUsers(data || []);
      
      return data || [];
    } catch (err) {
      console.error('Error fetching users:', err);
      setDebugInfo(prev => ({
        ...prev,
        usersError: err.message
      }));
      
      // Use mock data as fallback
      const mockUsers = [
        { _id: '1', name: 'Admin User', email: 'admin@example.com', isAdmin: true },
        { _id: '2', name: 'John Doe', email: 'john@example.com', isAdmin: false },
        { _id: '3', name: 'Jane Smith', email: 'jane@example.com', isAdmin: false }
      ];
      
      setUsers(mockUsers);
      return mockUsers;
    }
  };

  // Function to fetch reviews data with better error handling
  const fetchReviews = async () => {
    if (!userInfo || !userInfo.token) {
      return [];
    }

    try {
      // Log the API URL for debugging
      const apiUrl = getApiUrl('reviews/all');
      console.log('Fetching reviews from:', apiUrl);
      
      // Make the API request with authentication
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Reviews response status:', response.status);
      
      // Check if response is valid
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
      
      // Parse response as JSON
      const data = await response.json();
      
      // Save debug info
      setDebugInfo(prev => ({
        ...prev,
        reviews: {
          url: apiUrl,
          status: response.status,
          data: data
        }
      }));
      
      // Set reviews state
      setReviews(data || []);
      
      return data || [];
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setDebugInfo(prev => ({
        ...prev,
        reviewsError: err.message
      }));
      
      // Use mock data as fallback
      const mockReviews = [
        { 
          _id: '1', 
          user: { _id: '2', name: 'John Doe' },
          book: { _id: '1', title: 'The Mahabharata' },
          rating: 5, 
          comment: 'Amazing book!',
          createdAt: new Date().toISOString()
        },
        { 
          _id: '2', 
          user: { _id: '3', name: 'Jane Smith' },
          book: { _id: '2', title: 'The God of Small Things' },
          rating: 4,
          comment: 'Very well written.',
          createdAt: new Date().toISOString()
        }
      ];
      
      setReviews(mockReviews);
      return mockReviews;
    }
  };

  // Fetch all data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        if (userInfo && userInfo.isAdmin) {
          await Promise.all([fetchBooks(), fetchUsers(), fetchReviews()]);
        }
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userInfo]);

  // Function to handle book deletion
  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      if (!userInfo || !userInfo.token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(getApiUrl(`books/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete book: ${errorText}`);
      }
      
      // Update state to remove the deleted book
      setBooks(books.filter(book => book._id !== id));
      toast.success('Book deleted successfully');
    } catch (err) {
      console.error('Error deleting book:', err);
      toast.error(err.message || 'Error deleting book');
    }
  };

  // Refresh data function
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([fetchBooks(), fetchUsers(), fetchReviews()]);
      toast.success('Dashboard data refreshed');
    } catch (err) {
      setError('Failed to refresh data');
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  // loading state
  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }
  
  // error state
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      
      {/* Debug button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setShowDebug(!showDebug)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-700"
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </button>
      </div>
      
      {/* Debug panel */}
      <DebugPanel 
        isOpen={showDebug}
        data={{
          userInfo: {
            id: userInfo._id,
            name: userInfo.name,
            isAdmin: userInfo.isAdmin,
            tokenPresent: Boolean(userInfo.token)
          },
          ...debugInfo
        }}
        onClose={() => setShowDebug(false)}
      />
      
      {/* Refresh button */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={refreshData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading...</span>
            </>
          ) : (
            <>
              <i className="fas fa-sync-alt"></i>
              <span>Refresh Data</span>
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6 text-red-600">
          <i className="fas fa-exclamation-circle mr-2"></i> {error}
          <p className="mt-2 text-sm">
            Please check your internet connection and try again.
            <br />
            Note: The dashboard will show mock data if the API connection fails.
          </p>
        </div>
      )}
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'books' ? 'active' : ''} 
          onClick={() => setActiveTab('books')}
        >
          <i className="fas fa-book mr-2"></i>
          Books ({books.length})
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          <i className="fas fa-users mr-2"></i>
          Users ({users.length})
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''} 
          onClick={() => setActiveTab('reviews')}
        >
          <i className="fas fa-star mr-2"></i>
          Reviews ({reviews.length})
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'books' && (
          <div className="books-section">
            <div className="admin-header">
              <h2><i className="fas fa-book mr-2 text-primary-600"></i> Books Management</h2>
              <Link to="/admin/addbook" className="add-btn">
                <i className="fas fa-plus mr-2"></i> Add New Book
              </Link>
            </div>
            
            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading books...</p>
              </div>
            ) : books.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-books"></i>
                <p>No books found. Add your first book!</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>TITLE</th>
                      <th>AUTHOR</th>
                      <th>GENRE</th>
                      <th>RATING</th>
                      <th>FEATURED</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {books.map(book => (
                      <tr key={book._id}>
                        <td>{book._id.substring(0, 8)}...</td>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>{book.genre || 'N/A'}</td>
                        <td>{book.rating?.toFixed(1) || 'N/A'}</td>
                        <td>{book.featured ? 'Yes' : 'No'}</td>
                        <td className="action-buttons">
                          <Link to={`/books/${book._id}`} className="view-btn">View</Link>
                          <Link to={`/admin/books/${book._id}/edit`} className="edit-btn">Edit</Link>
                          <button 
                            className="delete-btn" 
                            onClick={() => handleDeleteBook(book._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-section">
            <div className="admin-header">
              <h2><i className="fas fa-users mr-2 text-primary-600"></i> Users Management</h2>
            </div>
            
            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-user-slash"></i>
                <p>No users found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>EMAIL</th>
                      <th>ADMIN STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user._id.substring(0, 8)}...</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                        <td className="action-buttons">
                          <Link to={`/profile/${user._id}`} className="view-btn">View Profile</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <div className="admin-header">
              <h2><i className="fas fa-star mr-2 text-primary-600"></i> Reviews Management</h2>
            </div>
            
            {loading ? (
              <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-comment-slash"></i>
                <p>No reviews found.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>USER</th>
                      <th>BOOK</th>
                      <th>RATING</th>
                      <th>COMMENT</th>
                      <th>DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(review => (
                      <tr key={review._id}>
                        <td>{review._id.substring(0, 8)}...</td>
                        <td>{review.user?.name || 'Unknown'}</td>
                        <td>{review.book?.title || 'Unknown'}</td>
                        <td>{review.rating}</td>
                        <td className="comment-cell">{review.comment}</td>
                        <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                        <td className="action-buttons">
                          <Link to={`/books/${review.book?._id}`} className="view-btn">View Book</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
