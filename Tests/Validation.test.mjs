import { checkEmail, checkPassword, checkString, checkUsername, checkIdNumber, checkAccountNumber, verificationValidation, checkSwiftCode } from '../Backend/Middlewares/Validation.mjs';
import { jest } from '@jest/globals';

describe('Validation Middleware Tests', () => {
    test('checkEmail should validate email addresses correctly', () => {
        expect(checkEmail('test@example.com')).toBeNull();
        expect(checkEmail('test@example.co.za')).toBeNull();
        expect(checkEmail('invalid-email')).toBe("Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.");
    });

    test('checkPassword should validate passwords correctly', () => {
        expect(checkPassword('Password1!')).toBeNull();
        expect(checkPassword('password')).toBe("Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.");
    });

    test('checkString should validate strings correctly', () => {
        expect(checkString('valid string')).toBeNull();
        expect(checkString('')).toBe("Missing Input");
        expect(checkString('   ')).toBe("Missing Input");
    });

    test('checkUsername should validate usernames correctly', () => {
        expect(checkUsername('validUser')).toBeNull();
        expect(checkUsername('us')).toBe("Please enter a valid username with at least 3 characters.");
    });

    test('checkIdNumber should validate ID numbers correctly', () => {
        expect(checkIdNumber('1234567890123')).toBeNull();
        expect(checkIdNumber('123')).toBe("Please enter a valid ID number with exactly 13 digits.");
    });

    test('checkAccountNumber should validate account numbers correctly', () => {
        expect(checkAccountNumber('1234567890')).toBeNull();
        expect(checkAccountNumber('123')).toBe("Please enter a valid account number with exactly 10 digits.");
    });

    test('checkSwiftCode should validate SWIFT codes correctly', () => {
        expect(checkSwiftCode('DEUTDEFF')).toBe(true);
        expect(checkSwiftCode('INVALID')).toBe("Please enter a valid SWIFT code.");
    });

    test('verificationValidation middleware should validate request body correctly', () => {
        const req = {
            body: {
                firstname: 'John',
                lastname: 'Doe',
                username: 'johndoe',
                email: 'john.doe@example.com',
                password: 'Password1!',
                accountNumber: '1234567890',
                idNumber: '1234567890123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        verificationValidation(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
        expect(res.json).not.toHaveBeenCalled();
    });

    test('verificationValidation middleware should return errors for invalid request body', () => {
        const req = {
            body: {
                firstname: '',
                lastname: '',
                username: 'us',
                email: 'invalid-email',
                password: 'password',
                accountNumber: '123',
                idNumber: '123'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const next = jest.fn();

        verificationValidation(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Bad request",
            errors: {
                firstname: "Missing Input",
                lastname: "Missing Input",
                username: "Please enter a valid username with at least 3 characters.",
                email: "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.",
                password: "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.",
                accountNumber: "Please enter a valid account number with exactly 10 digits.",
                idNumber: "Please enter a valid ID number with exactly 13 digits."
            }
        });
        expect(next).not.toHaveBeenCalled();
    });
});