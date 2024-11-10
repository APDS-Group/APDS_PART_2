// SWIFT code validation function
export const checkSwiftCode = (swiftCode) => {
    // Regular expression pattern to validate SWIFT codes
    const swiftCodePattern = /^([a-zA-Z]){4}([a-zA-Z]){2}([0-9a-zA-Z]){2}([0-9a-zA-Z]{3})?$/;
    
    // Test the SWIFT code against the pattern
    if (!swiftCodePattern.test(swiftCode)) {
        // Return an error message if the SWIFT code is invalid
        return "Please enter a valid SWIFT code.";
    }
    
    // Return null if the SWIFT code is valid
    return null;
};

// Account number validation function
export const checkAccountNumber = (accountNumber) => {
    // Check if the account number is an integer
    if (!Number.isInteger(Number(accountNumber))) {
        return "Please enter a valid account number.";
    }
    
    // Return null if the account number is valid
    return null;
};

// Transfer amount validation function
export const checkTransferAmount = (transferAmount) => {
    // Check if the transfer amount is a float
    if (isNaN(transferAmount) || Number(transferAmount) <= 0) {
        return "Please enter a valid transfer amount.";
    }
    
    // Return null if the transfer amount is valid
    return null;
};