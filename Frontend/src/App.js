import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import Transaction from './pages/TransactionVerification'; // Import the Transaction page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (e.g., check for a token in local storage)
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
    const savedSettings = JSON.parse(localStorage.getItem('settings'));
    if (savedSettings) {
      document.body.className = savedSettings.theme;
    } else {
      // Apply default theme (light) on startup
      document.body.className = 'light';
    }
  }, []);

  return (
    <div className="App">
      <Helmet>
        <meta
          httpEquiv="Content-Security-Policy"
          content={`
            default-src 'self';
            connect-src 'self' https://localhost:5050;
            script-src 'self';
            img-src https://*.my-s3-endpoint.com;
            media-src https://*.my-s3-endpoint.com;
          `}
        ></meta>
      </Helmet>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/transactions" element={isAuthenticated ? <Transaction /> : <Navigate to="/login" />} /> {/* Add the Transaction route */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;