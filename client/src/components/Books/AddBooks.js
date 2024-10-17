import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const AddBooks = () => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    author: '',
    isbn: '',
    published_date: ''
  });

  const [message, setMessage] = useState(''); // State to store the success message

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    try {
      const response = await fetch('http://localhost:5000/library/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      if (response.ok) {
        // If the response is successful
        setMessage('Book added successfully!');
        navigate('/dashboard/bookdetails')
        setFormData({ title: '', genre: '', author: '', isbn: '', published_date: '' }); // Clear the form
      } else {
        setMessage('Failed to add book. Please try again.');
      }
    } catch (error) {
      setMessage('Error occurred while adding book.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-50 to-blue-100'>
    <div className="p-6 max-w-lg mx-auto rounded shadow-md  bg-white">
      <h1 className="text-2xl font-bold mb-6 text-center">Add New Book</h1>

      {message && (
        <div className={`mb-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Book Title */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Book Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter book title"
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        {/* Genre */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="genre">
            Genre
          </label>
          <input
            id="genre"
            name="genre"
            type="text"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Enter book genre"
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="author">
            Author
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Enter author name"
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        {/* ISBN */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="isbn">
            ISBN
          </label>
          <input
            id="isbn"
            name="isbn"
            type="text"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="Enter libraryid then Write 'B' then give the number"
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        {/* Published Date */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="published_date">
            Published Date
          </label>
          <input
            id="published_date"
            name="published_date"
            type="text"
            value={formData.published_date}
            onChange={handleChange}
            placeholder="Enter published date"
            className="border border-gray-300 p-2 w-full rounded"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Add Book
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddBooks;
