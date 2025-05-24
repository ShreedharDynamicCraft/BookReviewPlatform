import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-md py-2' 
        : 'bg-white py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white font-bold animate-float shadow-lg">
                <i className="fas fa-book-open"></i>
              </div>
              <span className="text-xl font-serif font-bold bg-gradient-to-r from-primary-700 to-secondary-700 text-transparent bg-clip-text group-hover:from-primary-600 group-hover:to-secondary-500 transition-all">BookReview</span>
            </Link>
          </div>
          
          <button 
            className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/' 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-home mr-2"></i>Home
            </Link>
            <Link 
              to="/books" 
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === '/books' 
                  ? 'text-primary-700 bg-primary-50' 
                  : 'text-gray-700 hover:text-primary-700 hover:bg-gray-50'
              }`}
            >
              <i className="fas fa-book mr-2"></i>Browse Books
            </Link>
            
            {userInfo && (
              <Link 
                to="/bookshelf" 
                className="px-3 py-2 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <i className="far fa-heart mr-1"></i> My Bookshelf
              </Link>
            )}
            
            {userInfo ? (
              <div className="relative ml-4">
                <button 
                  className="flex items-center space-x-1 px-3 py-2 rounded-full bg-primary-50 hover:bg-primary-100 transition-colors"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{userInfo.name.split(' ')[0]}</span>
                  <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} text-xs text-gray-500`}></i>
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-gray-100 animate-slide-up origin-top-right z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{userInfo.name}</p>
                      <p className="text-xs text-gray-500">{userInfo.email}</p>
                    </div>
                    <Link 
                      to={`/profile/${userInfo._id}`} 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <i className="fas fa-user-circle mr-2"></i> My Profile
                    </Link>
                    <Link 
                      to="/bookshelf" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                    >
                      <i className="fas fa-bookmark mr-2"></i> My Bookshelf
                    </Link>
                    {userInfo.isAdmin && (
                      <>
                        <div className="border-t border-gray-100 my-1"></div>
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <i className="fas fa-tachometer-alt mr-2"></i> Admin Dashboard
                        </Link>
                        <Link 
                          to="/admin/addbook" 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700"
                        >
                          <i className="fas fa-plus-circle mr-2"></i> Add New Book
                        </Link>
                      </>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 border border-primary-600 text-primary-700 rounded-full text-sm font-medium hover:bg-primary-50 transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-primary-600 text-white rounded-full text-sm font-medium hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Get started
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${
        mobileMenuOpen ? 'max-h-96' : 'max-h-0'
      }`}>
        <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200 bg-white shadow-lg">
          <Link 
            to="/" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/' 
                ? 'text-primary-700 bg-primary-50' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-home mr-2"></i>Home
          </Link>
          <Link 
            to="/books" 
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === '/books' 
                ? 'text-primary-700 bg-primary-50' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <i className="fas fa-book mr-2"></i>Browse Books
          </Link>
          
          {userInfo ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-medium">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{userInfo.name}</div>
                  <div className="text-sm font-medium text-gray-500">{userInfo.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to={`/profile/${userInfo._id}`}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-user-circle mr-2"></i> My Profile
                </Link>
                <Link
                  to="/bookshelf"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <i className="fas fa-bookmark mr-2"></i> My Bookshelf
                </Link>
                {userInfo.isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-tachometer-alt mr-2"></i> Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/addbook"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                    >
                      <i className="fas fa-plus-circle mr-2"></i> Add New Book
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="px-4 py-2 border border-primary-600 text-primary-700 rounded-md text-base font-medium hover:bg-primary-50 transition-colors text-center"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-primary-600 text-white rounded-md text-base font-medium hover:bg-primary-700 transition-colors text-center shadow-md"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
