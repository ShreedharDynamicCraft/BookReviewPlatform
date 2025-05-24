// basic imports
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const books = require('./data/books');
const Book = require('./models/bookModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');
const connectDB = require('./config/db');

// load environment vars
dotenv.config();

// connect to mongodb
connectDB();

// import data function - adds sample books
const importData = async () => {
  try {
    // clear existing data (optional)
    await Book.deleteMany();
    
    // Don't delete existing users and reviews
    console.log('Deleted existing books while preserving reviews');
    
    // create admin user if not exists
    let adminExists = await User.findOne({ email: 'admin@example.com' });
    let adminId;
    
    if (!adminExists) {
      // Force create the admin user even if it exists
      try {
        await User.deleteOne({ email: 'admin@example.com' });
      } catch (err) {
        console.log('No existing admin to remove');
      }
      
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true
      });
      adminId = adminUser._id;
      console.log('Created admin user - Email: admin@example.com, Password: password123');
    } else {
      adminId = adminExists._id;
      console.log('Admin user already exists');
    }
    
    // Insert sample books but ensure they have initial zero ratings
    const booksWithZeroRatings = books.map(book => ({
      ...book,
      rating: 0,
      numReviews: 0
    }));
    
    const createdBooks = await Book.insertMany(booksWithZeroRatings);
    console.log(`${createdBooks.length} books added to database with zero initial ratings`);
    
    console.log('Data Import Complete! Real ratings will be calculated from user reviews.');
    process.exit();
  } catch (error) {
    console.error(`Error during import: ${error.message}`);
    process.exit(1);
  }
};

// destroy data function - removes all data
const destroyData = async () => {
  try {
    await Book.deleteMany();
    await Review.deleteMany();
    // don't delete users to keep accounts
    
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// check command line args for which function to run
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
