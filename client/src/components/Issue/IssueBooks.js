import React, { useState } from 'react';
import Cookies from 'js-cookie';

const IssueBooks = () => {
  const [studentId, setStudentId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [fine, setFine] = useState(null); // New state to store the fine amount

  // Function to handle book issuing
  const handleIssueBook = async () => {
    const token = Cookies.get('authToken');
    if (!studentId || !isbn) {
      setMessage('Please provide both Student ID and ISBN.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/library/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ student_id: studentId, isbn }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Book issued successfully.');
        setIsSuccess(true);
        setFine(null); // Reset fine on successful book issue
      } else {
        const errorMessage = getErrorMessage(data.message);
        setMessage(errorMessage);
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error issuing book:', error);
      setMessage('Error issuing book. Please try again.');
      setIsSuccess(false);
    }
  };

  // Function to handle book returning
  const handleReturnBook = async () => {
    const token = Cookies.get('authToken');
    if (!studentId || !isbn) {
      setMessage('Please provide both Student ID and ISBN.');
      setIsSuccess(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/library/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
        body: JSON.stringify({ student_id: studentId, isbn }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Book returned successfully.');
        setIsSuccess(true);
        setFine(data.fine); // Set the fine amount from the response
      } else {
        setMessage(data.message || 'Failed to return the book.');
        setIsSuccess(false);
        setFine(null); // Reset fine on error
      }
    } catch (error) {
      console.error('Error returning book:', error);
      setMessage('Error returning book. Please try again.');
      setIsSuccess(false);
      setFine(null); // Reset fine on error
    }
  };

  // Function to map error codes to user-friendly messages
  const getErrorMessage = (code) => {
    switch (code) {
      case '-1':
        return 'No book or student found.';
      case '-2':
        return 'Book is already issued.';
      case '-3':
        return 'Maximum limit of issued books reached (2 books).';
      default:
        return 'Failed to issue the book.';
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="container bg-white rounded shadow-md p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Manage Book</h2>

        {/* Input for Student ID */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Student ID:</label>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter Student ID"
          />
        </div>

        {/* Input for Book ISBN */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">ISBN:</label>
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            placeholder="Enter Book ISBN"
          />
        </div>

        {/* Buttons to issue and return books */}
        <div className="flex justify-between">
          <button
            onClick={handleIssueBook}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Issue Book
          </button>
          <button
            onClick={handleReturnBook}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            Return Book
          </button>
        </div>

        {/* Message display area */}
        {message && (
          <div className={`mt-4 font-medium text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        {/* Display fine if applicable */}
        {fine !== null && (
          <div className="mt-2 text-center text-gray-700">
            Total fine: Rs. {fine}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueBooks;
