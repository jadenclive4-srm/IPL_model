import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const role = localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('username');

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏏</span>
          <span className="logo-text">IPL Predictor</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link active">
            Dashboard
          </Link>
          <Link to="/leaderboard" className="nav-link">
            Leaderboard
          </Link>
          <Link to="/match-history" className="nav-link">
            Match History
          </Link>
          {role === 'ADMIN' && (
            <Link to="/admin" className="nav-link admin-btn">
              Admin Panel
            </Link>
          )}
          {isLoggedIn ? (
            <button
              className="nav-link logout-btn"
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className="nav-link login-btn">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
