import React, { useEffect, useState } from 'react';
import Navbar from './NavBar';
import '../App.css'; // Import the CSS file

function Profile() {
  const [user, setUser] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [paymentReceipts, setPaymentReceipts] = useState([]);

  useEffect(() => {
    // Fetch user details from local storage
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUser(userDetails);

    // Fetch bank details and payment receipts from an API or define them here
    setBankDetails({
      currentAccount: '123456789',
      accountNumber: '987654321',
      availableBalance: '$5,000',
    });

    setPaymentReceipts([
      { date: '2023-10-01', beneficiaryName: 'John Doe', amount: '$50' },
      { date: '2023-10-02', beneficiaryName: 'Jane Doe', amount: '$100' },
    ]);
  }, []);

  const handlePayAgain = (receipt) => {
    // Handle pay again logic here
    console.log('Pay again:', receipt);
  };

  return (
    <div className="profile-container">
      <Navbar />
      <div className="profile-card">
        <h1>Profile</h1>
        <div className="profile-details">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {user.joined}</p>
        </div>
        <div className="bank-details">
          <h2>Banking Details</h2>
          <p><strong>Current Account:</strong> {bankDetails.currentAccount}</p>
          <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
          <p><strong>Available Balance:</strong> {bankDetails.availableBalance}</p>
        </div>
        <div className="payment-receipts">
          <h2>Payment Receipts</h2>
          {paymentReceipts.map((receipt, index) => (
            <div key={index} className="receipt">
              <p><strong>Date:</strong> {receipt.date}</p>
              <p><strong>Beneficiary Name:</strong> {receipt.beneficiaryName}</p>
              <p><strong>Amount:</strong> {receipt.amount}</p>
              <button className="primary-button" onClick={() => handlePayAgain(receipt)}>Pay Again</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;