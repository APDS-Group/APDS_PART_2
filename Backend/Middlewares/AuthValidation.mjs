const { model } = require('mongoose');

// Email validation function
const checkEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.(com|co\.za)$/;
    if (!emailPattern.test(email)) {
        return "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.";
    }
    return null;
};

// Password validation function
const checkPassword = (password) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordPattern.test(password)) {
        return "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.";
    }
    return null;
};

// General string validation function
const checkString = (input) => {
    if (!input || input.trim() === "") {
        return "Missing Input";
    }
    return null;
};

// Signup validation middleware
const signupValidation = (req, res, next) => {
    const { name, email, password } = req.body;

    const nameError = checkString(name);
    const emailError = checkEmail(email);
    const passwordError = checkPassword(password);

    if (nameError || emailError || passwordError) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                name: nameError,
                email: emailError,
                password: passwordError
            }
        });
    }

    next();
};

// Login validation middleware
const loginValidation = (req, res, next) => {
    const { email, password } = req.body;

    const emailError = checkEmail(email);
    const passwordError = checkString(password);

    if (emailError || passwordError) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                email: emailError,
                password: passwordError
            }
        });
    }

    next();
};

// Export the functions
module.exports = {
    checkEmail,
    checkPassword,
    checkString,
    signupValidation,
    loginValidation
};
