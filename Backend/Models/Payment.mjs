import mongoose from 'mongoose';

const schema = mongoose.Schema;

const paymentSchema = new schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId, // Stores a reference to the Customer
        required: true,
        ref: 'Customer' 
    },
    recipientName: {
        type: String,
        required: true,
    },
    bank: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
    },
    transferAmount: {
        type: Number,
        required: true,
    },
    swiftCode: {
        type: String,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'], 
        default: 'Pending'
    }
});

const Payment = mongoose.model('Payment', paymentSchema);
export { Payment };
