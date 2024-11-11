import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbars/NavBar';
import '../styles/Transaction.css';

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
      [field]: !prevTransaction[field], // Toggle the value
    }));
  };

  const handleChange = (field, value) => {
    setTransaction((prevTransaction) => ({
      ...prevTransaction,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const userDetails = JSON.parse(localStorage.getItem('userDetails')); // Retrieve user details from local storage
    const employeeId = userDetails ? userDetails.id : 'employee-id-placeholder'; // Use the actual employee ID

    if (!token) {
      console.error('No token found');
      return;
    }

    const verifications = {
      recipient_name: { verified: transaction.recipientNameVerified },
      bank: { verified: transaction.recipientBankVerified },
      account_number: { verified: transaction.accountNumberVerified },
      transfer_amount: { verified: transaction.amountVerified },
      swift_code: { verified: transaction.swiftCodeVerified },
      currency: { verified: transaction.currencyVerified },
    };

    const overall_status = Object.values(verifications).every(v => v.verified) ? 'Verified' : 'Partially Verified';

    try {
      const response = await fetch('https://localhost:5050/employee/finalize-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          paymentId: localStorage.getItem('paymentId'),
          employeeId,
          verifications,
          overall_status
        })
      });

      if (!response.ok) {
        throw new Error('Failed to finalize verification');
      }

      const data = await response.json();
      console.log('Verification finalized:', data);
      navigate('/home'); 
    } catch (error) {
      console.error('Error finalizing verification:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page"> 
      <div className="container">      
        <h1>Transaction Verification</h1>      
        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-form">
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
                  className={`verify-button ${transaction.recipientNameVerified ? 'verified-button' : ''}`}
                  onClick={() => handleVerify('recipientNameVerified')}
                  type="button"
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
                  className={`verify-button ${transaction.recipientBankVerified ? 'verified-button' : ''}`}
                  onClick={() => handleVerify('recipientBankVerified')}
                  type="button"
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
                  className={`verify-button ${transaction.accountNumberVerified ? 'verified-button' : ''}`}
                  onClick={() => handleVerify('accountNumberVerified')}
                  type="button"
                >
                  {transaction.accountNumberVerified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            </div>
            <div className="transaction-row">
              <label>The Amount You Want to Pay</label>
              <div className="input-group">
                <input
                  type="text"
                  value={transaction.amount}
                  readOnly
                  className="transaction-input"
                />
                <button
                  className={`verify-button ${transaction.amountVerified ? 'verified-button' : ''}`}
                  onClick={() => handleVerify('amountVerified')}
                  type="button"
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
                  className={`verify-button ${transaction.swiftCodeVerified ? 'verified-button' : ''}`}
                  onClick={() => handleVerify('swiftCodeVerified')}
                  type="button"
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
                  className={`verify-button ${transaction.currencyVerified ? 'verified-button' : ''}`}
                  onClick={() => handleVerify('currencyVerified')}
                  type="button"
                >
                  {transaction.currencyVerified ? 'Unverify' : 'Verify'}
                </button>
              </div>
            </div>       
          </div>
          <button className="submit-button" type="submit">
            Submit
          </button>
        </form>
      </div>
      </div>
    </>
  );
}

export default TransactionVerification;