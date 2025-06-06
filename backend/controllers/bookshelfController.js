const Book = require('../models/bookModel');

// Controller to fetch books by their IDs (for the bookshelf feature)
const getBooksByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({ message: 'No book IDs provided' });
    }
    
    const bookIds = ids.split(',').filter(id => id.trim());
    
    if (bookIds.length === 0) {
      return res.json([]);
    }
    
    const books = await Book.find({ _id: { $in: bookIds } });
    
    res.json(books);
  } catch (error) {
    console.error('Error fetching bookshelf books:', error);
    res.status(500).json({ message: 'Failed to fetch bookshelf', error: error.message });
  }
};

module.exports = {
  getBooksByIds
};
