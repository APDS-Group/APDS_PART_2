import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './NavBar';
import '../App.css'; // Import the CSS file

function TransactionVerification() {
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState({
    recipientName: '',
    recipientBank: '',
    accountNumber: '',
    amount: '',
    swiftCode: '',
    currency: '',
    recipientNameVerified: false,
    recipientBankVerified: false,
    accountNumberVerified: false,
    amountVerified: false,
    swiftCodeVerified: false,
    currencyVerified: false,
  });

  useEffect(() => {
    const paymentId = localStorage.getItem('paymentId'); // Retrieve payment ID from local storage
    if (paymentId) {
      fetchPaymentDetails(paymentId);
    } else {
      console.error('No payment ID found');
      navigate('/home'); // Redirect to home if no payment ID is found
    }
  }, [navigate]);

  const fetchPaymentDetails = async (paymentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch(`https://localhost:5050/employee/payment/${paymentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }

      const data = await response.json();
      const payment = data.payment;
      
      setTransaction({
        recipientName: payment.recipientName || payment.recipient_name,
        recipientBank: payment.bank,
        accountNumber: payment.accountNumber || payment.account_number,
        amount: payment.transferAmount || payment.transfer_amount,
        swiftCode: payment.swiftCode || payment.swift_code,
        currency: payment.currency,
        recipientNameVerified: false,
        recipientBankVerified: false,
        accountNumberVerified: false,
        amountVerified: false,
        swiftCodeVerified: false,
        currencyVerified: false,
      });

    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  const handleVerify = (field) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [field]: !prevTransaction[field],
    }));
  };

  const handleChange = (field, value) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('https://localhost:5050/employee/finalize-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ paymentId: localStorage.getItem('paymentId') })
      });

      if (!response.ok) {
        throw new Error('Failed to finalize verification');
      }

      const data = await response.json();
      console.log('Verification finalized:', data);
      navigate('/home'); // Redirect to home after successful submission
    } catch (error) {
      console.error('Error finalizing verification:', error);
    }
  };

  return (
    <div className="transaction-container">
      <Navbar />
      <div className="transaction-card">
        <h1>Transaction Verification</h1>
        <div className="transaction-verification-form">
          <div className="transaction-row">
            <label>Recipient's Name</label>
            <div className="input-group">
              <input
                type="text"
                value={transaction.recipientName}
                readOnly
                className="transaction-input"
              />
              <button
                className="verify-button"
                onClick={() => handleVerify('recipientNameVerified')}
              >
                {transaction.recipientNameVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
            <label>Recipient's Bank</label>
            <div className="input-group">
              <input
                type="text"
                value={transaction.recipientBank}
                readOnly
                className="transaction-input"
              />
              <button
                className="verify-button"
                onClick={() => handleVerify('recipientBankVerified')}
              >
                {transaction.recipientBankVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
            <label>Recipient's Account Number</label>
            <div className="input-group">
              <input
                type="text"
                value={transaction.accountNumber}
                readOnly
                className="transaction-input"
              />
              <button
                className="verify-button"
                onClick={() => handleVerify('accountNumberVerified')}
              >
                {transaction.accountNumberVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
            <label>The Amount You Want to Pay</label>
            <div className="input-group">
              <input
                type="text"
                value={transaction.amount}
                readOnly
                className="transaction-input"
              />
              <button
                className="verify-button"
                onClick={() => handleVerify('amountVerified')}
              >
                {transaction.amountVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
            <label>Bank SWIFT Code</label>
            <div className="input-group">
              <input
                type="text"
                value={transaction.swiftCode}
                readOnly
                className="transaction-input"
              />
              <button
                className="verify-button"
                onClick={() => handleVerify('swiftCodeVerified')}
              >
                {transaction.swiftCodeVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
            <label>Currency</label>
            <div className="input-group">
              <input
                type="text"
                value={transaction.currency}
                readOnly
                className="transaction-input"
              />
              <button
                className="verify-button"
                onClick={() => handleVerify('currencyVerified')}
              >
                {transaction.currencyVerified ? 'Unverify' : 'Verify'}
              </button>
            </div>
          </div>
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionVerification;