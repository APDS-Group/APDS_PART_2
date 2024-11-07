import mongoose from 'mongoose';

const schema = mongoose.Schema;

const employeeSchema = new schema({
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
    password: {
        type: String,
        required: true,
    },
    empNum: {
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

const Employee = mongoose.model('Employee', employeeSchema);
export {Employee};