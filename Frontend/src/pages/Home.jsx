import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import '../App.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faExchangeAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons

function Home() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details from local storage
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUser(userDetails);

    // Fetch stats from an API or define them here
    setStats([
      { title: 'Current User', value: userDetails.name },
      { title: 'Current Balance', value: '$5,000' },
      { title: 'Bank Name', value: 'Bank of America' },
    ]);
  }, []);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="dashboard">
        <div className="sidebar">
          <ul>
            <li className="sidebar-item" onClick={() => handleButtonClick('/profile')}>
              <FontAwesomeIcon icon={faUser} size="sm"/> Profile
            </li>
            <li className="sidebar-item" onClick={() => handleButtonClick('/transactions')}>
              <FontAwesomeIcon icon={faExchangeAlt} size="sm"/> Transaction Verification
            </li>
            <li className="sidebar-item" onClick={() => handleButtonClick('/logout')}>
              <FontAwesomeIcon icon={faSignOutAlt} size="sm"/> Logout
            </li>
          </ul>
        </div>
        <div className="main-content">
          <h1>Welcome, {user.name}</h1>
          <p className="welcome-message">This is your dashboard where you can manage your settings and profile.</p>
          <div className="stats">
            {stats.map((stat, index) => (
              <div className="stat-box" key={index}>
                <h2>{stat.title}</h2>
                <p>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;