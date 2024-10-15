import React, { useState } from 'react';

export default function FeePayment() {
  const [studentId, setStudentId] = useState('');
  const [paymentDuration, setPaymentDuration] = useState('');
  const [message, setMessage] = useState(''); // To display success or error messages
  const [isSuccess, setIsSuccess] = useState(false); // To track if the message is success or error

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/library/students/feepayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, paymentDuration }),
      });

      const data = await response.json();
      setMessage(data.message);

      // Check if the response is successful
      if (response.ok) {
        setIsSuccess(true); // Display message in green if the response is successful
      } else {
        setIsSuccess(false); // Display message in red if there's an error
      }
    } catch (error) {
      setMessage('Error: Unable to process payment.');
      setIsSuccess(false); // Display message in red for any other error
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Fee Payment</h2>

        {/* Success/Error message display */}
        {message && (
          <div className={`mb-4 text-center ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student ID Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Student ID:</label>
            <input
              type="text"
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>

          {/* Payment Duration Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Fee Payment Duration:</label>
            <select
              className="mt-1 p-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
              value={paymentDuration}
              onChange={(e) => setPaymentDuration(e.target.value)}
              required
            >
              <option value="" disabled>Select duration</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
              <option value="6 months">6 months</option>
              <option value="1 year">1 year</option>
              <option value="lifetime">Lifetime</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition duration-300"
          >
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
}
