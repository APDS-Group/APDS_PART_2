import mongoose from 'mongoose';

const schema = mongoose.Schema;

const paymentSchema = new schema({
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
    }
});

const Payment = mongoose.model('Payment', paymentSchema,);
export { Payment };