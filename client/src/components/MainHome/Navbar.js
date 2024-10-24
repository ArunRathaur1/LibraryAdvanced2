import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/People/5.jpeg';

function Navbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isMessageVisible, setMessageVisible] = useState(false);
  const navigate = useNavigate();
  const [isAdminLoggedIn, setAdminLogin] = useState(false);
  const [isStaffLoggedIn, setStaffLogin] = useState(false);

  useEffect(() => {
    const adminToken = Cookies.get('authTokenmain');
    const staffToken = Cookies.get('authToken');
    setAdminLogin(!!adminToken);
    setStaffLogin(!!staffToken);
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('authToken');
    Cookies.remove('authTokenmain');
    setAdminLogin(false);
    setStaffLogin(false);
    props.setstudentlogin(false);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDisplayMessage = async () => {
    try {
      const response = await fetch('http://localhost:5000/library/message');
      if (response.ok) {
        const data = await response.json();
        setAdminMessage(data.message);
        setUploadedFile(data.filePath); // Set the uploaded file path if available
        setMessageVisible(true); // Show the modal with the message
      } else {
        setAdminMessage('Failed to fetch the message.');
      }
    } catch (error) {
      setAdminMessage('Error fetching the message.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-white shadow-md z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center text-black relative z-10">
        {/* Logo and Home Link */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Library Logo"
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
          <Link
            className="text-2xl font-bold hover:text-blue-500 transition duration-300"
            to="/"
            onClick={handleLogout}
          >
            Chhattisgarh Library System
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} aria-expanded={isMenuOpen} aria-label="Toggle menu" className="text-black focus:outline-none">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8">
          <NavLink to="/studentLogin" onClick={handleLogout} className="text-lg hover:text-blue-500 transition duration-300">
            {!props.studnetlogin ? 'Student Login' : 'Logout'}
          </NavLink>
          <NavLink to="/booksearchall" className="text-lg hover:text-blue-500 transition duration-300">
            Book-Search
          </NavLink>
          <button onClick={handleDisplayMessage} className="text-lg hover:text-blue-500 transition duration-300">
            View Admin Message
          </button>
          {!isStaffLoggedIn ? (
            <NavLink to="/adminlogin" className="text-lg hover:text-blue-500 transition duration-300">
              Staff Login
            </NavLink>
          ) : (
            <button onClick={handleLogout} className="text-lg hover:text-blue-500 transition duration-300">
              Logout
            </button>
          )}
          {!isAdminLoggedIn ? (
            <NavLink to="/adminmainlogin" className="text-lg hover:text-blue-500 transition duration-300">
              Admin-Login
            </NavLink>
          ) : (
            <button onClick={handleLogout} className="text-lg hover:text-blue-500 transition duration-300">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-10">
            <div className="flex flex-col items-center py-4 space-y-4 text-black">
              <NavLink to="/studentLogin" onClick={handleLogout} className="text-lg hover:text-blue-500 transition duration-300">
                {!props.studnetlogin ? 'Student Login' : 'Logout'}
              </NavLink>
              <NavLink to="/booksearchall" className="text-lg hover:text-blue-500 transition duration-300">
                Book-Search
              </NavLink>
              <button onClick={handleDisplayMessage} className="text-lg hover:text-blue-500 transition duration-300">
                View Admin Message
              </button>
              {!isStaffLoggedIn ? (
                <NavLink to="/adminlogin" className="text-lg hover:text-blue-500 transition duration-300">
                  Staff Login
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="text-lg hover:text-blue-500 transition duration-300">
                  Logout
                </button>
              )}
              {!isAdminLoggedIn ? (
                <NavLink to="/adminmainlogin" className="text-lg hover:text-blue-500 transition duration-300">
                  Admin-Login
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="text-lg hover:text-blue-500 transition duration-300">
                  Logout
                </button>
              )}
              <button onClick={toggleMenu} className="text-lg hover:text-blue-500 transition duration-300">
                Close Menu
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Modal for displaying the message */}
      {isMessageVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm">
            <h2 className="text-xl font-bold mb-4">Admin Message</h2>
            <Link to="http://localhost:5000/library/download"></Link>
            <p>{adminMessage}</p>
            {uploadedFile && (
              <div className="mt-4">
                <a
                  href={`http://localhost:5000/library/download`} // Updated to use the correct URL
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Uploaded File
                </a>
              </div>
            )}
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => setMessageVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
