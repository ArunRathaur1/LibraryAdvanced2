import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../../assets/People/5.jpeg';

function Navbar(props) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
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
        setMessageVisible(true);
      } else {
        setAdminMessage('Failed to fetch the message.');
      }
    } catch (error) {
      setAdminMessage('Error fetching the message.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-500 shadow-md z-10">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center text-white relative z-10">
        {/* Logo and Home Link */}
        <div className="flex items-center">
          <img
            src={logo}
            alt="Library Logo"
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
          <Link
            className="text-2xl font-bold hover:text-yellow-300 transition duration-300"
            to="/"
            onClick={handleLogout}
          >
            Chhattisgarh Library System
          </Link>
        </div>

        {/* Hamburger Menu for Mobile */}
        <div className="lg:hidden">
          <button onClick={toggleMenu} aria-expanded={isMenuOpen} aria-label="Toggle menu" className="text-white focus:outline-none">
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
          <NavLink to="/studentLogin" onClick={handleLogout} className="text-lg hover:text-yellow-300 transition duration-300">
            {!props.studnetlogin ? 'Student Login' : 'Logout'}
          </NavLink>
          <NavLink to="/booksearchall" className="text-lg hover:text-yellow-300 transition duration-300">
            Book-Search
          </NavLink>
          <button onClick={handleDisplayMessage} className="text-lg hover:text-yellow-300 transition duration-300">
            View Admin Message
          </button>
          {!isStaffLoggedIn ? (
            <NavLink to="/adminlogin" className="text-lg hover:text-yellow-300 transition duration-300">
              Staff Login
            </NavLink>
          ) : (
            <button onClick={handleLogout} className="text-lg hover:text-yellow-300 transition duration-300">
              Logout
            </button>
          )}
          {!isAdminLoggedIn ? (
            <NavLink to="/adminmainlogin" className="text-lg hover:text-yellow-300 transition duration-300">
              Admin-Login
            </NavLink>
          ) : (
            <button onClick={handleLogout} className="text-lg hover:text-yellow-300 transition duration-300">
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-blue-500 shadow-lg z-10">
            <div className="flex flex-col items-center py-4 space-y-4 text-white">
              <NavLink to="/studentLogin" onClick={handleLogout} className="text-lg hover:text-yellow-300 transition duration-300">
                {!props.studnetlogin ? 'Student Login' : 'Logout'}
              </NavLink>
              <NavLink to="/booksearchall" className="text-lg hover:text-yellow-300 transition duration-300">
                Book-Search
              </NavLink>
              <button onClick={handleDisplayMessage} className="text-lg hover:text-yellow-300 transition duration-300">
                View Admin Message
              </button>
              {!isStaffLoggedIn ? (
                <NavLink to="/adminlogin" className="text-lg hover:text-yellow-300 transition duration-300">
                  Staff Login
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="text-lg hover:text-yellow-300 transition duration-300">
                  Logout
                </button>
              )}
              {!isAdminLoggedIn ? (
                <NavLink to="/adminmainlogin" className="text-lg hover:text-yellow-300 transition duration-300">
                  Admin-Login
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="text-lg hover:text-yellow-300 transition duration-300">
                  Logout
                </button>
              )}
              <button onClick={toggleMenu} className="text-lg hover:text-yellow-300 transition duration-300">
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
            <p>{adminMessage}</p>
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
