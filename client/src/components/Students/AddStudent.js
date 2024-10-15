import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    student_id: '',
    email: '',     // Added email field
    password: ''   // Added password field
  });
  
  const navigate = useNavigate();
  const [message, setMessage] = useState(''); // State to store the success or error message

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
      const response = await fetch('http://localhost:5000/library/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify(formData), // Send form data as JSON
      });

      const data = await response.json();

      if (response.ok) {
        // If the response is successful
        setMessage('Student added successfully!');
        navigate('/dashboard/studentdetails');
        setFormData({ name: '', phone: '', address: '', student_id: '', email: '', password: '' });
      } else {
        // If the response is not successful, display the error message from the response
        setMessage(data.message || 'Failed to add student. Please try again.');
      }
    } catch (error) {
      setMessage('Error occurred while adding student.');
      console.error('Error:', error);
    }
  };

  return (
    <div className='bg-gradient-to-r from-blue-50 to-blue-100'>
      <div className="p-6 max-w-lg mx-auto rounded shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Student</h1>

        {message && (
          <div className={`mb-4 text-center ${message.includes('success') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Student Name */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter student name"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Student ID */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="student_id">
              Student ID
            </label>
            <input
              id="student_id"
              name="student_id"
              type="text"
              value={formData.student_id}
              onChange={handleChange}
              placeholder="Enter student ID"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
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
              placeholder="Enter password"
              className="border border-gray-300 p-2 w-full rounded"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Add Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
