import React, { useState } from 'react';
import Cookies from 'js-cookie';

export default function CreateLibrary() {
  const [formData, setFormData] = useState({
    librarianName: '',
    email: '',
    contactNumber: '',
    libraryName: '',
    libraryCity: '',
    uniqueId: '', // Add uniqueId to the state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // Output form data to console
    const authTokenMain = Cookies.get('authTokenmain');
    console.log('Token:', authTokenMain);
    try {
      // Send POST request to create a new library
      const response = await fetch('http://localhost:5000/library/create-library', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${authTokenMain}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create library');
      }

      const data = await response.json();
      console.log('Library created:', data);
      // Optionally reset the form after successful submission
      setFormData({
        librarianName: '',
        email: '',
        contactNumber: '',
        libraryName: '',
        libraryCity: '',
        uniqueId: '', // Reset uniqueId field
      });
      alert('Library created successfully!'); // Notify user on success
    } catch (error) {
      console.error('Error creating library:', error);
      alert('Failed to create library. Please check the console for details.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Create Library Entry</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="librarianName">
              Librarian Name
            </label>
            <input
              type="text"
              name="librarianName"
              value={formData.librarianName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="contactNumber">
              Contact Number
            </label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter your contact number"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="libraryName">
              Library Name
            </label>
            <input
              type="text"
              name="libraryName"
              value={formData.libraryName}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter the library name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="libraryCity">
              Library City
            </label>
            <input
              type="text"
              name="libraryCity"
              value={formData.libraryCity}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter the city where the library is located"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="uniqueId">
              Unique ID
            </label>
            <input
              type="text"
              name="uniqueId"
              value={formData.uniqueId}
              onChange={handleChange}
              required
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              placeholder="Enter the unique ID for the library"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
