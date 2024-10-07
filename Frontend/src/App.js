
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import React from 'react';
import { Helmet } from 'react-helmet'; // Import Helmet
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

function App() {
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