import express from 'express';
import { checkSwiftCode } from '../Middlewares/AuthValidation.mjs';

const router = express.Router();

router.post('/process', (req, res) => {
    const { recipientName, bank, accountNumber, transferAmount, swiftCode, currency } = req.body;

    // Validate that all fields are filled
    if (!recipientName || !bank || !accountNumber || !transferAmount || !swiftCode || !currency) {
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

    // Validate the SWIFT code
    const swiftCodeError = checkSwiftCode(swiftCode);
    if (swiftCodeError) {
        return res.status(400).json({
            success: false,
            message: 'Invalid SWIFT code',
            errors: {
                swiftCode: swiftCodeError
            }
        });
    }

    // Perform additional validation and processing logic here
    // For demonstration purposes, we'll assume the payment is successful
    res.json({ success: true, message: 'Payment processed successfully' });
});

export default router;