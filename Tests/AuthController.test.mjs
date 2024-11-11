import { signup, login, preRegister, employeeLogin } from '../Backend/Controller/AuthController.mjs';
import { connectToDatabase } from '../Backend/db/conn.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('../db/conn.mjs');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
    let req, res, db, collection;

    beforeEach(() => {
        req = {
            body: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        db = {
            collection: jest.fn().mockReturnThis(),
            findOne: jest.fn(),
            insertOne: jest.fn()
        };
        connectToDatabase.mockResolvedValue(db);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('signup', () => {
        it('should return 400 if user already exists', async () => {
            req.body = {
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                accountNumber: '123456',
                idNumber: '654321'
            };
            db.findOne.mockResolvedValue({ email: 'john@example.com' });

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User already exists',
                success: false,
                errors: { email: 'Email already exists' }
            });
        });

        it('should return 201 if user is created successfully', async () => {
            req.body = {
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                accountNumber: '123456',
                idNumber: '654321'
            };
            db.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedpassword');
            db.insertOne.mockResolvedValue({ insertedId: 'newUserId' });

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Registration successful',
                success: true,
                userId: 'newUserId'
            });
        });

        it('should return 500 if there is an error', async () => {
            req.body = {
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                accountNumber: '123456',
                idNumber: '654321'
            };
            db.findOne.mockRejectedValue(new Error('Database error'));

            await signup(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal Server Error',
                success: false
            });
        });
    });

    describe('login', () => {
        it('should return 403 if user does not exist', async () => {
            req.body = {
                usernameOrAccountNumber: 'johndoe',
                password: 'password123'
            };
            db.findOne.mockResolvedValue(null);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User does not exist',
                success: false
            });
        });

        it('should return 403 if password is incorrect', async () => {
            req.body = {
                usernameOrAccountNumber: 'johndoe',
                password: 'password123'
            };
            db.findOne.mockResolvedValue({ username: 'johndoe', password: 'hashedpassword' });
            bcrypt.compare.mockResolvedValue(false);

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid credentials',
                success: false
            });
        });

        it('should return 200 if login is successful', async () => {
            req.body = {
                usernameOrAccountNumber: 'johndoe',
                password: 'password123'
            };
            db.findOne.mockResolvedValue({ _id: 'userId', username: 'johndoe', password: 'hashedpassword', firstname: 'John', lastname: 'Doe' });
            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('token');

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Login successful',
                success: true,
                token: 'token',
                id: 'userId',
                username: 'johndoe',
                name: 'John Doe'
            });
        });

        it('should return 500 if there is an error', async () => {
            req.body = {
                usernameOrAccountNumber: 'johndoe',
                password: 'password123'
            };
            db.findOne.mockRejectedValue(new Error('Database error'));

            await login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Internal Server Error',
                success: false
            });
        });
    });
});