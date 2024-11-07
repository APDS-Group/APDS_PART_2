
// Email validation function
const checkEmail = (email) => {
    // Regular expression pattern to validate email addresses (Stribizew, 2018)(Ryan, 2024)
    const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.(com|co\.za)$/;
    
    // Test the email against the pattern
    if (!emailPattern.test(email)) {
        // Return an error message if the email is invalid
        return "Please enter a valid email in the format 'example@example.com' or 'example@example.co.za'.";
    }    
    // Return null if the email is valid
    return null;
};

// Password validation function
const checkPassword = (password) => {
    // Regular expression pattern to validate passwords (Stribizew, 2018)(Ryan, 2024)
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    // Test the password against the pattern
    if (!passwordPattern.test(password)) {
        // Return an error message if the password is invalid
        return "Please enter a valid password with at least 8 characters, one special character, one lowercase letter, one uppercase letter, and one number.";
    }
    
    // Return null if the password is valid
    return null;
};

// General string validation function
const checkString = (input) => {
    // Check if the input is empty or consists only of whitespace
    if (!input || input.trim() === "") {
        // Return an error message if the input is missing
        return "Missing Input";
    }
    
    // Return null if the input is valid
    return null;
};

// Signup validation middleware
const signupValidation = (req, res, next) => {
    // Extract name, email, and password from the request body
    const { name, email, password } = req.body;

    // Validate the name, email, and password
    const nameError = checkString(name);
    const emailError = checkEmail(email);
    const passwordError = checkPassword(password);

    // If any validation errors exist, return a 400 status with the errors
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

    // Call the next middleware function in the stack
    next();
};

// Login validation middleware
const loginValidation = (req, res, next) => {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Validate the email and password
    const emailError = checkEmail(email);
    const passwordError = checkString(password);

    // If any validation errors exist, return a 400 status with the errors
    if (emailError || passwordError) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                email: emailError,
                password: passwordError
            }
        });
    }

    // Call the next middleware function in the stack
    next();
};

// Export the signupValidation and loginValidation middleware functions
export { signupValidation, loginValidation, checkEmail, checkPassword, checkString };
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____
