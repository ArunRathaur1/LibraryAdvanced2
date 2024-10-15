import React, { useState } from 'react';

function StudentBookHistory() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [history, setHistory] = useState(null);
  const [error, setError] = useState('');

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://localhost:5000/library/students/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ student_id: studentId, password }), // Send both student ID and password
      });

      if (!response.ok) {
        throw new Error('Invalid student ID or password');
      }

      const data = await response.json();

      // Sort the history to prioritize books that haven't been returned yet
      data.history.sort((a, b) => {
        if (a.returnDate === 'Not returned yet' && b.returnDate !== 'Not returned yet') {
          return -1; // a goes before b
        } else if (a.returnDate !== 'Not returned yet' && b.returnDate === 'Not returned yet') {
          return 1; // b goes before a
        } else {
          const issueDateA = new Date(a.issueDate);
          const issueDateB = new Date(b.issueDate);
          return issueDateB - issueDateA; // Sort by issue date in descending order
        }
      });

      setHistory(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setHistory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Student Book History</h1>

        <input
          type="text"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          placeholder="Enter Student ID"
          className="border-2 border-gray-300 p-3 w-full rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          className="border-2 border-gray-300 p-3 w-full rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={fetchHistory}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-500 transition-all duration-300 ease-in-out"
        >
          Fetch History
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}

        {history && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-700">
              {history.name} (ID: {history.student_id})
            </h2>

            {/* Currently Issued Books */}
            <h3 className="text-lg font-semibold mb-4 text-blue-600">Currently Issued Books</h3>
            {history.currently_issued_books.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-blue-100 text-left">
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">ISBN</th>
                    <th className="px-4 py-2 border">Issue Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.currently_issued_books.map((book, index) => (
                    <tr key={index} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 border">{book.title}</td>
                      <td className="px-4 py-2 border">{book.isbn}</td>
                      <td className="px-4 py-2 border">{new Date(book.issueDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No books currently issued.</p>
            )}

            {/* Book Issue/Return History */}
            <h3 className="text-lg font-semibold mt-8 mb-4 text-blue-600">Book Issue/Return History</h3>
            {history.history.length > 0 ? (
              <table className="min-w-full bg-white border border-gray-300">
                <thead>
                  <tr className="bg-blue-100 text-left">
                    <th className="px-4 py-2 border">Title</th>
                    <th className="px-4 py-2 border">ISBN</th>
                    <th className="px-4 py-2 border">Issue Date</th>
                    <th className="px-4 py-2 border">Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.history.map((entry, index) => (
                    <tr key={index} className="border-t hover:bg-gray-100">
                      <td className="px-4 py-2 border">{entry.title}</td>
                      <td className="px-4 py-2 border">{entry.isbn}</td>
                      <td className="px-4 py-2 border">{new Date(entry.issueDate).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border">
                        {entry.returnDate !== 'Not returned yet' ? new Date(entry.returnDate).toLocaleDateString() : 'Not returned yet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No historical records found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentBookHistory;
