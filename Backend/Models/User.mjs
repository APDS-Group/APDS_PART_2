import mongoose from 'mongoose';

const schema = mongoose.Schema;

const userSchema = new schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    accountNumber: {
        type: String,
        required: true,
        unique: true,
    },
    idNumber: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
export {User};