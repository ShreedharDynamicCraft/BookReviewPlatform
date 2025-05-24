import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <Link to={`/books/${book._id}`}>
        <img src={book.coverImage} alt={book.title} className="book-cover" />
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-rating">
            <span className="stars">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={i < Math.round(book.rating) ? 'star-filled' : 'star-empty'}
                >
                  ★
                </span>
              ))}
            </span>
            <span className="rating-count">({book.numReviews} reviews)</span>
          </div>
          <p className="book-genre">{book.genre}</p>
        </div>
      </Link>
    </div>
  );
};

export default BookCard;
