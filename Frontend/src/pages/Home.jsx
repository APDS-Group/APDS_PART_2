//  (Shaikh, 2024) Import React and hooks for managing state and side effects
import React, { useEffect, useState } from 'react';

// Import useNavigate hook from react-router-dom for navigation
import { useNavigate } from 'react-router-dom';

function Home() {
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
                setTokenStatus('Token passed successfully.');
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

    // Render the Home component with the fetched user data and token status
    return (
        <div>
            <h1>Home</h1>
            <p>{userData}</p>
            <div>{tokenStatus}</div>
        </div>
    );
}

// Export the Home component as the default export
export default Home;