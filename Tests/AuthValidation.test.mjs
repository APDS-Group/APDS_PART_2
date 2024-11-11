import { checkEmail, checkPassword, checkString, checkUsername, checkIdNumber, checkAccountNumber, signupValidation, loginValidation, preRegisterValidation, employeeValidation } from '../Backend/Middlewares/AuthValidation.mjs';
import { jest } from '@jest/globals';

describe('AuthValidation Middleware', () => {
    describe('checkEmail', () => {
        it('should return null for valid email', () => {
            expect(checkEmail('test@example.com')).toBeNull();
            expect(checkEmail('test@example.co.za')).toBeNull();
        });

        it('should return error message for invalid email', () => {
            expect(checkEmail('invalid-email')).toBe("Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.");
        });
    });

    describe('checkPassword', () => {
        it('should return null for valid password', () => {
            expect(checkPassword('Valid1@password')).toBeNull();
        });

        it('should return error message for invalid password', () => {
            expect(checkPassword('invalid')).toBe("Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.");
        });
    });

    describe('checkString', () => {
        it('should return null for valid string', () => {
            expect(checkString('valid string')).toBeNull();
        });

        it('should return error message for empty string', () => {
            expect(checkString('')).toBe("Missing Input");
        });
    });

    describe('checkUsername', () => {
        it('should return null for valid username', () => {
            expect(checkUsername('valid_username')).toBeNull();
        });

        it('should return error message for invalid username', () => {
            expect(checkUsername('ab')).toBe("Please enter a valid username with at least 3 characters.");
        });
    });

    describe('checkIdNumber', () => {
        it('should return null for valid ID number', () => {
            expect(checkIdNumber('1234567890123')).toBeNull();
        });

        it('should return error message for invalid ID number', () => {
            expect(checkIdNumber('123')).toBe("Please enter a valid ID number with exactly 13 digits.");
        });
    });

    describe('checkAccountNumber', () => {
        it('should return null for valid account number', () => {
            expect(checkAccountNumber('1234567890')).toBeNull();
        });

        it('should return error message for invalid account number', () => {
            expect(checkAccountNumber('123')).toBe("Please enter a valid account number with exactly 10 digits.");
        });
    });

    describe('signupValidation', () => {
        it('should call next if all inputs are valid', () => {
            const req = {
                body: {
                    firstname: 'John',
                    lastname: 'Doe',
                    username: 'johndoe',
                    email: 'john@example.com',
                    password: 'Valid1@password',
                    accountNumber: '1234567890',
                    idNumber: '1234567890123'
                }
            };
            const res = {};
            const next = jest.fn();

            signupValidation(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 if any input is invalid', () => {
            const req = {
                body: {
                    firstname: '',
                    lastname: 'Doe',
                    username: 'jd',
                    email: 'john@example',
                    password: 'invalid',
                    accountNumber: '123',
                    idNumber: '123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            signupValidation(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Bad request",
                errors: {
                    firstname: "Missing Input",
                    lastname: null,
                    username: "Please enter a valid username with at least 3 characters.",
                    email: "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.",
                    password: "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.",
                    accountNumber: "Please enter a valid account number with exactly 10 digits.",
                    idNumber: "Please enter a valid ID number with exactly 13 digits."
                }
            });
        });
    });

    describe('loginValidation', () => {
        it('should call next if all inputs are valid', () => {
            const req = {
                body: {
                    usernameOrAccountNumber: 'johndoe',
                    password: 'Valid1@password'
                }
            };
            const res = {};
            const next = jest.fn();

            loginValidation(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 if any input is invalid', () => {
            const req = {
                body: {
                    usernameOrAccountNumber: '',
                    password: ''
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            loginValidation(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request",
                errors: {
                    usernameOrAccountNumber: "Please enter a valid username or account number.",
                    password: "Missing Input"
                }
            });
        });
    });

    describe('preRegisterValidation', () => {
        it('should call next if all inputs are valid', () => {
            const req = {
                body: {
                    firstname: 'John',
                    lastname: 'Doe',
                    username: 'johndoe',
                    password: 'Valid1@password',
                    empNum: '1234567890',
                    idNumber: '1234567890123'
                }
            };
            const res = {};
            const next = jest.fn();

            preRegisterValidation(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 if any input is invalid', () => {
            const req = {
                body: {
                    firstname: '',
                    lastname: 'Doe',
                    username: 'jd',
                    password: 'invalid',
                    empNum: '123',
                    idNumber: '123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            preRegisterValidation(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request",
                errors: {
                    firstname: "Missing Input",
                    lastname: null,
                    username: "Please enter a valid username with at least 3 characters.",
                    password: "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.",
                    empNum: "Please enter a valid account number with exactly 10 digits.",
                    idNumber: "Please enter a valid ID number with exactly 13 digits."
                }
            });
        });
    });

    describe('employeeValidation', () => {
        it('should call next if all inputs are valid', () => {
            const req = {
                body: {
                    username: 'johndoe',
                    password: 'Valid1@password'
                }
            };
            const res = {};
            const next = jest.fn();

            employeeValidation(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should return 400 if any input is invalid', () => {
            const req = {
                body: {
                    username: 'jd',
                    password: 'invalid'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            const next = jest.fn();

            employeeValidation(req, res, next);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: "Bad request",
                errors: {
                    username: "Please enter a valid username",
                    password: "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number."
                }
            });
        });
    });
});