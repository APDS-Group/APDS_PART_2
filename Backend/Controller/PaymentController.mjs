import { connectToDatabase } from '../db/conn.mjs';
import mongoose from 'mongoose';
import { Payment } from '../Models/Payment.mjs';
import { PaymentVerification } from '../Models/PaymentVerification.mjs';
import { checkSwiftCode } from '../Middlewares/Validation.mjs';

// Establish a connection to the database
const db = await connectToDatabase();

const processPayment = async (req, res) => {
    const { recipientName, bank, accountNumber, transferAmount, swiftCode, currency } = req.body;
    const customerId = req.user._id;
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
    // Validate the SWIFT code
    const isValidSwiftCode = checkSwiftCode(swiftCode);
    if (!isValidSwiftCode) {
        console.log('Validation failed: Invalid SWIFT code');
        return res.status(400).json({
            success: false,
            message: 'Invalid SWIFT code'
        });
    }

    try {
        // Create a new Payment object
        const payment = new Payment({
            recipientName,
            bank,
            accountNumber,
            transferAmount,
            swiftCode,
            currency,
            customerId,
            status: 'Pending',
            createdAt: new Date()
        });

        // Save the payment to the database
        await collection.insertOne(payment);
        console.log('Payment processed successfully:', payment);

        return res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            payment
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
// Define the controller function to get all pending payments
const pendingPayments = async (req, res) => {
    try {
        const collection = db.collection("payments");
        const pendingPayments = await collection.find({ status: 'Pending' }).toArray();
        return res.status(200).json({
            success: true,
            message: 'Pending payments retrieved successfully',
            pendingPayments
        });
    } catch (error) {
        console.error('Error retrieving pending payments:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const finalizeVerification = async (req, res) => {
    const { paymentId, employeeId, verifications, overall_status } = req.body;

    try {
        console.log('Starting payment verification finalization:', { paymentId, employeeId, verifications, overall_status });

        const db = await connectToDatabase();
        let collection = db.collection("paymentVerification");

        // Create a new PaymentVerification object
        const paymentVerification = new PaymentVerification({
            payment_id: paymentId,
            employee_id: employeeId,
            verifications,
            overall_status,
            verified_at: new Date(),
            submitted_by: employeeId
        });

        console.log("Inserting new payment verfication into the database");
        let result = await collection.insertOne(paymentVerification)

        // Update the payment status if overall_status is 'Verified'
        if (overall_status === 'Verified') {
            await db.collection("payments").updateOne(
                { _id: new mongoose.Types.ObjectId(paymentId) },
                { $set: { status: 'Verified' } }
            );
            console.log('Payment status updated to Verified');
        }

        return res.status(200).json({
            success: true,
            message: 'Payment verification finalized successfully',
            paymentVerification,
            Id: result.insertedId // Add a comma before this line
        });
    } catch (error) {
        console.error('Error finalizing payment verification:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

const getPaymentById = async (req, res) => {
    const { paymentId } = req.params;
    try {
        const payment = await db.collection("payments").findOne({ _id: new mongoose.Types.ObjectId(paymentId) });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Payment retrieved successfully',
            payment
        });
    } catch (error) {
        console.error('Error retrieving payment:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export { processPayment, pendingPayments, finalizeVerification, getPaymentById };