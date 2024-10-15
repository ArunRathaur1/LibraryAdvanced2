import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookSearchAll() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [genreFilter, setGenreFilter] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [libraryFilter, setLibraryFilter] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/library/allbooks');
        setBooks(response.data);
        setFilteredBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const handleFilterChange = () => {
    let filteredData = books;

    if (genreFilter) {
      filteredData = filteredData.filter((book) =>
        book.genre.toLowerCase().includes(genreFilter.toLowerCase())
      );
    }

    if (authorFilter) {
      filteredData = filteredData.filter((book) =>
        book.author.toLowerCase().includes(authorFilter.toLowerCase())
      );
    }

    if (libraryFilter) {
      filteredData = filteredData.filter((book) =>
        book.libraryName.toLowerCase().includes(libraryFilter.toLowerCase())
      );
    }

    setFilteredBooks(filteredData);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Book Search</h2>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Filter by Genre"
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Filter by Author"
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Filter by Library Name"
          value={libraryFilter}
          onChange={(e) => setLibraryFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleFilterChange}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Apply Filters
        </button>
      </div>

      {/* Table to display all books */}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Author</th>
            <th className="py-2 px-4 border-b">Genre</th>
            <th className="py-2 px-4 border-b">Library ID</th>
            <th className="py-2 px-4 border-b">Published Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{book.title}</td>
                <td className="py-2 px-4 border-b">{book.author}</td>
                <td className="py-2 px-4 border-b">{book.genre}</td>
                <td className="py-2 px-4 border-b">{book.libraryId}</td>
                <td className="py-2 px-4 border-b">{book.published_date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">No books found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
