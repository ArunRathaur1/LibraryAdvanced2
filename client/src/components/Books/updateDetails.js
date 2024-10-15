import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
export default function UpdateDetails({ data, onUpdate }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    genre: '',
    author: '',
    isbn: '',
    published_date: ''
  });

  // Redirect on page refresh if there's no `data` provided
  useEffect(() => {
    if (!data) {
      navigate('/dashboard/bookdetails');
    }
  }, [data, navigate]);

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title,
        genre: data.genre,
        author: data.author,
        isbn: data.isbn,
        published_date: data.published_date,
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    const token = Cookies.get('authToken');
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/library/books/${data._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedBook = await response.json();
        console.log('Updated Book:', updatedBook);
        navigate('/dashboard/bookdetails');  // Redirect to /bookdetails page
      } else {
        console.error('Error updating book:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Book Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Book Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Genre:</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Author:</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">ISBN:</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Published Date:</label>
            <input
              type="date"
              name="published_date"
              value={formData.published_date}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
            Update Book
          </button>
        </form>
      </div>
    </div>
  );
}
