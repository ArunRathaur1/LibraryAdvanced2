import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentDashboard({ student }) {
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (!student) {
      navigate('/studentLogin');
    } else {
      setDataLoaded(true); // Ensure that the data is available before rendering
    }
  }, [student, navigate]);

  // Sorting function for the book history
  const sortBookHistory = (bookHistory) => {
    return bookHistory.sort((a, b) => {
      // First, prioritize books that haven't been returned
      if (a.returnDate === 'Not returned yet' && b.returnDate !== 'Not returned yet') {
        return -1; // a (not returned) goes before b (returned)
      } else if (a.returnDate !== 'Not returned yet' && b.returnDate === 'Not returned yet') {
        return 1; // b (not returned) goes before a (returned)
      } else {
        // If both books are either returned or not, sort by issue date (newest first)
        const issueDateA = new Date(a.issueDate);
        const issueDateB = new Date(b.issueDate);
        return issueDateB - issueDateA;
      }
    });
  };

  if (!student || !dataLoaded) {
    return <p>Loading student data...</p>; // Optional: add a loading indicator
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
    <div className="container mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
  
        {/* Student Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Student Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <p><span className="font-bold">Name:</span> {student.name}</p>
            <p><span className="font-bold">Phone:</span> {student.phone}</p>
            <p><span className="font-bold">Email:</span> {student.email}</p>
            <p><span className="font-bold">Address:</span> {student.address}</p>
            <p><span className="font-bold">Registration Date:</span> {new Date(student.entrydate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
            <p><span className="font-bold">Fee Payment Duration:</span> {student.feeStatus.paymentDuration}</p>
            <p><span className="font-bold">Last Payment Date:</span> {new Date(student.feeStatus.lastPaymentDate).toLocaleDateString()}</p>
          </div>
        </div>
  
        {/* Issued Books */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Issued Books</h3>
          {student.issued_books && student.issued_books.length > 0 ? (
            <ul className="list-disc list-inside">
              {student.issued_books.map((book, index) => (
                <li key={index} className="mb-2">
                  <p><span className="font-bold">Title:</span> {book.title}</p>
                  <p><span className="font-bold">ISBN:</span> {book.isbn}</p>
                  <p><span className="font-bold">Issue Date:</span> {new Date(book.issueDate).toLocaleDateString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No issued books</p>
          )}
        </div>
  
        {/* Book History */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Book History</h3>
          {student.bookHistory && student.bookHistory.length > 0 ? (
            <div className="overflow-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="p-2 text-left">Title</th>
                    <th className="p-2 text-left">Issue Date</th>
                    <th className="p-2 text-left">Return Date</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {sortBookHistory(student.bookHistory).map((history, index) => (
                    <tr key={index}>
                      <td className="p-2 border-t">{history.title}</td>
                      <td className="p-2 border-t">{new Date(history.issueDate).toLocaleDateString()}</td>
                      <td className="p-2 border-t">
                        {history.returnDate !== 'Not returned yet' ? new Date(history.returnDate).toLocaleDateString() : 'Not returned yet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No book history available</p>
          )}
        </div>
      </div>
    </div>
  </div>
  
  );
}