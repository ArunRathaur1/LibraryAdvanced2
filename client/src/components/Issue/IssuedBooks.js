import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const IssuedBooks = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [searchId, setSearchId] = useState(''); // State for searching by Student ID
  const [searchISBN, setSearchISBN] = useState(''); // State for searching by ISBN
  const [filteredBooks, setFilteredBooks] = useState([]); // State for filtered results

  useEffect(() => {
    const fetchIssuedBooks = async () => {
      try {
        const token = Cookies.get('authToken'); // Get the token from cookies
  
        const response = await fetch('http://localhost:5000/library/students/issued', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`, // Pass the token in the Authorization header
          },
        });
  
        const data = await response.json();
  
        // Flatten the data structure so each issued book is associated with its student
        const allIssuedBooks = data.flatMap(student => 
          student.issued_books.map(book => ({
            ...book,
            student_name: student.name,
            student_id: student.student_id,
            issueDate: book.issueDate, // Assuming book.issueDate exists
          }))
        );
  
        // Sort all issued books by the number of days since the book was issued
        const sortedIssuedBooks = allIssuedBooks.sort((a, b) => {
          const daysA = calculateDaysSinceIssued(a.issueDate);
          const daysB = calculateDaysSinceIssued(b.issueDate);
          return daysB - daysA; // Sort in descending order (more days at the top)
        });
  
        setIssuedBooks(sortedIssuedBooks);
        setFilteredBooks(sortedIssuedBooks); // Initialize filtered books
      } catch (error) {
        console.error('Error fetching issued books:', error);
      }
    };
  
    fetchIssuedBooks();
  }, []);
  
  // Calculate the number of days since the book was issued
  const calculateDaysSinceIssued = (issueDate) => {
    if (!issueDate) return 0;
    const currentDate = new Date();
    const issuedDate = new Date(issueDate);
    const differenceInTime = currentDate - issuedDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  // Handle search input change for Student ID
  const handleSearchIdChange = (event) => {
    const { value } = event.target;
    setSearchId(value);

    // Filter based on Student ID
    const filtered = issuedBooks.filter(book => 
      book.student_id.toString().includes(value) && book.isbn.includes(searchISBN) // Ensure both filters work
    );
    setFilteredBooks(filtered);
  };

  // Handle search input change for ISBN
  const handleSearchISBNChange = (event) => {
    const { value } = event.target;
    setSearchISBN(value);

    // Filter based on ISBN
    const filtered = issuedBooks.filter(book => 
      book.isbn.includes(value) && book.student_id.toString().includes(searchId) // Ensure both filters work
    );
    setFilteredBooks(filtered);
  };

  return (
    <div className="container mx-auto p-6 rounded shadow-md bg-white">
      <h2 className="text-2xl font-semibold mb-4">Issued Books</h2>
      
      {/* Search Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Search by Student ID */}
        <input
          type="text"
          value={searchId}
          onChange={handleSearchIdChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Search by Student ID"
        />

        {/* Search by ISBN */}
        <input
          type="text"
          value={searchISBN}
          onChange={handleSearchISBNChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          placeholder="Search by ISBN"
        />
      </div>
  
      {filteredBooks.length === 0 ? (
        <p>No books are currently issued.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr>
                <th className="border-b p-4 text-left">Student Name</th>
                <th className="border-b p-4 text-left">Student ID</th>
                <th className="border-b p-4 text-left">Book Title</th>
                <th className="border-b p-4 text-left">Author</th>
                <th className="border-b p-4 text-left">ISBN</th>
                <th className="border-b p-4 text-left">Days Issued</th> {/* New column for days passed */}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-150">
                  <td className="border-b p-4">{book.student_name}</td>
                  <td className="border-b p-4">{book.student_id}</td>
                  <td className="border-b p-4">{book.title}</td>
                  <td className="border-b p-4">{book.author}</td>
                  <td className="border-b p-4">{book.isbn}</td>
                  <td className="border-b p-4">{calculateDaysSinceIssued(book.issueDate)}</td> {/* Days issued */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IssuedBooks;
