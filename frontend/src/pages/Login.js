import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isLogin) {
      if (!formData.username || !formData.password) {
        setError('Please fill in all fields');
        return;
      }
      // Dummy credentials for testing (no backend needed)
      const validUsers = [
        { username: 'admin', password: 'password123' },
        { username: 'user1', password: 'password123' },
        { username: 'user2', password: 'password123' },
        { username: 'test', password: 'test123' }
      ];
      
      const isValidUser = validUsers.some(
        user => user.username === formData.username && user.password === formData.password
      );
      
      if (isValidUser) {
        // Store user info
        const role = formData.username === 'admin' ? 'ADMIN' : 'USER';
        localStorage.setItem('username', formData.username);
        localStorage.setItem('role', role);
        // Simulate successful login - redirect to dashboard
        window.location.href = '/';
      } else {
        setError('Invalid credentials. Try: admin / password123');
      }
    } else {
      if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      // Register logic here
      console.log('Register:', formData);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">
              {isLogin ? 'Welcome Back! 👋' : 'Join the Community! 🚀'}
            </h1>
            <p className="login-subtitle">
              {isLogin 
                ? 'Login to track predictions and compete with fans' 
                : 'Create an account to start predicting matches'}
            </p>
          </div>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                ⚠️ {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
            
            {isLogin && (
              <div className="forgot-password">
                <a href="#forgot">Forgot password?</a>
              </div>
            )}
            
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button 
                type="button"
                className="toggle-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
          
          <div className="social-login">
            <p>Or continue with</p>
            <div className="social-buttons">
              <button className="social-btn google">
                🔵 Google
              </button>
              <button className="social-btn facebook">
                🔷 Facebook
              </button>
            </div>
          </div>
        </div>
        
        <Link to="/" className="back-home">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Login;
