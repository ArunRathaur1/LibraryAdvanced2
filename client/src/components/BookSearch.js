import React, { useState, useEffect } from 'react';

const BookSearch = () => {
  const [genre, setGenre] = useState('');
  const [searchTerm, setSearchTerm] = useState(''); // Search by book title
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // To store filtered books
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [genresList, setGenresList] = useState([]); // State to store unique genres

  // Fetch all book data on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/library/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();

        // Filter out books where deleted is true
        const nonDeletedBooks = data.filter(book => !book.deleted);

        setBooks(nonDeletedBooks);
        setFilteredBooks(nonDeletedBooks); // Initially, show all non-deleted books

        // Extract unique genres from the non-deleted books data
        const uniqueGenres = [...new Set(nonDeletedBooks.map(book => book.genre))];
        setGenresList(uniqueGenres); // Store the unique genres in state
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Real-time filtering logic based on genre and searchTerm
  useEffect(() => {
    let filtered = books;

    // Filter by genre if genre is provided
    if (genre) {
      filtered = filtered.filter((book) =>
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    // Search by book title
    if (searchTerm) {
      filtered = filtered.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBooks(filtered); // Update the filtered books list
  }, [genre, searchTerm, books]); // Trigger filtering whenever genre, searchTerm, or books change

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-600">Search for Books</h2>

      {/* Search Form */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by Book Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Updates searchTerm on input change
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
        />

        {/* Genre Dropdown with Auto-suggest */}
        <input
          list="genre-options"
          type="text"
          placeholder="Filter by Genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)} // Updates genre on input change
          className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 w-full"
        />
        <datalist id="genre-options">
          {genresList.map((g, index) => (
            <option key={index} value={g} />
          ))}
        </datalist>
        <button
          type="submit"
          className="bg-blue-500 text-white py-3 px-20 rounded-lg hover:bg-blue-600 transition-all col-span-5 sm:col-span-1 sm:justify-self-center"
        >
          Search
        </button>
      </div>

      {/* Loading Spinner */}
      {loading && <div className="text-center text-gray-600">Loading...</div>}

      {/* Error Message */}
      {error && <div className="text-center text-red-500">{error}</div>}

      {/* Book Results Table */}
      {filteredBooks.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="text-left p-4">Book Title</th>
                <th className="text-left p-4">Genre</th>
                <th className="text-left p-4">Author</th>
                <th className="text-left p-4">ISBN</th>
                <th className="text-left p-4">Published Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {filteredBooks.map((book) => (
                <tr key={book._id} className="hover:bg-gray-100 transition-colors">
                  <td className="p-4 border-b">{book.title}</td>
                  <td className="p-4 border-b">{book.genre}</td>
                  <td className="p-4 border-b">{book.author}</td>
                  <td className="p-4 border-b">{book.isbn}</td>
                  <td className="p-4 border-b">{book.published_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        !loading && (
          <p className="text-center text-gray-500 mt-4">No books found for the search criteria.</p>
        )
      )}
    </div>
  );
};

export default BookSearch;
