import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [userData, setUserData] = useState(null);
    const [tokenStatus, setTokenStatus] = useState('Checking token...');
    const navigate = useNavigate();

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
            <div>
                <div>Loading...</div>
                <div>{tokenStatus}</div>
            </div>
        );
    }

    const handlePaymentClick = () => {
        navigate('/payment');
    };

    return (
        <div className='container home-container'>
            <h1>Home</h1>
            <p className='welcome-message'>Welcome back to your payment portal</p>
            <div>{tokenStatus}</div>
            <div className='button-container'>
                <button onClick={handlePaymentClick}>Make Payment</button>
            </div>
        </div>
    );
}

export default Home;