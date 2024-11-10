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

const verificationValidation = (req, res, next) => {
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
            success: false,
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

// SWIFT code validation function
const checkSwiftCode = (swiftCode) => {
    // Regular expression pattern to validate SWIFT codes
    const swiftCodePattern = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/i;
    
    // Test the SWIFT code against the pattern
    if (!swiftCodePattern.test(swiftCode)) {
        // Return an error message if the SWIFT code is invalid
        return "Please enter a valid SWIFT code.";
    }
    
    // Return null if the SWIFT code is valid
    return true;
};

// Export the signupValidation and loginValidation middleware functions
export {verificationValidation , checkSwiftCode};
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____/