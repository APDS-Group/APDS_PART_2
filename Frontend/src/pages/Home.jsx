import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbars/NavBar';
import '../App.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faExchangeAlt, faSignOutAlt, faUserFriends } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons

function Home() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState([]);
  const [userData, setUserData] = useState(null);
  const [tokenStatus, setTokenStatus] = useState('Checking token...');
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

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setTokenStatus('No token found. Redirecting to login...');
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://localhost:5050/home', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.text();
        setUserData(data);
        setTokenStatus('User authenticated | Valid token.');
      } catch (error) {
        console.error(error);
        setTokenStatus('Invalid token. Redirecting to login...');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  if (!userData) {
    return (
      <div className="loading-container">
        <div>Loading...</div>
        <div>{tokenStatus}</div>
      </div>
    );
  }

  const handleButtonClick = (path) => {
    navigate(path, { state: { from: '/' } });
  };

  return (
    <>
      <Navbar />
      <div className="home-container">
        <div className="dashboard">
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
            <div className="button-container">
              <button className="primary-button" onClick={() => handleButtonClick('/payment')}>Make a Payment</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;