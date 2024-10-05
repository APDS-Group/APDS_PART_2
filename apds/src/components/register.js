import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';

const Register = () => {
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [confirmpassword, setConfirmPassword] = useState('');
  const history = useNavigate ();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic
    if (password === confirmpassword) {
        console.log('User registered with:', { email, password });
        history('/');
    } else {
        alert("Please make sure passwords match")
    }

  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input type="password" value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
};

export default Register;
