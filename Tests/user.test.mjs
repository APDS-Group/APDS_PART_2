import request from 'supertest';
import express from 'express';
import userRouter from '../Backend/routes/user.mjs';
import { signup, login } from '../Backend/Controller/AuthController.mjs';
import { signupValidation, loginValidation } from '../Backend/Middlewares/AuthValidation.mjs';
import ExpressBrute from 'express-brute';

const app = express();
app.use(express.json());
app.use('/user', userRouter);

jest.mock('../Backend/Controller/AuthController.mjs');
jest.mock('../Backend/Middlewares/AuthValidation.mjs');

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /user/signup', () => {
        it('should call signupValidation middleware and signup controller', async () => {
            signupValidation.mockImplementation((req, res, next) => next());
            signup.mockImplementation((req, res) => res.status(201).send('User signed up'));

            const response = await request(app)
                .post('/user/signup')
                .send({ username: 'testuser', password: 'testpassword' });

            expect(signupValidation).toHaveBeenCalled();
            expect(signup).toHaveBeenCalled();
            expect(response.status).toBe(201);
            expect(response.text).toBe('User signed up');
        });
    });

    describe('POST /user/login', () => {
        it('should call bruteforce middleware, loginValidation middleware, and login controller', async () => {
            const store = new ExpressBrute.MemoryStore();
            const bruteforce = new ExpressBrute(store);
            const bruteforcePrevent = jest.spyOn(bruteforce, 'prevent').mockImplementation((req, res, next) => next());

            loginValidation.mockImplementation((req, res, next) => next());
            login.mockImplementation((req, res) => res.status(200).send('User logged in'));

            const response = await request(app)
                .post('/user/login')
                .send({ username: 'testuser', password: 'testpassword' });

            expect(bruteforcePrevent).toHaveBeenCalled();
            expect(loginValidation).toHaveBeenCalled();
            expect(login).toHaveBeenCalled();
            expect(response.status).toBe(200);
            expect(response.text).toBe('User logged in');
        });
    });

    describe('GET /user', () => {
        it('should return a simple response indicating the user route', async () => {
            const response = await request(app).get('/user');

            expect(response.status).toBe(200);
            expect(response.text).toBe('User route');
        });
    });
});