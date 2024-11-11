import { connectToDatabase } from '../db/conn.mjs';
import { Payment } from '../Models/Payment.mjs';
import { checkSwiftCode } from '../Middlewares/AuthValidation.mjs';
import validator from 'validator';

// Establish a connection to the database
const db = await connectToDatabase();

const processPayment = async (req, res) => {
    const { recipientName, bank, accountNumber, transferAmount, swiftCode, currency } = req.body;
    let collection = db.collection("payments");
    console.log('Received payment request:', req.body);

    // Validate that all fields are filled
    if (!recipientName || !bank || !accountNumber || !transferAmount || !swiftCode || !currency) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
            errors: {
                recipientName: !recipientName ? 'Recipient name is required' : '',
                bank: !bank ? 'Bank is required' : '',
                accountNumber: !accountNumber ? 'Account number is required' : '',
                transferAmount: !transferAmount ? 'Transfer amount is required' : '',
                swiftCode: !swiftCode ? 'SWIFT code is required' : '',
                currency: !currency ? 'Currency is required' : ''
            }
        });
    }

    // Sanitize inputs
    const sanitizedRecipientName = validator.escape(validator.trim(recipientName));
    const sanitizedBank = validator.escape(validator.trim(bank));
    const sanitizedAccountNumber = validator.escape(validator.trim(accountNumber));
    const sanitizedTransferAmount = validator.escape(validator.trim(transferAmount));
    const sanitizedSwiftCode = validator.escape(validator.trim(swiftCode));
    const sanitizedCurrency = validator.escape(validator.trim(currency));

    // Validate the SWIFT code
    const swiftCodeError = checkSwiftCode(sanitizedSwiftCode);
    if (swiftCodeError) {
        console.log('Validation failed: Invalid SWIFT code');
        return res.status(400).json({
            success: false,
            message: 'Invalid SWIFT code',
            errors: {
                swiftCode: swiftCodeError
            }
        });
    }

    // Create a new payment instance
    const payment = new Payment({
        recipientName: sanitizedRecipientName,
        bank: sanitizedBank,
        accountNumber: sanitizedAccountNumber,
        transferAmount: sanitizedTransferAmount,
        swiftCode: sanitizedSwiftCode,
        currency: sanitizedCurrency
    });

    try {
        // Save the payment to the database
        let result = await collection.insertOne(payment); // eslint-disable-line no-unused-vars
        console.log('Payment saved:', payment);

        // Encode the response data
        const encodedMessage = Buffer.from('Payment processed successfully').toString('base64');

        res.json({ success: true, message: encodedMessage });
    } catch (error) {
        console.error('Error saving payment:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
};

export { processPayment };