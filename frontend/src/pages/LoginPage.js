import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [adminSecretCode, setAdminSecretCode] = useState('');
  const [showSecretInput, setShowSecretInput] = useState(false);
  
  const { login, userInfo, error, loading, loginAsAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if already logged in
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };
  
  // Direct admin login handler with better feedback
  const handleAdminLogin = () => {
    try {
      if (loginAsAdmin(adminSecretCode)) {
        toast.success('Logged in as Admin! Redirecting to dashboard...');
        setTimeout(() => navigate('/admin/dashboard'), 1000);
      } else {
        toast.error('Admin login failed. Incorrect secret code.');
      }
    } catch (err) {
      console.error('Admin login error:', err);
      toast.error('Something went wrong with admin login');
    }
  };
  
  // Auto-fill admin credentials handler
  const fillAdminCredentials = () => {
    setEmail('admin@example.com');
    setPassword('password123');
    setShowSecretInput(true);
    toast.info('Admin credentials filled. Enter secret code and click Login.');
  };
  
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="max-w-md w-full backdrop-blur-md bg-white/80 shadow-xl rounded-2xl p-8 border border-white/20 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-500">Sign in to continue your reading journey</p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]">
            <i className="fas fa-exclamation-circle mr-2"></i> 
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-envelope text-primary mr-2"></i> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="flex items-center text-sm font-medium text-gray-700 mb-1">
              <i className="fas fa-lock text-primary mr-2"></i> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <button 
                type="button" 
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary to-secondary hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i> Logging in...
              </span>
            ) : (
              <span className="flex items-center">
                <i className="fas fa-sign-in-alt mr-2"></i> Login
              </span>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account? <Link to="/register" className="text-primary font-medium hover:underline">Register</Link>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-center text-sm mb-4">Admin access options:</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button 
              onClick={fillAdminCredentials} 
              className="flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <i className="fas fa-user-shield mr-2 text-gray-500"></i> Fill Admin Credentials
            </button>
            <button 
              onClick={handleAdminLogin} 
              className="flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <i className="fas fa-bolt mr-2"></i> Quick Admin Login
            </button>
          </div>
          
          {showSecretInput && (
            <div className="mt-4 animate-fade-in">
              <label htmlFor="adminSecretCode" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <i className="fas fa-key text-primary mr-2"></i> Admin Secret Code
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="adminSecretCode"
                  value={adminSecretCode}
                  onChange={(e) => setAdminSecretCode(e.target.value)}
                  placeholder="Enter admin secret code"
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Only authorized administrators know the secret code</p>
            </div>
          )}
          
          <div className="mt-3">
            <div className="text-xs text-center text-gray-500">
              <p>Admin email: <span className="font-mono">admin@example.com</span></p>
              <p>Admin password: <span className="font-mono">password123</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
