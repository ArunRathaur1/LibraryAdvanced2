import React, { useState } from 'react';
import Cookies from 'js-cookie'; // Ensure you have the js-cookie library installed

const AddHead = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    libraryId: '', // New field for Library ID
  });

  const [message, setMessage] = useState(''); // State to store success or error message

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for adding an admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = Cookies.get('authToken'); // Extract token from cookie
    console.log(token);
    try {
      const response = await fetch('http://localhost:5000/library/addhead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Send token in Authorization header
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Admin added successfully!');
        setFormData({ username: '', password: '', libraryId: '' }); // Reset fields
      } else {
        setMessage(data.message || 'Failed to add admin. Please try again.');
      }
    } catch (error) {
      setMessage('Error occurred while adding admin.');
      console.error('Error:', error);
    }
  };

  // Handle admin deletion
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this admin?');
    if (confirmDelete) {
      const token = Cookies.get('authToken'); // Extract token from cookie
      console.log(token);
      try {
        const response = await fetch(`http://localhost:5000/library/deletehead`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // Send token in Authorization header
          },
          body: JSON.stringify(formData), // Send formData as JSON for deletion
        });

        const data = await response.json();

        if (response.ok) {
          setMessage('Admin deleted successfully!');
          setFormData({ username: '', password: '', libraryId: '' }); // Reset fields after deletion
        } else {
          setMessage(data.message || 'Failed to delete admin. Please try again.');
        }
      } catch (error) {
        setMessage('Error occurred while deleting admin.');
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100"style={{paddingTop:'100px',paddingBottom:'200px'}}>
      <div className="p-6 max-w-lg mx-auto rounded shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Add/Delete Head Librarian</h1>

        {message && (
          <div className={`mb-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter admin username"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter admin password"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Library ID */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="libraryId">
              Library ID
            </label>
            <input
              id="libraryId"
              name="libraryId"
              type="text"
              value={formData.libraryId}
              onChange={handleChange}
              placeholder="Enter library ID"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Submit Button to Add Admin */}
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2">
              Add Admin
            </button>
            <button type="button" onClick={handleDelete} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">
              Delete Admin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHead;
