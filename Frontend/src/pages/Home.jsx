import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbars/NavBar';
import '../App.css'; // Import the CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faExchangeAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Import Font Awesome icons

function Home() {
  const [user, setUser] = useState({});
  const [stats, setStats] = useState([]);

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

     // State to store user data
     const [userData, setUserData] = useState(null);
    
     // State to store the status of the token
     const [tokenStatus, setTokenStatus] = useState('Checking token...');
     
     // Hook to get the navigate function for programmatic navigation
     const navigate = useNavigate();
 
     // useEffect hook to run the fetchUserData function when the component mounts
     useEffect(() => {
         // Async function to fetch user data
         const fetchUserData = async () => {
             // Get the token from local storage
             const token = localStorage.getItem('token');
             
             // If no token is found, update the token status and navigate to the login page
             if (!token) {
                 setTokenStatus('No token found. Redirecting to login...');
                 navigate('/login');
                 return;
             }
 
             try {
                 // Make a GET request to fetch user data with the token in the headers
                 const response = await fetch('https://localhost:5050/home', {
                     method: 'GET',
                     headers: {
                         'Authorization': `Bearer ${token}`,
                         'Content-Type': 'application/json'
                     }
                 });
 
                 // If the response is not OK, throw an error
                 if (!response.ok) {
                     throw new Error('Failed to fetch user data');
                 }
 
                 // Parse the response data as text
                 const data = await response.text();
                 
                 // Update the userData state with the fetched data
                 setUserData(data);
                 
                 // Update the token status to indicate success
                 setTokenStatus('User authenicated | Valid token .');
             } catch (error) {
                 // Log the error to the console
                 console.error(error);
                 
                 // Update the token status and navigate to the login page if an error occurs
                 setTokenStatus('Invalid token. Redirecting to login...');
                 navigate('/login');
             }
         };
 
         // Call the fetchUserData function
         fetchUserData();
     }, [navigate]); // Dependency array to run the effect only when navigate changes
 
     // If userData is not yet fetched, display a loading message and the token status
     if (!userData) {
         return (
             <div>
                 <div>Loading...</div>
                 <div>{tokenStatus}</div>
             </div>
         );
     }

  return (
<>    <Navbar />
    <div className="home-container">

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
          <button className="primary-button" onClick={() => handleButtonClick('/payment')}>Make a Payment</button> 
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;