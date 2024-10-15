import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function UpdateStudentDetails(props) {
  const { studentdata } = props;
  const navigate = useNavigate(); // To programmatically navigate

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    student_id: '',
    password: '', // New password field
  });

  // Redirect on page refresh if there's no `studentdata` provided
  useEffect(() => {
    if (!studentdata) {
      console.log('No student data found, redirecting...');
      navigate('/dashboard/studentdetails');
    }
  }, [studentdata, navigate]);

  // Set form data if studentdata is available
  useEffect(() => {
    console.log('Student data received:', studentdata);
    if (studentdata) {
      setFormData({
        name: studentdata.name,
        phone: studentdata.phone,
        address: studentdata.address,
        student_id: studentdata.student_id,
        password: '', // Leave password empty initially for security reasons
      });
    }
  }, [studentdata]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get('authToken');
    try {
      const response = await fetch(`http://localhost:5000/library/students/${studentdata._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedStudent = await response.json();
        navigate('/dashboard/studentdetails'); // Redirect to /studentdetails page
      } else {
        console.error('Error updating student:', response.statusText);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Student Details</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Student ID:</label>
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Leave blank to keep unchanged"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full">
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
}
