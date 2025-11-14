import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <img src="https://logosmarken.com/wp-content/uploads/2020/04/Toyota-Emblem.png" alt="Car Rental Logo" className="navbar-logo" />
            <span className="brand-text">Car Rental</span>
          </Link>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/cars" className="nav-link">Cars</Link>
            {user ? (
              <>
                <Link to="/bookings" className="nav-link">My Bookings</Link>
                {user.isAdmin && (
                  <Link to="/admin" className="nav-link">Admin</Link>
                )}
                <span className="nav-link">Welcome, {user.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

