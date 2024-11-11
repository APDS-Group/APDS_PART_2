import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbars/NavBarEmployee';
import '../App.css'; // Import the CSS file
//eslint-disable-next-line
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // NOSONAR
//eslint-disable-next-line
import { faUser, faExchangeAlt, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // NOSONAR
import { Payment } from "./Payment";
import { PaymentHolder } from "./PaymentHolder";
import { v4 as uuidv4 } from "uuid";
import '../styles/EmployeeHome.css';

function EmployeeHome() {
    const [user, setUser] = useState({});
    //eslint-disable-next-line
    const [stats, setStats] = useState([]); // NOSONAR
    //eslint-disable-next-line
    const [pendingPayments, setPendingPayments] = useState([]); // NOSONAR
    const [paymentItem, setPayments] = useState([]); // NOSONAR
    const navigate = useNavigate();

    const addPayment = (payment) => {
        setPayments([
            ...paymentItem,
            { id: uuidv4(), task: payment, completed: false },
        ]);
    };

    const toggleComplete = (id) => {
        setPayments(
            paymentItem.map((payment) =>
                payment.id === id ? { ...payment, completed: !payment.completed } : payment
            )
        );
    };

    useEffect(() => {
        // Fetch user details from local storage
        const userDetails = JSON.parse(localStorage.getItem('userDetails'));
        setUser(userDetails);

        // Fetch stats from an API or define them here
        setStats([
            { title: 'Current Balance', value: '$5,000' },
            { title: 'Bank Name', value: 'Bank of America' },
        ]);

        // Fetch pending payments
        const fetchPendingPayments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('https://localhost:5050/employee/pending', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch pending payments');
                }

                const data = await response.json();
                setPendingPayments(data.pendingPayments);

                // Add fetched payments to paymentItem state
                const payments = data.pendingPayments.map(payment => ({
                    id: payment._id,
                    task: `Recipient: ${payment.recipient_name || payment.recipientName}, Bank: ${payment.bank}, Amount: ${payment.transfer_amount || payment.transferAmount} ${payment.currency}`,
                    completed: false
                }));
                setPayments(payments);
            } catch (error) {
                console.error('Error fetching pending payments:', error);
            }
        };

        fetchPendingPayments();
    }, [navigate]);

    const handleButtonClick = (path) => { // NOSONAR
      navigate(path, { state: { from: '/home' } });
    };
    return (
        <>
        <Navbar />
        <div className="home-container-h">        
            <div className="dashboard-h">
                <div className="main-content">
                    <h1>Welcome, {user.name}</h1>
                    <h2>Pending Payments</h2>
                    <div className="PaymentWrapper">
                        <PaymentHolder addPayment={addPayment} />
                        {/* Display Payments */}
                        {paymentItem.map((payment) => (
                            <Payment
                                key={payment.id}
                                task={payment}
                                toggleComplete={toggleComplete}
                            />
                        ))}
                    </div>                   
                </div>
            </div>
        </div>
        </>
    );
}

export default EmployeeHome;