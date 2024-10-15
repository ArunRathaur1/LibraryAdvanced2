import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function StudentDetails({ student }) {
  const [studentData, setStudentData] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = Cookies.get('authToken');
      try {
        const response = await fetch('http://localhost:5000/library/students/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
          body: JSON.stringify({ student_id: student }), // Assuming student prop contains student_id
        });

        const result = await response.json();
        if (result.student) {
          // Sort the book history before setting state
          result.student.bookHistory.sort((a, b) => {
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

          setStudentData(result.student);
          setDataLoaded(true);
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        navigate('/dashboard/studentdetails');
      }
    };

    if (!student) {
      navigate('/dashboard/studentdetails');
    } else {
      fetchStudentDetails();
    }
  }, [student, navigate]);

  if (!dataLoaded) {
    return <p>Loading student data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
  <div className="container mx-auto">
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>

      {/* Student Info */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Student Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><span className="font-bold">Name:</span> {studentData.name}</p>
          <p><span className="font-bold">Phone:</span> {studentData.phone}</p>
          <p><span className="font-bold">Email:</span> {studentData.email}</p>
          <p><span className="font-bold">Address:</span> {studentData.address}</p>
          <p><span className="font-bold">Registration Date:</span> {new Date(studentData.entrydate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
          <p><span className="font-bold">Fee Payment Duration:</span> {studentData.feeStatus.paymentDuration}</p>
          <p><span className="font-bold">Last Payment Date:</span> {new Date(studentData.feeStatus.lastPaymentDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Issued Books */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Issued Books</h3>
        {studentData.issued_books && studentData.issued_books.length > 0 ? (
          <ul className="list-disc list-inside">
            {studentData.issued_books.map((book, index) => (
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
        {studentData.bookHistory && studentData.bookHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
                <tr>
                  <th className="p-2">Title</th>
                  <th className="p-2">Issue Date</th>
                  <th className="p-2">Return Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {studentData.bookHistory.map((history, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{history.title}</td>
                    <td className="p-2">{new Date(history.issueDate).toLocaleDateString()}</td>
                    <td className="p-2">
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
