import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import XLSX library
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function Student(props) {
  const [students, setStudents] = useState([]); // Initialize students as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchID, setSearchID] = useState('');
  const navigate = useNavigate();

  // Function to fetch all students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = Cookies.get('authToken'); // Get the token from cookies

      const response = await fetch('http://localhost:5000/library/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Pass the token in the Authorization header
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }

      const data = await response.json();

      // Map through students to add the count of issued books
      const studentsWithIssuedCount = data.map(student => ({
        ...student,
        issuedCount: student.issued_books ? student.issued_books.length : 0, // Count issued books
      }));

      setStudents(studentsWithIssuedCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a student by id
  const deleteStudent = async (id, studentId, issuedBooksCount) => {
    // Check if the student has any issued books
    if (issuedBooksCount > 0) {
      alert(`This student has ${issuedBooksCount} book(s) issued. Please return the books before deleting.`);
      return; // Prevent deletion if books are issued
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete the student with ID: ${studentId}?`);
    if (confirmDelete) {
      try {
        const token = Cookies.get('authToken'); // Get the token from cookies

        const response = await fetch(`http://localhost:5000/library/students/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // Pass the token in the Authorization header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to delete student');
        }

        // Filter out the deleted student from the state
        setStudents(students.filter(student => student._id !== id));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle student search by name and ID
  const filteredStudents = students.filter(student => {
    return (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (searchID === '' || student.student_id.includes(searchID))
    );
  });

  // Function to export students data to Excel
  const exportToExcel = () => {
    // Exclude sensitive details such as password and bookHistory
    const filteredStudents = students.map(({ password, bookHistory,feeStatus,issued_books,_id,__v, ...rest }) => rest); // Remove password and bookHistory fields
  
    const worksheet = XLSX.utils.json_to_sheet(filteredStudents); // Convert filtered JSON to sheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students"); // Append sheet
  
    // Download the Excel file
    XLSX.writeFile(workbook, "students_data.xlsx");
  };
  

  return (
    <div className="min-h-screen p-6 bg-gradient-to-r from-blue-50 to-blue-100">
      {loading && <div className="text-center text-gray-500">Loading...</div>}
      {!loading && (
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-700 mb-8">Student Details</h1>

          {/* Search and filter section */}
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
            {/* Search by Name */}
            <input
              type="text"
              placeholder="Search students by name"
              className="border border-gray-300 p-2 rounded w-full sm:w-1/2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Search by Student ID */}
            <input
              type="text"
              placeholder="Search by Student ID"
              className="border border-gray-300 p-2 rounded w-full sm:w-1/4"
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
            />

            {/* Add New Student button */}
            <Link
              to='/dashboard/addstudent'
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-all w-full sm:w-1/4 text-center"
            >
              Add New Student
            </Link>

            {/* Export to Excel button */}
            <button
              onClick={exportToExcel} 
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full sm:w-1/4 text-center"
            >
              Download Students Data
            </button>
          </div>

          {/* Table displaying students */}
          <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full text-left table-auto border-collapse border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-4 border">Name</th>
                  <th className="p-4 border">Phone</th>
                  <th className="p-4 border">Address</th>
                  <th className="p-4 border">Student ID</th>
                  <th className="p-4 border">Issued Books</th> {/* New column for issued books */}
                  <th className="p-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-100 transition-colors">
                      <td className="p-4 border">{student.name}</td>
                      <td className="p-4 border">{student.phone}</td>
                      <td className="p-4 border">{student.address}</td>
                      <td className="p-4 border">{student.student_id}</td>
                      <td className="p-4 border">{student.issuedCount}</td> {/* Display issued books count */}
                      <td className="p-4 border space-x-2">
                        <Link to="/dashboard/updateStudentDetails">
                          <button 
                            onClick={() => props.setstudentdata(student)} // Pass student data to parent component
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition-all"
                          >
                            Update
                          </button>
                        </Link>
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition-all"
                          onClick={() => deleteStudent(student._id, student.student_id, student.issuedCount)} // Pass issuedCount here
                        >
                          Delete
                        </button>
                        <Link to='/dashboard/showStudentDetail'>
                          <button
                            className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition-all"
                            onClick={() => props.setstudentdatatoadmin(student.student_id)} // Pass student ID here
                          >
                            Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 border text-center" colSpan="6">
                      No students found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}
