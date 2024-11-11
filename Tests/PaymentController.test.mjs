import { jest } from '@jest/globals';
import { processPayment, pendingPayments, finalizeVerification, getPaymentById } from '../Backend/Controller/PaymentController.mjs';
import { connectToDatabase } from '../Backend/db/conn.mjs';
import { checkSwiftCode } from '../Backend/Middlewares/Validation.mjs';

jest.mock('../db/conn.mjs');
jest.mock('../Models/Payment.mjs');
jest.mock('../Models/PaymentVerification.mjs');
jest.mock('../Middlewares/Validation.mjs');

describe('PaymentController', () => {
    let req, res, db;

    beforeEach(() => {
        db = {
            collection: jest.fn().mockReturnThis(),
            insertOne: jest.fn(),
            find: jest.fn().mockReturnThis(),
            toArray: jest.fn(),
            updateOne: jest.fn(),
            findOne: jest.fn()
        };
        connectToDatabase.mockResolvedValue(db);

        req = {
            body: {},
            user: { _id: 'userId' },
            params: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('processPayment', () => {
        it('should return 400 if any required field is missing', async () => {
            req.body = { recipientName: '', bank: '', accountNumber: '', transferAmount: '', swiftCode: '', currency: '' };

            await processPayment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'All fields are required'
            }));
        });

        it('should return 400 if SWIFT code is invalid', async () => {
            req.body = { recipientName: 'John Doe', bank: 'Bank', accountNumber: '123456', transferAmount: 100, swiftCode: 'invalid', currency: 'USD' };
            checkSwiftCode.mockReturnValue(false);

            await processPayment(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Invalid SWIFT code'
            }));
        });

        it('should process payment successfully', async () => {
            req.body = { recipientName: 'John Doe', bank: 'Bank', accountNumber: '123456', transferAmount: 100, swiftCode: 'valid', currency: 'USD' };
            checkSwiftCode.mockReturnValue(true);
            db.insertOne.mockResolvedValue({ insertedId: 'paymentId' });

            await processPayment(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Payment processed successfully'
            }));
        });
    });

    describe('pendingPayments', () => {
        it('should retrieve pending or partially verified payments', async () => {
            db.toArray.mockResolvedValue([{ _id: 'paymentId', status: 'Pending' }]);

            await pendingPayments(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Pending or Partially Verified payments retrieved successfully'
            }));
        });
    });

    describe('finalizeVerification', () => {
        it('should finalize payment verification successfully', async () => {
            req.body = { paymentId: 'paymentId', employeeId: 'employeeId', verifications: [], overall_status: 'Verified' };
            db.insertOne.mockResolvedValue({ insertedId: 'verificationId' });

            await finalizeVerification(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Payment verification finalized successfully'
            }));
        });
    });

    describe('getPaymentById', () => {
        it('should return 404 if payment not found', async () => {
            req.params.paymentId = 'paymentId';
            db.findOne.mockResolvedValue(null);

            await getPaymentById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: 'Payment not found'
            }));
        });

        it('should retrieve payment successfully', async () => {
            req.params.paymentId = 'paymentId';
            db.findOne.mockResolvedValue({ _id: 'paymentId', recipientName: 'John Doe' });

            await getPaymentById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: 'Payment retrieved successfully'
            }));
        });
    });
});