// Import the jsonwebtoken package for handling JWT tokens
import jwt from 'jsonwebtoken';

// Middleware function to ensure authentication using JWT tokens
const ensureAuthentication = (req, res, next) => {
    // Get the 'authorization' header from the request
    const authHeader = req.headers['authorization'];
    
    // If the 'authorization' header is not present, return a 403 status with an error message
    if (!authHeader) {
        return res.status(403).json({ message: 'Unauthorized: JWT Token required' });
    }

    // Extract the token from the 'Bearer <token>' format
    const token = authHeader.split(' ')[1];
    
    // If the token is not present, return a 403 status with an error message
    if (!token) {
        return res.status(403).json({ message: 'Unauthorized: JWT Token required' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach the decoded token payload to the request object
        req.user = decoded;
        
        // Call the next middleware function in the stack
        next();
    } catch (error) {
        // Log the error for debugging purposes
        console.error('JWT verification error:', error);        
        // If the token is invalid, return a 403 status with an error message
        return res.status(403).json({ message: 'Unauthorized: Invalid JWT Token' });
    }
};

// Export the ensureAuthentication middleware function
export { ensureAuthentication };
// (Shaikh, 2024) (The Independent Institute of Education, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____---____---____---____---__\\