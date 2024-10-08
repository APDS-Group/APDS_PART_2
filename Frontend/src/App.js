
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import React from 'react';
import { Helmet } from 'react-helmet'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      {/* Helmet is used to manage the document head, including meta tags  (Zanini, 2024)(Foundeo, 2012) */}
      <Helmet>
        {/* Content Security Policy (CSP) to add security by defining where resources can be loaded from */}
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
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;