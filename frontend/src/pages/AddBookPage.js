import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import { apiRequest } from '../services/apiConfig';
import './AddBookPage.css';

const AddBookPage = () => {
  // state for book details
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [featured, setFeatured] = useState(false);
  
  // UI states
  const [previewError, setPreviewError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Check for admin status
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      toast.error('You are not authorized to access this page');
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!title || !author || !genre || !description || !publishedYear) {
      toast.error('Please fill in all the required fields');
      return;
    }
    
    // Validate published year
    const year = parseInt(publishedYear, 10);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
      toast.error('Please enter a valid published year');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create new book using apiRequest
      await apiRequest('books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          title,
          author,
          genre,
          description,
          publishedYear,
          coverImage,
          featured,
        }),
      });
      
      toast.success('Book added successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="add-book-page">
      <div className="add-book-container">
        <h1>Add New Book</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="author"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="genre"
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <div className="mt-1">
              <textarea
                name="description"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div>
            <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700">
              Published Year
            </label>
            <div className="mt-1">
              <input
                type="number"
                name="publishedYear"
                id="publishedYear"
                value={publishedYear}
                onChange={(e) => setPublishedYear(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
              Cover Image URL
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="coverImage"
                id="coverImage"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="featured" className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 block text-sm text-gray-900">
                Mark as featured
              </span>
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? 'Adding Book...' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPage;
