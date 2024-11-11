import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbars/NavBar.css'; 


function NavbarEmployee() {
  return (
    <nav className="navbar">
      <div className="navbar-links-container">
        <Link to="/home" className="nav-link">Home</Link>
        <Link to="/profile" className="nav-link">Profile</Link>
        <Link to="/logout" className="nav-link">Logout</Link>
      </div>
    </nav>
  );
}

export default NavbarEmployee;