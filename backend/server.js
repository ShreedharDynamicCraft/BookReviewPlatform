const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable logging only in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Connect to database (conditionally based on deployment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Routes
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/bookshelf', require('./routes/bookshelfRoutes'));

// API health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Handle production setup
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // Any route that's not api will be redirected to index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    }
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Set up port and start server
const PORT = process.env.PORT || 5000;

// Vercel serverless deployment requires us to export the app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  // For traditional hosting
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
