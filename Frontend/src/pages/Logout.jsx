import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Import the CSS file

function Logout({ setIsAuthenticated }) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear the authentication token from local storage
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    // Redirect to the login page
    navigate('/login');
  };

  return (
    <div className="logout-container">
      <button className="primary-button" onClick={() => setShowModal(true)}>
        Logout
      </button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to logout?</h2>
            <button className="primary-button" onClick={handleLogout}>
              Yes
            </button>
            <button className="secondary-button" onClick={() => setShowModal(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Logout;