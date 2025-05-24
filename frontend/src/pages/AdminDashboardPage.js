import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { apiRequest } from '../services/apiConfig';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  // state for storing data
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('books');
  
  // get user info for auth check
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // redirect if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      toast.error('You are not authorized to view this page');
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  // fetch all the data when component loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // fetch books data using apiRequest utility
        const booksData = await apiRequest('books');
        
        // fetch users data (admin only) using apiRequest utility
        const usersData = await apiRequest('users', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        // fetch all reviews (admin only) using apiRequest utility
        const reviewsData = await apiRequest('reviews/all', {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        setBooks(booksData.books || []);
        setUsers(usersData || []);
        setReviews(reviewsData || []);
        
      } catch (err) {
        console.error('Error fetching admin data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (userInfo && userInfo.isAdmin) {
      fetchData();
    }
  }, [userInfo]);
  
  // delete book handler
  const handleDeleteBook = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await apiRequest(`books/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        
        setBooks(books.filter(book => book._id !== id));
        toast.success('Book deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Error deleting book');
      }
    }
  };
  
  if (loading) return <div className="loading">Loading admin dashboard...</div>;
  if (error) return <div className="error">{error}</div>;
  
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
                      <td>{book._id.substring(0, 8)}...</td>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.rating.toFixed(1)}</td>
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
                    <th>JOINED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user._id.substring(0, 8)}...</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Yes' : 'No'}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
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
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review._id}>
                      <td>{review._id.substring(0, 8)}...</td>
                      <td>{review.user?.name || 'Unknown'}</td>
                      <td>{review.book?.title || 'Unknown'}</td>
                      <td>{review.rating}</td>
                      <td className="comment-cell">{review.comment.substring(0, 50)}...</td>
                      <td>{new Date(review.createdAt).toLocaleDateString()}</td>
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

export default AdminDashboardPage;
