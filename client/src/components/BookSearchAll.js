import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BookSearchAll() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
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

  // Update filteredBooks when any of the filters change
  useEffect(() => {
    let filteredData = books;

    // Filter by book title
    if (searchTitle) {
      filteredData = filteredData.filter((book) =>
        book.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by genre
    if (genreFilter) {
      filteredData = filteredData.filter((book) =>
        book.genre.toLowerCase().includes(genreFilter.toLowerCase())
      );
    }

    // Filter by library name or library code
    if (libraryFilter) {
      filteredData = filteredData.filter((book) =>
        book.libraryDetails.libraryName.toLowerCase().includes(libraryFilter.toLowerCase()) ||
        book.libraryId.toLowerCase().includes(libraryFilter.toLowerCase())
      );
    }

    setFilteredBooks(filteredData);
  }, [searchTitle, genreFilter, libraryFilter, books]);

  return (
    <div className="container mx-auto p-6  rounded-lg ">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-8 text-center">
      Find Your Favorite Books
    </h2>
  
    {/* Filter Section */}
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
      <input
        type="text"
        placeholder="Search by Book Title"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
      />
      <input
        type="text"
        placeholder="Filter by Genre"
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
      />
      <input
        type="text"
        placeholder="Filter by Library Name or Code"
        value={libraryFilter}
        onChange={(e) => setLibraryFilter(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg shadow-md focus:ring-2 focus:ring-blue-400 w-full md:w-1/3"
      />
    </div>
  
    {/* Table to display all books */}
    <div className="overflow-x-auto rounded-lg shadow-lg">
      <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-blue-500 to-purple-600 text-white uppercase text-sm leading-normal">
            <th className="py-4 px-6 text-left">Title</th>
            <th className="py-4 px-6 text-left">Author</th>
            <th className="py-4 px-6 text-left">Genre</th>
            <th className="py-4 px-6 text-left">Library Name</th>
            <th className="py-4 px-6 text-left">Library Code</th>
            <th className="py-4 px-6 text-left">Published Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 hover:bg-gray-100 transition-all duration-300 ease-in-out"
              >
                <td className="py-4 px-6 text-left whitespace-nowrap font-semibold text-gray-800">
                  {book.title}
                </td>
                <td className="py-4 px-6 text-left">{book.author}</td>
                <td className="py-4 px-6 text-left">{book.genre}</td>
                <td className="py-4 px-6 text-left">{book.libraryDetails.libraryName}</td>
                <td className="py-4 px-6 text-left">{book.libraryId}</td>
                <td className="py-4 px-6 text-left">{book.published_date}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-6 text-gray-500">
                No books found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
  
  );
}
