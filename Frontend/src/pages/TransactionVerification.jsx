import React, { useState } from 'react';
import Navbar from './NavBar';
import '../App.css'; // Import the CSS file

function TransactionVerification() {
  const [transactions, setTransactions] = useState([
    { id: 1, recipientName: '', recipientBank: '', accountNumber: '', amount: '', swiftCode: '', verified: false },
  ]);

  const handleVerify = (id, field) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, [field]: true } : transaction
      )
    );
  };

  const handleChange = (id, field, value) => {
    setTransactions((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.id === id ? { ...transaction, [field]: value } : transaction
      )
    );
  };

  const handleSubmit = () => {
    // Handle submit logic here
    console.log('Transactions submitted:', transactions);
  };

  return (
    <div className="transaction-container">
      <Navbar />
      <div className="transaction-card">
        <h1>Transaction Verification</h1>
        <div className="transaction-verification-form">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-row">
              <label>Recipient's Name</label>
              <div className="input-group">
                <input
                  type="text"
                  value={transaction.recipientName}
                  onChange={(e) => handleChange(transaction.id, 'recipientName', e.target.value)}
                  className="transaction-input"
                />
                <button
                  className="verify-button"
                  onClick={() => handleVerify(transaction.id, 'recipientNameVerified')}
                  disabled={transaction.recipientNameVerified}
                >
                  {transaction.recipientNameVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              <label>Recipient's Bank</label>
              <div className="input-group">
                <input
                  type="text"
                  value={transaction.recipientBank}
                  onChange={(e) => handleChange(transaction.id, 'recipientBank', e.target.value)}
                  className="transaction-input"
                />
                <button
                  className="verify-button"
                  onClick={() => handleVerify(transaction.id, 'recipientBankVerified')}
                  disabled={transaction.recipientBankVerified}
                >
                  {transaction.recipientBankVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              <label>Recipient's Account Number</label>
              <div className="input-group">
                <input
                  type="text"
                  value={transaction.accountNumber}
                  onChange={(e) => handleChange(transaction.id, 'accountNumber', e.target.value)}
                  className="transaction-input"
                />
                <button
                  className="verify-button"
                  onClick={() => handleVerify(transaction.id, 'accountNumberVerified')}
                  disabled={transaction.accountNumberVerified}
                >
                  {transaction.accountNumberVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              <label>The Amount You Want to Pay</label>
              <div className="input-group">
                <input
                  type="text"
                  value={transaction.amount}
                  onChange={(e) => handleChange(transaction.id, 'amount', e.target.value)}
                  className="transaction-input"
                />
                <button
                  className="verify-button"
                  onClick={() => handleVerify(transaction.id, 'amountVerified')}
                  disabled={transaction.amountVerified}
                >
                  {transaction.amountVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
              <label>Bank SWIFT Code</label>
              <div className="input-group">
                <input
                  type="text"
                  value={transaction.swiftCode}
                  onChange={(e) => handleChange(transaction.id, 'swiftCode', e.target.value)}
                  className="transaction-input"
                />
                <button
                  className="verify-button"
                  onClick={() => handleVerify(transaction.id, 'swiftCodeVerified')}
                  disabled={transaction.swiftCodeVerified}
                >
                  {transaction.swiftCodeVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
            </div>
          ))}
          <button className="submit-button" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionVerification;