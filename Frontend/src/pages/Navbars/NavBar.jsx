import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbars/NavBar.css'; 

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-links-container">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
      </div>
    </nav>
  );
}

export default NavBar;