import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Transaction from './pages/TransactionVerification';
import EmployeeLogin from './pages/EmployeeLogin';
import Logout from './pages/Logout';
import EmployeeHome from './pages/EmployeeHome';
import LoginPage from './pages/LoginPage'; 
import PaymentForm from './pages/PaymentForm';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated (e.g., check for a token in local storage)
    const token = localStorage.getItem('token');
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
            frame-ancestors 'self';
          `}
        />
      </Helmet>
      <Router>
        <Routes>
          <Route path="/login-page" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/settings" element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/logout" element={<Logout setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/transactions" element={ <Transaction />} />
          <Route path="/home" element={isAuthenticated ? <EmployeeHome /> : <Navigate to="/employee" />} />
          <Route path="/employee" element={<EmployeeLogin setIsAuthenticated={setIsAuthenticated}  />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/payment" element={isAuthenticated ? <PaymentForm /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;