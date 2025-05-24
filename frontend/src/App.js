import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import components
import Header from './components/Header';
import Footer from './components/Footer';

// Import pages
import HomePage from './pages/HomePage';
import BookListPage from './pages/BookListPage';
import BookPage from './pages/BookPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import BookshelfPage from './pages/BookshelfPage';

// Import context for state management
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/books" element={<BookListPage />} />
              <Route path="/books/:id" element={<BookPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/addbook" element={<AddBookPage />} />
              <Route path="/admin/books/:id/edit" element={<EditBookPage />} />
              <Route path="/bookshelf" element={<BookshelfPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}

export default App;
