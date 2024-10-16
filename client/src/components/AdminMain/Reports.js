import React, { useEffect, useState } from 'react';

function Reports() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await fetch('http://localhost:5000/library/report');
        const data = await response.json();
        setReportData(data);
      } catch (error) {
        console.error('Error fetching report data:', error);
      }
    };

    fetchReportData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Library Report</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b-2">Library Name</th>
            <th className="px-4 py-2 border-b-2">Library ID</th>
            <th className="px-4 py-2 border-b-2">City</th>
            <th className="px-4 py-2 border-b-2">Total Books</th>
            <th className="px-4 py-2 border-b-2">Total Students</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? (
            reportData.map((library, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b">{library.libraryName || 'None'}</td>
                <td className="px-4 py-2 border-b">{library.libraryId || 'None'}</td>
                <td className="px-4 py-2 border-b">{library.city || 'None'}</td>
                <td className="px-4 py-2 border-b">{library.totalBooks > 0 ? library.totalBooks : 'None'}</td>
                <td className="px-4 py-2 border-b">{library.totalStudents > 0 ? library.totalStudents : 'None'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-4 py-2 border-b text-center" colSpan="5">
                No library data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Reports;
