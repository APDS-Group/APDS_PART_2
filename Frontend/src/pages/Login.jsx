import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSucess } from '../utils';
import '../App.css'; // Import the CSS file

function Login({ setIsAuthenticated }) {
  const [loginInfo, setLoginInfo] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newUserInfo = { ...loginInfo };
    newUserInfo[name] = value;
    setLoginInfo(newUserInfo);

    // Clear the error message for the changed field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  // Handle form submission for login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    // Validate email and password fields
    if (!email || !password) {
      setErrors({
        email: !email ? 'Email is required' : '',
        password: !password ? 'Password is required' : ''
      });
      return handleError('Email and password are required');
    }

    try {
      const url = "https://localhost:5050/user/login/";

      // Send login request to the server
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });
      const data = await response.json();
      if (data.success) {
        // Save the token and user details to local storage
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userDetails', JSON.stringify({ name: data.name, email: data.email, joined: 'January 1, 2020' }));
        setIsAuthenticated(true);
        handleSucess('Login successful');
        navigate('/');
      } else {
        handleError(data.message);
      }
    } catch (error) {
      handleError('Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <button type="submit" className="primary-button">Login</button>
        </form>
        <div className="center-text">
          <span>Don't have an account? <a href="/register">Register</a></span>
        </div>
      </div>
    </div>
  );
}

export default Login;