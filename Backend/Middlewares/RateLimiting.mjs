import rateLimit from 'express-rate-limit';

// Define rate limiting rules
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes",
        success: false
    }
});

export default limiter;