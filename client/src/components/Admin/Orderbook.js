import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';


const OrderBook = () => {
  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    try {
      await axios.post(
        'http://localhost:5000/library/order-book', // Ensure this endpoint matches backend
        { bookName, author, qty },
        {
          headers: {
            'Content-Type': 'application/json',
          'Authorization': `${token}`
          },
        }
      );

      setMessage('Book ordered successfully');
      setBookName('');
      setAuthor('');
      setQty(1);
    } catch (error) {
      setMessage('Error ordering book');
      console.error('Order error:', error);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-r from-green-50 to-green-100">
      {message && (
        <p
          className={`mt-4 text-center font-semibold ${
            message.includes('successfully') ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {message}
        </p>
      )}
      <h2 className="text-xl md:text-2xl font-bold mb-4">Order a Book</h2>
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Book Name:</label>
          <input
            type="text"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Author:</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Quantity:</label>
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
            className="border border-gray-300 p-2 rounded w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
          Order Book
        </button>
      </form>
    </div>
  );
};

export default OrderBook;
