import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import { Outlet } from 'react-router-dom';
import Cookies from 'js-cookie';

export default function AdminMainHome() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if authTokenmain exists
    const authTokenMain = Cookies.get('authTokenmain');
    
    if (!authTokenMain) {
      // If not found, navigate to home page
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <AdminNavbar />
      <Outlet />
    </div>
  );
}
