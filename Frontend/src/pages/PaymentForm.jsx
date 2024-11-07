import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { useNavigate } from 'react-router-dom';
import { checkSwiftCode, checkAccountNumber, checkTransferAmount } from '../utils/validation'; // Adjust the import path as necessary

function PaymentForm() {
    const navigate = useNavigate();
    const [paymentInfo, setPaymentInfo] = useState({
        recipientName: '',
        bank: '',
        accountNumber: '',
        transferAmount: '',
        swiftCode: '',
        currency: 'USD' // Default currency
    });
    const [errors, setErrors] = useState({
        recipientName: '',
        bank: '',
        accountNumber: '',
        transferAmount: '',
        swiftCode: '',
        currency: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newPaymentInfo = { ...paymentInfo };
        newPaymentInfo[name] = value;
        setPaymentInfo(newPaymentInfo);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        const { recipientName, bank, accountNumber, transferAmount, swiftCode, currency } = paymentInfo;

        // Validate that all fields are filled
        if (!recipientName || !bank || !accountNumber || !transferAmount || !swiftCode || !currency) {
            setErrors({
                recipientName: !recipientName ? 'Recipient name is required' : '',
                bank: !bank ? 'Bank is required' : '',
                accountNumber: !accountNumber ? 'Account number is required' : '',
                transferAmount: !transferAmount ? 'Transfer amount is required' : '',
                swiftCode: !swiftCode ? 'SWIFT code is required' : '',
                currency: !currency ? 'Currency is required' : ''
            });
            return handleError('All fields are required');
        }

        // Validate the account number
        const accountNumberError = checkAccountNumber(accountNumber);
        if (accountNumberError) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                accountNumber: accountNumberError
            }));
            return handleError(accountNumberError);
        }

        // Validate the transfer amount
        const transferAmountError = checkTransferAmount(transferAmount);
        if (transferAmountError) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                transferAmount: transferAmountError
            }));
            return handleError(transferAmountError);
        }

        // Validate the SWIFT code
        const swiftCodeError = checkSwiftCode(swiftCode);
        if (swiftCodeError) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                swiftCode: swiftCodeError
            }));
            return handleError(swiftCodeError);
        }

        try {
            const url = "https://localhost:5050/payment/process";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentInfo),
            });
            const result = await response.json();
            const { success, message, errors } = result;
            if (success) {
                handleSucess(message);
                navigate('/home');
            } else {
                if (errors) {
                    setErrors(errors);
                }
                handleError(message);
            }
        } catch (error) {
            handleError(error.message);
        }
    };

    const handleCancel = () => {
        navigate('/home');
    };

    return (
        <div className='container'>
            <h1>International Payment</h1>
            <form onSubmit={handlePayment}>
                <div>
                    <label htmlFor='recipientName'>Recipient Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="recipientName"
                        placeholder="Enter recipient name"
                        value={paymentInfo.recipientName}
                    />
                    {errors.recipientName && <div className="error">{errors.recipientName}</div>}
                </div>
                <div>
                    <label htmlFor='bank'>Bank</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="bank"
                        placeholder="Enter bank name"
                        value={paymentInfo.bank}
                    />
                    {errors.bank && <div className="error">{errors.bank}</div>}
                </div>
                <div>
                    <label htmlFor='accountNumber'>Account Number</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="accountNumber"
                        placeholder="Enter account number"
                        value={paymentInfo.accountNumber}
                    />
                    {errors.accountNumber && <div className="error">{errors.accountNumber}</div>}
                </div>
                <div>
                    <label htmlFor='transferAmount'>Transfer Amount</label>
                    <input
                        onChange={handleChange}
                        type="number"
                        name="transferAmount"
                        placeholder="Enter transfer amount"
                        value={paymentInfo.transferAmount}
                    />
                    {errors.transferAmount && <div className="error">{errors.transferAmount}</div>}
                </div>
                <div>
                    <label htmlFor='swiftCode'>SWIFT Code</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="swiftCode"
                        placeholder="Enter SWIFT code"
                        value={paymentInfo.swiftCode}
                    />
                    {errors.swiftCode && <div className="error">{errors.swiftCode}</div>}
                </div>
                <div>
                    <label htmlFor='currency'>Currency</label>
                    <select
                        onChange={handleChange}
                        name="currency"
                        value={paymentInfo.currency}
                    >
                        <option value="USD">USD</option>
                        <option value="ZAR">ZAR</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                        <option value="AUD">AUD</option>
                        <option value="CAD">CAD</option>
                        <option value="CHF">CHF</option>
                        <option value="CNY">CNY</option>
                        <option value="SEK">SEK</option>
                        <option value="NZD">NZD</option>
                    </select>
                    {errors.currency && <div className="error">{errors.currency}</div>}
                </div>
                <button type="submit">Pay Now</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
}

export default PaymentForm;