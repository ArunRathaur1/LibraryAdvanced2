import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentLogin(props) {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestBody = {
      student_id: studentId,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:5000/library/students/history1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Success: Reset error message, set login details, and navigate to the dashboard
        setErrorMessage('');
        props.setdetails(data.student);
        props.setstudentlogin(true);
        navigate('/studentDashboard');
      } else {
        // Error: Show the error message from the server
        setErrorMessage(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred while trying to log in. Please try again later.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Student Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="student_id" className="block text-sm font-medium text-gray-700">
              Student ID
            </label>
            <input
              type="text"
              id="student_id"
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Display error message if present */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
