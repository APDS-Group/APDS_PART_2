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
// Username validation function
const checkUsername = (username) => {
    const usernamePattern = /^[a-zA-Z0-9_.-]{3,}$/;
    if (!usernamePattern.test(username)) {
        return "Please enter a valid username with at least 3 characters.";
    }
    return null;
};

// ID number validation function
const checkIdNumber = (idNumber) => {
    const idNumberPattern = /^[0-9]{13}$/;
    if (!idNumberPattern.test(idNumber)) {
        return "Please enter a valid ID number with exactly 13 digits.";
    }
    return null;
};

// Account number validation function
const checkAccountNumber = (accountNumber) => {
    const accountNumberPattern = /^[0-9]{10}$/;
    if (!accountNumberPattern.test(accountNumber)) {
        return "Please enter a valid account number with exactly 10 digits.";
    }
    return null;
};
// Signup validation middleware
/*const signupValidation = (req, res, next) => {
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
*/
const signupValidation = (req, res, next) => {
    // Extract firstname, lastname, username, email, password, accountNumber, and idNumber from the request body
    const { firstname, lastname, username, email, password, accountNumber, idNumber } = req.body;

    // Validate the firstname, lastname, username, email, password, accountNumber, and idNumber
    const firstnameError = checkString(firstname);
    const lastnameError = checkString(lastname);
    const usernameError = checkUsername(username);
    const emailError = checkEmail(email);
    const passwordError = checkPassword(password);
    const accountNumberError = checkAccountNumber(accountNumber);
    const idNumberError = checkIdNumber(idNumber);

    // If any validation errors exist, return a 400 status with the errors
    if (firstnameError || lastnameError || usernameError || emailError || passwordError || accountNumberError || idNumberError) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                firstname: firstnameError,
                lastname: lastnameError,
                username: usernameError,
                email: emailError,
                password: passwordError,
                accountNumber: accountNumberError,
                idNumber: idNumberError
            }
        });
    }

    // If no validation errors, proceed to the next middleware
    next();
};


// Login validation middleware

const loginValidation = (req, res, next) => {
    const { usernameOrAccountNumber, password } = req.body;

    const usernameError = checkUsername(usernameOrAccountNumber);
    const accountNumberError = checkAccountNumber(usernameOrAccountNumber);
    const passwordError = checkPassword(password);

    if ((usernameError && accountNumberError) || passwordError) {
        return res.status(400).json({
            message: "Bad request",
            errors: {
                usernameOrAccountNumber: usernameError && accountNumberError ? "Please enter a valid username or account number." : null,
                password: passwordError
            }
        });
    }

    next();
};
/*const loginValidation = (req, res, next) => {
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
*/

// Export the signupValidation and loginValidation middleware functions
export { signupValidation, loginValidation };
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____/