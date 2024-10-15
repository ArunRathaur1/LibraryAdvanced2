import React from 'react';
import { Link } from 'react-router-dom'; // Use if you are using react-router for navigation

export default function AdminNavbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <Link to="/adminmainhome/addlibrary" className="text-white text-lg font-semibold hover:text-gray-300">
            Add Library
          </Link>
          <Link to="/show-reports" className="text-white text-lg font-semibold hover:text-gray-300">
            Show Reports
          </Link>
          <Link to="/adminmainhome/addadmin" className="text-white text-lg font-semibold hover:text-gray-300">
            Add Admins
          </Link>
          <Link to="/adminmainhome/showlibraries" className="text-white text-lg font-semibold hover:text-gray-300">
            Show Libraries
          </Link>
          <Link to="/adminmainhome/addhead" className="text-white text-lg font-semibold hover:text-gray-300">
            Add Head Librarian
          </Link>
        </div>
      </div>
    </nav>
  );
}
