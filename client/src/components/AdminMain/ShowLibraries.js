import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShowLibraries() {
  const [libraries, setLibraries] = useState([]); // State to hold library data
  const [filteredLibraries, setFilteredLibraries] = useState([]); // State for filtered library data
  const [error, setError] = useState(null); // State to hold error messages
  const [searchName, setSearchName] = useState(''); // State for search by librarian name
  const [searchUniqueId, setSearchUniqueId] = useState(''); // State for search by unique ID

  useEffect(() => {
    // Function to fetch libraries
    const fetchLibraries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/library/librariesData');
        if (response.data.libraries) {
          setLibraries(response.data.libraries); // Set libraries in state
          setFilteredLibraries(response.data.libraries); // Initialize filtered libraries
        }
      } catch (err) {
        console.error('Error fetching libraries:', err);
        setError('Error fetching libraries'); // Set error message
      }
    };

    fetchLibraries(); // Call the fetch function
  }, []); // Empty dependency array means this runs once when the component mounts

  // Function to filter libraries based on input values
  const filterLibraries = () => {
    const filtered = libraries.filter(library => {
      const matchesName = library.librarianName.toLowerCase().includes(searchName.toLowerCase());
      const matchesUniqueId = library.uniqueId ? library.uniqueId.toString().includes(searchUniqueId) : searchUniqueId === '';
      return matchesName && matchesUniqueId;
    });

    setFilteredLibraries(filtered);
  };

  // Call the filter function whenever search inputs change
  useEffect(() => {
    filterLibraries();
  }, [searchName, searchUniqueId]); // Dependency array includes search inputs

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Libraries</h1>
      {error && <p className="text-red-600 text-center mb-4">{error}</p>} {/* Display error if any */}
      
      {/* Search Inputs */}
      <div className="mb-4 flex justify-center space-x-4">
        <input
          type="text"
          placeholder="Search by Librarian Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
        <input
          type="text"
          placeholder="Search by Unique ID"
          value={searchUniqueId}
          onChange={(e) => setSearchUniqueId(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-left">
              <th className="py-3 px-4 border-b border-gray-300">Librarian Name</th>
              <th className="py-3 px-4 border-b border-gray-300">Email</th>
              <th className="py-3 px-4 border-b border-gray-300">Contact Number</th>
              <th className="py-3 px-4 border-b border-gray-300">Library Name</th>
              <th className="py-3 px-4 border-b border-gray-300">Library City</th>
              <th className="py-3 px-4 border-b border-gray-300">Library ID</th>
            </tr>
          </thead>
          <tbody>
            {filteredLibraries.map(library => (
              <tr key={library._id} className="hover:bg-gray-100 transition duration-300">
                <td className="py-3 px-4 border-b border-gray-300">{library.librarianName}</td>
                <td className="py-3 px-4 border-b border-gray-300">{library.email}</td>
                <td className="py-3 px-4 border-b border-gray-300">{library.contactNumber}</td>
                <td className="py-3 px-4 border-b border-gray-300">{library.libraryName}</td>
                <td className="py-3 px-4 border-b border-gray-300">{library.libraryCity}</td>
                <td className="py-3 px-4 border-b border-gray-300">{library.uniqueId || ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
