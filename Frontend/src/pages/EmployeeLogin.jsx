import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSucess } from '../utils';

function EmployeeLogin() {
  const navigate = useNavigate();
  const [loginInfo, setLoginInfo] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = loginInfo;

    if (!username || !password) {
      setErrors({
        username: !username ? 'Username is required' : '',
        password: !password ? 'Password is required' : ''
      });
      return handleError('Username and password are required');
    }

    try {
      const url = "https://localhost:5050/employee/login/";
      console.log("Sending login request with data:", loginInfo); // Log the data being sent
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginInfo),
      });
      const result = await response.json();
      console.log("Received response:", result); // Log the response
      const { success, message, token, name, error } = result;

      if (success) {
        handleSucess(message);
        localStorage.setItem('token', token);
        localStorage.setItem('loggedInUser', name);
        navigate('/home');
      } else if (error) {
        const details = error?.details[0]?.message || error;
        handleError(details);
      } else if (!success) {
        if (message === "User does not exist" || message === "Invalid credentials") {
          setErrors((prevErrors) => ({
            ...prevErrors,
            username: message === "User does not exist" ? message : '',
            password: message === "Invalid credentials" ? message : ''
          }));
        } else {
          handleError(message);
        }
      }
    } catch (error) {
      handleError(error.message);
    }
  };

  return (
    <div>
      <div className='container'>
        <h1>Employee Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor='username'>Username</label>
            <input
              onChange={handleChange}
              type="text"
              name="username"
              autoFocus
              placeholder="Enter your username"
              value={loginInfo.username}
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password"
              value={loginInfo.password}
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>
          <button type="submit">Login</button>
          <div className="center-text">
            <span>Don't have an account? <a href="/register">Register</a></span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;