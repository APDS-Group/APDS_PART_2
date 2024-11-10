import mongoose from 'mongoose';

const schema = mongoose.Schema;

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
    verified_fields: {
        type: Map,
        of: Boolean,
        default: {},
    },
    status: {
        type: String,
        enum: ['In Progress', 'Verified'],
        default: 'In Progress',
    },
    started_at: {
        type: Date,
        default: Date.now,
    },
    completed_at: {
        type: Date,
    }
});

const PaymentVerification = mongoose.model('PaymentVerification', paymentVerificationSchema);

export { PaymentVerification };