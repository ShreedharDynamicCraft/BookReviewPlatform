const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    publishedYear: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual method to calculate the real average rating
bookSchema.methods.calculateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ book: this._id });
  
  if (reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / reviews.length;
    this.numReviews = reviews.length;
  }
  
  await this.save();
  return this;
};

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
