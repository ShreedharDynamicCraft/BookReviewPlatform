import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import './AddBookPage.css'; // Reuse the same CSS

const EditBookPage = () => {
  // state for book details
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [featured, setFeatured] = useState(false);
  
  // loading and submission states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  // get book id from url
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  // Check for admin status
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      toast.error('Not authorized as admin');
      navigate('/login');
    }
  }, [userInfo, navigate]);

  // Fetch book details with better error handling
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/books/${id}`);
        
        if (!response.ok) {
          throw new Error('Book not found');
        }
        
        const data = await response.json();
        setTitle(data.title);
        setAuthor(data.author);
        setGenre(data.genre || '');
        setDescription(data.description);
        setPublishedYear(data.publishedYear?.toString() || '');
        setCoverImage(data.coverImage || '');
        setFeatured(!!data.featured);
        
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBook();
  }, [id]);

  // Submit with proper authentication
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!title || !author || !genre || !description || !publishedYear) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Ensure we have authentication
    if (!userInfo || !userInfo.token) {
      toast.error('Authentication required');
      navigate('/login');
      return;
    }
    
    try {
      setSubmitting(true);
      
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          description,
          publishedYear: Number(publishedYear),
          coverImage,
          featured
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update book');
      }
      
      toast.success('Book updated successfully');
      navigate(`/books/${id}`);
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="loading">Loading book details...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div className="add-book-page">
      <div className="add-book-container">
        <h1>Edit Book</h1>
        
        <form onSubmit={handleSubmit} className="add-book-form">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author *</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="genre">Genre *</label>
            <input
              type="text"
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publishedYear">Published Year *</label>
            <input
              type="number"
              id="publishedYear"
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
              min="1000"
              max={new Date().getFullYear()}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>
          
          <div className="form-group">
            <label htmlFor="coverImage">Cover Image URL *</label>
            <input
              type="text"
              id="coverImage"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              required
            />
            {coverImage && (
              <div className="cover-preview">
                <img src={coverImage} alt="Book cover preview" />
              </div>
            )}
          </div>
          
          <div className="form-check">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <label htmlFor="featured">Featured Book</label>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={submitting}
            >
              {submitting ? 'Updating...' : 'Update Book'}
            </button>
            
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPage;
