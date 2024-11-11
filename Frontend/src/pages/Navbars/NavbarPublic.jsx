import React from 'react';
import { Link } from 'react-router-dom';
import '../Navbars/NavBar.css'; 


function NavbarPublic() {
  return (
    <nav className="navbar">
      <div className="navbar-links-container">
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/employee" className="nav-link">Employee Login</Link>
      </div>
    </nav>
  );
}

export default NavbarPublic;