import React, { useState } from 'react';
import axios from 'axios';
// import './OrderBook.css'; // Importing CSS file

const OrderBook = () => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [qty, setQty] = useState(1);
//   const [libraryId, setLibraryId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/library/order-book', {
        bookName,
        author,
        qty,
        // libraryId,
      });
      setMessage('Book ordered successfully');
    } catch (error) {
      setMessage('Error ordering book');
    }
  };

  return (
    <div className="order-book-container">
      <h2>Order a Book</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <div className="form-group">
          <label>Book Name:</label>
          <input 
            type="text" 
            value={bookName} 
            onChange={(e) => setBookName(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Author:</label>
          <input 
            type="text" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input 
            type="number" 
            value={qty} 
            onChange={(e) => setQty(e.target.value)} 
            required
          />
        </div>
        <button type="submit" className="order-button">Order Book</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default OrderBook;
