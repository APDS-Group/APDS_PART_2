import { checkEmail, checkPassword, checkString, loginValidation, signupValidation } from '../Backend/Middlewares/AuthValidation.js';


describe('Validation Functions', () => {
  describe('checkEmail', () => {
      test('returns null for a valid email', () => {
          expect(checkEmail('test@example.com')).toBeNull();
      });

      test('returns null for a valid .co.za email', () => {
          expect(checkEmail('test@example.co.za')).toBeNull();
      });

      test('returns an error message for an invalid email', () => {
          expect(checkEmail('invalid-email')).toBe(
              "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'."
          );
      });
  });

  describe('checkPassword', () => {
      test('returns null for a valid password', () => {
          expect(checkPassword('Valid1@pass')).toBeNull();
      });

      test('returns an error message for a password missing special character', () => {
          expect(checkPassword('Valid1pass')).toBe(
              "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number."
          );
      });

      test('returns an error message for a password with less than 8 characters', () => {
          expect(checkPassword('Shor1@')).toBe(
              "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number."
          );
      });
  });

  describe('checkString', () => {
      test('returns null for a valid string', () => {
          expect(checkString('valid input')).toBeNull();
      });

      test('returns "Missing Input" for an empty string', () => {
          expect(checkString('')).toBe('Missing Input');
      });

      test('returns "Missing Input" for a string with only spaces', () => {
          expect(checkString('   ')).toBe('Missing Input');
      });
  });
});

describe('Middleware Functions', () => {
  let req, res, next;

  beforeEach(() => {
      req = { body: {} };
      res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
      };
      next = jest.fn();
  });

  describe('signupValidation', () => {
      test('calls next() when validation passes', () => {
          req.body = {
              name: 'Test User',
              email: 'test@example.com',
              password: 'Valid1@pass',
          };

          signupValidation(req, res, next);
          expect(next).toHaveBeenCalled();
          expect(res.status).not.toHaveBeenCalled();
          expect(res.json).not.toHaveBeenCalled();
      });

      test('returns 400 if validation fails', () => {
          req.body = {
              name: '',
              email: 'invalid-email',
              password: 'short',
          };

          signupValidation(req, res, next);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
              message: "Bad request",
              errors: {
                  name: 'Missing Input',
                  email: "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.",
                  password: "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number."
              }
          });
          expect(next).not.toHaveBeenCalled();
      });
  });

  describe('loginValidation', () => {
      test('calls next() when validation passes', () => {
          req.body = {
              email: 'test@example.com',
              password: 'Valid1@pass',
          };

          loginValidation(req, res, next);
          expect(next).toHaveBeenCalled();
          expect(res.status).not.toHaveBeenCalled();
          expect(res.json).not.toHaveBeenCalled();
      });

      test('returns 400 if validation fails', () => {
          req.body = {
              email: 'invalid-email',
              password: '',
          };

          loginValidation(req, res, next);

          expect(res.status).toHaveBeenCalledWith(400);
          expect(res.json).toHaveBeenCalledWith({
              message: "Bad request",
              errors: {
                  email: "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.",
                  password: 'Missing Input'
              }
          });
          expect(next).not.toHaveBeenCalled();
      });
  });
});
