import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AdminBookForm = ({ book, onSubmit }) => {
  const [title, setTitle] = useState(book?.title || '');
  const [author, setAuthor] = useState(book?.author || '');
  const [genre, setGenre] = useState(book?.genre || '');
  const [description, setDescription] = useState(book?.description || '');
  const [publishedYear, setPublishedYear] = useState(book?.publishedYear?.toString() || '');
  const [coverImage, setCoverImage] = useState(book?.coverImage || '');
  const [featured, setFeatured] = useState(book?.featured || false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !author || !genre || !description || !publishedYear) {
      return alert('Please fill all required fields');
    }
    
    try {
      setIsSubmitting(true);
      const finalCoverImage = coverImage || 'https://via.placeholder.com/400x600?text=Book+Cover+Not+Available';
      
      await onSubmit({
        title,
        author,
        genre,
        description,
        publishedYear: Number(publishedYear),
        coverImage: finalCoverImage,
        featured
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Enter book title"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          placeholder="Enter author name"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
        <input
          type="text"
          id="genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          placeholder="Enter book genre"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="publishedYear" className="block text-sm font-medium text-gray-700 mb-1">Published Year *</label>
        <input
          type="number"
          id="publishedYear"
          value={publishedYear}
          onChange={(e) => setPublishedYear(e.target.value)}
          min="1000"
          max={new Date().getFullYear()}
          required
          placeholder="Enter published year"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          required
          placeholder="Enter book description"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        ></textarea>
      </div>
      
      <div className="form-group">
        <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
        <input
          type="text"
          id="coverImage"
          value={coverImage}
          onChange={(e) => {
            setCoverImage(e.target.value);
            setPreviewError(false);
          }}
          placeholder="Enter cover image URL (optional)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        {coverImage && (
          <div className="mt-2 p-2 border border-gray-200 rounded-lg overflow-hidden">
            <p className="text-sm text-gray-500 mb-2">Preview:</p>
            {previewError ? (
              <div className="flex items-center justify-center h-40 bg-gray-100 text-gray-500">
                <div className="text-center">
                  <i className="fas fa-image text-3xl mb-2"></i>
                  <p>Invalid image URL</p>
                </div>
              </div>
            ) : (
              <img 
                src={coverImage}
                alt="Cover preview" 
                className="h-40 object-contain mx-auto"
                onError={() => setPreviewError(true)}
              />
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
          Featured Book
        </label>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.history.back()}
          disabled={isSubmitting}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isSubmitting}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Adding...
            </>
          ) : (
            <>
              <i className="fas fa-plus mr-2"></i>
              Add Book
            </>
          )}
        </motion.button>
      </div>
    </form>
  );
};

export default AdminBookForm;
