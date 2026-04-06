import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const role = localStorage.getItem('role');
  const isLoggedIn = localStorage.getItem('username');
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🏏</span>
          <span className="logo-text">IPL Predictor</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Dashboard
          </Link>
          <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
            Leaderboard
          </Link>
          <Link to="/match-history" className={`nav-link ${isActive('/match-history') ? 'active' : ''}`}>
            Match History
          </Link>
          {role === 'ADMIN' && (
            <Link to="/admin" className={`nav-link admin-btn ${isActive('/admin') ? 'active' : ''}`}>
              Admin Panel
            </Link>
          )}
          {isLoggedIn ? (
            <button
              className={`nav-link logout-btn ${isActive('/logout') ? 'active' : ''}`}
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" className={`nav-link login-btn ${isActive('/login') ? 'active' : ''}`}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
