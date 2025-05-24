import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';
import AdminBookForm from '../components/AdminBookForm';
import * as bookService from '../services/bookService';
import './AddBookPage.css';

const AddBookPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redirect if not admin
  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      toast.error('Not authorized as admin');
      navigate('/login');
    }
  }, [userInfo, navigate]);
  
  const handleSubmit = async (bookData) => {
    try {
      const result = await bookService.createBook(bookData, userInfo.token);
      toast.success('Book added successfully!');
      
      // Navigate to the book list page to see the newly added book
      navigate('/books');
      return result;
    } catch (error) {
      toast.error(error.message || 'Failed to add book');
      throw error;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Add New Book</h1>
        <AdminBookForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default AddBookPage;
