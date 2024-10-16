import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [studentIds, setStudentIds] = useState([]); // New state to store student IDs
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle the menu

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      navigate('/'); // Redirect to home if token is not found
    }
  }, [navigate]);

  // Function to handle navigation to different sections
  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false); // Close the menu after navigation
  };

  // Function to send overdue emails using fetch
  const handleSendOverdueEmails = async () => {
    // Show confirmation dialog
    const confirmSend = window.confirm('Are you sure you want to send overdue emails to students?');
    if (!confirmSend) {
      return; // If the admin cancels, do nothing
    }

    setLoading(true);
    setMessage('');
    setStudentIds([]);

    try {
      const response = await fetch('http://localhost:5000/library/send-overdue-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setStudentIds(data.studentIds);
      } else {
        setMessage('Error sending overdue emails.');
      }
    } catch (error) {
      setMessage('Error sending overdue emails.');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
        setStudentIds([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* Mini Navbar */}
      <nav className="bg-white shadow-md rounded-md p-4 mb-6 " style={{display:'flex',justifyContent:"space-between"}} >
        <div className="text-xl font-bold text-gray-700 mb-4 md:mb-0">Admin Dashboard</div>

        {/* Triple Dots Menu Button */}
        <div className="md:hidden relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
            <svg
              className="w-8 h-8 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
              <button
                onClick={() => handleNavigation('/dashboard/issuebooks')}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
              >
                Issue & Return
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/studentdetails')}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
              >
                Student Details
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/bookdetails')}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
              >
                Book Details
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/issuedbooks')}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
              >
                Issued Books
              </button>
              <button
                onClick={handleSendOverdueEmails}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
                disabled={loading}
              >
                {loading ? 'Sending Emails...' : 'Send Overdue Emails'}
              </button>
              {/* <button
                onClick={() => handleNavigation('/dashboard/postmessage')}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
              >
                Post Message
              </button> */}
              <button
                onClick={() => handleNavigation('/dashboard/feepayment')}
                className="block px-4 py-2 text-gray-800 hover:bg-blue-500 hover:text-white"
              >
                Fee Payment
              </button>
              <button
                onClick={() => handleNavigation('/dashboard/addadmin')}
                className="block px-4 py-2 text-red-500 hover:bg-red-600 hover:text-white"
              >
                Add/Delete Admin
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          {/* Desktop Buttons */}
          <button
            onClick={() => handleNavigation('/dashboard/issuebooks')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
          >
            Issue & Return
          </button>
          <button
            onClick={() => handleNavigation('/dashboard/studentdetails')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
          >
            Student Details
          </button>
          <button
            onClick={() => handleNavigation('/dashboard/bookdetails')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
          >
            Book Details
          </button>
          <button
            onClick={() => handleNavigation('/dashboard/issuedbooks')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
          >
            Issued Books
          </button>
          <button
            onClick={handleSendOverdueEmails}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
            disabled={loading}
          >
            {loading ? 'Sending Emails...' : 'Send Overdue Emails'}
          </button>
          {/* Button to navigate to Post Message page */}
          {/* <button
            onClick={() => handleNavigation('/dashboard/postmessage')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
          >
            Post Message
          </button> */}

          {/* New Button for Fee Payment */}
          <button
            onClick={() => handleNavigation('/dashboard/feepayment')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full md:w-auto"
          >
            Fee Payment
          </button>
          <button
            onClick={() => handleNavigation('/dashboard/addadmin')}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full md:w-auto"
          >
            Add/Delete Admin
          </button>
        </div>
      </nav>

      {message && (
        <div className="text-center text-red-500 mb-4">
          <p>{message}</p>
          {studentIds.length > 0 && (
            <div className="mt-4">
              <p>Emails were sent to the following students:</p>
              <ul className="list-disc list-inside">
                {studentIds.map((id) => (
                  <li key={id}>{id}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Outlet to render nested routes */}
      <Outlet />
    </div>
  );
};

export default AdminDashboard;
