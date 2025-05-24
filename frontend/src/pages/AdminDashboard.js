// importing stuff i need
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import './AdminDashboard.css';

// admin dashboard component
const AdminDashboard = () => {
  // states for storing data
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  
  // get auth context and navigation
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Verify admin status and redirect if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      toast.error('Not authorized as admin');
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  // fetch data with proper authorization header
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Make sure we have auth token before proceeding
        if (!userInfo || !userInfo.token) {
          throw new Error('Authentication required');
        }

        const headers = {
          Authorization: `Bearer ${userInfo.token}`
        };
        
        // Get books data
        const booksResponse = await fetch('/api/books', {
          headers
        });
        
        if (!booksResponse.ok) {
          throw new Error('Failed to fetch books');
        }
        
        const booksData = await booksResponse.json();
        setBooks(booksData.books || []);
        
        // Get users data (admin only)
        const usersResponse = await fetch('/api/users', {
          headers
        });
        
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const usersData = await usersResponse.json();
        setUsers(usersData || []);
        
        // Get all reviews (admin only)
        const reviewsResponse = await fetch('/api/reviews/all', {
          headers
        });
        
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData || []);
        
      } catch (err) {
        console.error('Dashboard Error:', err);
        setError(err.message || 'Failed to load dashboard data');
        toast.error(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    if (userInfo && userInfo.isAdmin && userInfo.token) {
      fetchData();
    }
  }, [userInfo]);
  
  // handle book deletion with proper auth
  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        if (!userInfo || !userInfo.token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch(`/api/books/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete book');
        }
        
        setBooks(books.filter(book => book._id !== id));
        toast.success('Book deleted successfully');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error(error.message);
      }
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
      
      <div className="admin-tabs">
        <button 
          className={activeTab === 'books' ? 'active' : ''} 
          onClick={() => setActiveTab('books')}
        >
          Books ({books.length})
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button 
          className={activeTab === 'reviews' ? 'active' : ''} 
          onClick={() => setActiveTab('reviews')}
        >
          Reviews ({reviews.length})
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'books' && (
          <div className="books-section">
            <div className="admin-header">
              <h2>Books Management</h2>
              <Link to="/admin/addbook" className="add-btn">Add New Book</Link>
            </div>
            
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
                      <td>{book._id.substring(0, 6)}...</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.rating ? book.rating.toFixed(1) : '0.0'}</td>
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
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>Users Management</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>EMAIL</th>
                    <th>ADMIN</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id.substring(0, 6)}...</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                      <td className="action-buttons">
                        <Link to={`/profile/${user._id}`} className="view-btn">View Profile</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="reviews-section">
            <h2>Reviews Management</h2>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>USER</th>
                    <th>BOOK</th>
                    <th>RATING</th>
                    <th>COMMENT</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review._id}>
                      <td>{review._id.substring(0, 6)}...</td>
                      <td>{review.user?.name || 'Unknown'}</td>
                      <td>{review.book?.title || 'Unknown'}</td>
                      <td>{review.rating}</td>
                      <td className="comment-cell">{review.comment?.substring(0, 50)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
