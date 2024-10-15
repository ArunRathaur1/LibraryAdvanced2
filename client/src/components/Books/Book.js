import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx'; // Import XLSX library
import Cookies from 'js-cookie';
export default function Book(props) {
  const { books, setBooks, setData } = props;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  // Function to fetch all books
  const fetchBooks = async () => {
    const token = Cookies.get('authToken'); // Get the token from cookies
  
    if (!token) {
      setError('Authentication token is missing. Please login again.');
      return;
    }
  
    try {
      setLoading(true);
      setError(''); // Clear previous errors
  
      const response = await fetch('http://localhost:5000/library/books', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Pass the token in the Authorization header
        },
      });
  
      if (!response.ok) {
        // Handle specific error status codes
        if (response.status === 401) {
          throw new Error('Unauthorized access. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied.');
        } else if (response.status === 404) {
          throw new Error('Books not found.');
        } else {
          throw new Error('Failed to fetch books.');
        }
      }
  
      const data = await response.json();
  
      // Filter out books where `deleted` is true
      const availableBooks = data.filter(book => !book.deleted);
  
      setBooks(availableBooks);
  
    } catch (error) {
      setError(error.message); // Display the error message in the UI
      console.log('Error fetching books:', error.message); // Log error for debugging
  
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };
  
  

  // Function to delete a book by id
  const deleteBook = async (id, isbn) => {
    const token = Cookies.get('authToken'); // Get the token from cookies
    const confirmDelete = window.confirm(`Are you sure you want to delete the book with ISBN: ${isbn}?`);
  
    if (!confirmDelete) return;
  
    try {
      // Fetch all students to check their issued_books arrays
      const responseStudents = await fetch('http://localhost:5000/library/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Pass the token in the Authorization header
        },
      });
  
      if (!responseStudents.ok) {
        throw new Error('Failed to fetch students');
      }
  
      const studentsData = await responseStudents.json();
  
      // Check if the book is issued to any student
      const isBookIssued = studentsData.some(student => 
        student.issued_books && student.issued_books.includes(id)
      );
  
      if (isBookIssued) {
        alert(`The book with ISBN: ${isbn} is currently issued to a student and cannot be deleted.`);
        return; // Stop the deletion if the book is issued
      }
  
      // Proceed with book deletion if it is not issued
      const responseDelete = await fetch(`http://localhost:5000/library/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`, // Pass the token in the Authorization header
        },
      });
  
      if (!responseDelete.ok) {
        throw new Error('Failed to delete book');
      }
  
      // Filter out the deleted book from the state
      setBooks(books.filter(book => book._id !== id));
  
    } catch (error) {
      setError(error.message);
    }
  };
  
  
  // Fetch books when the component mounts
  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line
  }, []);

  // Extract unique genres from the books array
  const genres = [...new Set(books.map((book) => book.genre))];

  // Handle book search and filtering by genre
  const filteredBooks = books.filter(book => {
    return (
      books &&
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedGenre === '' || book.genre === selectedGenre)
    );
  });

  // Function to export books data to Excel
  const exportToExcel = () => {
    // Filter out the 'deleted' field from each book object
    const filteredBooks = books.map(({ deleted,__v,_id, ...rest }) => rest); // Remove the 'deleted' field
  
    const worksheet = XLSX.utils.json_to_sheet(filteredBooks); // Convert filtered JSON to sheet
    const workbook = XLSX.utils.book_new(); // Create a new workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Books"); // Append sheet
  
    // Download the Excel file
    XLSX.writeFile(workbook, "books_data.xlsx");
  };
  

  return (
    <div>
    {loading && <div>Loading...</div>}
    {!loading && (
      <div className="p-4 md:p-6 bg-gradient-to-r from-blue-50 to-blue-100">
        <h1 className="text-xl md:text-2xl font-bold mb-4">Books Details</h1>
  
        {/* Search and filter section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          {/* Search box */}
          <input
            type="text"
            placeholder="Search books by name"
            className="border border-gray-300 p-2 rounded w-full md:w-1/2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
  
          {/* Genre filter */}
          <select
            className="border border-gray-300 p-2 rounded w-full md:w-1/4"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre}
              </option>
            ))}
          </select>
  
          {/* Add New Book button */}
          <Link
            to="/dashboard/addbook"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full md:w-1/4 text-center"
          >
            Add New Book
          </Link>
  
          {/* Export to Excel button */}
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600 w-full md:w-1/4 text-center"
          >
            Download Books Data
          </button>
        </div>
  
        {/* Table displaying books */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Book Name</th>
                <th className="text-left p-2 border-b">Genre</th>
                <th className="text-left p-2 border-b">Author</th>
                <th className="text-left p-2 border-b">ISBN</th>
                <th className="text-left p-2 border-b">Published Date</th>
                <th className="text-left p-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map((book, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b">{book.title}</td>
                    <td className="p-2 border-b">{book.genre}</td>
                    <td className="p-2 border-b">{book.author}</td>
                    <td className="p-2 border-b">{book.isbn}</td>
                    <td className="p-2 border-b">{book.published_date}</td>
                    <td className="p-2 border-b">
                      <Link to="/dashboard/updateDetails">
                        <button
                          onClick={() => setData(book)}
                          className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                        >
                          Update Details
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteBook(book._id, book.isbn)}
                      >
                        Delete Book
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-2 border-b text-center" colSpan="6">
                    No books found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
  
  );
}
