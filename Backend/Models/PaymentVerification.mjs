import mongoose from 'mongoose';

const schema = mongoose.Schema;

const verificationSchema = new schema({
    verified: {
        type: Boolean,
        default: false,
    },
    verified_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null,
    },
    verified_at: {
        type: Date,
        default: null,
    }
});

const paymentVerificationSchema = new schema({
    payment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true,
    },
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    verifications: {
        type: Map,
        of: verificationSchema,
        default: {},
    },
    overall_status: {
        type: String,
        enum: ['In Progress', 'Partially Verified','Rejected', 'Verified'],
        default: 'In Progress',
    },
    started_at: {
        type: Date,
        default: Date.now,
    },
    verified_at: {
        type: Date,
        default: null,
    },
    submitted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: null,
    }
});

const PaymentVerification = mongoose.model('PaymentVerification', paymentVerificationSchema);

export { PaymentVerification };