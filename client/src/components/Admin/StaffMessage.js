import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const StaffMessage = () => {
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    const token = Cookies.get('authToken');
    try {
      const response = await fetch('http://localhost:5000/library/staffmessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (response.ok) {
        setSuccessMessage('Message posted successfully!');
        setMessage('');
      } else {
        setErrorMessage('Failed to post the message.');
      }
    } catch (error) {
      setErrorMessage('An error occurred while posting the message.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden max-w-lg w-full">
        <div className="px-8 py-10">
          <h1 className="text-4xl font-semibold text-gray-900 mb-6 text-center">
            Post a Message
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Enter your message:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Type your message here..."
                required
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition-all duration-200 ease-in-out"
              >
                Post Message
              </button>
            </div>
          </form>

          {/* Success & Error messages */}
          {successMessage && (
            <p className="mt-4 text-center text-green-600 font-semibold">
              {successMessage}
            </p>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-red-600 font-semibold">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffMessage;
