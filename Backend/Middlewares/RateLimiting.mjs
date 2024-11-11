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
const loginRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 4, // Limit each IP to 4 login attempts per `window` (here, per 5 minutes)
    message: {
      message: "Too many login attempts from this IP, please try again after 5 minutes",
      success: false
    },
    keyGenerator: (req) => req.body.usernameOrAccountNumber || req.ip, // Use username or IP as the key
    skipSuccessfulRequests: true // Only count failed attempts
  });
export {limiter, loginRateLimiter};