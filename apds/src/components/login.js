import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useNavigate ();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple validation (in real scenarios, validate against the backend)
    if (email === "admin@example.com" && password === "password") {
      history('/success');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
};

export default Login;
