// Import the https module to create an HTTPS server
import https from 'https';
// Import the fs module to read files
import fs from 'fs';
// Import the express module to create an Express application
import express from 'express'; 
// Import the cors module for handling Cross-Origin Resource Sharing
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';

// Import the routes
import employees from './routes/employee.mjs';
import users from './routes/user.mjs';
import home from './routes/home.mjs';
import payment from './routes/payment.mjs';

// Import the IP blacklisting and rate limiting middleware changes
import { ipFilter, handleIpFilterErrors } from './Middlewares/IPBlacklisting.mjs';
import { limiter, loginRateLimiter } from './Middlewares/RateLimiting.mjs'; // NOSONAR

const PORT = 5050; 
// Create an instance of an Express application
const app = express();

// Define HTTPS options
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/cert.pem'),
    minVersion: 'TLSv1.2',
    ciphers: [
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'ECDHE-ECDSA-CHACHA20-POLY1305',
        'ECDHE-RSA-CHACHA20-POLY1305',
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-SHA384',
        'ECDHE-RSA-AES256-SHA384',
        'ECDHE-ECDSA-AES128-SHA256',
        'ECDHE-RSA-AES128-SHA256',
        '!aNULL',
        '!eNULL',
        '!EXPORT',
        '!DES',
        '!RC4',
        '!3DES',
        '!MD5',
        '!PSK',
        '!SRP',
        '!CAMELLIA'
    ].join(':'),
    honorCipherOrder: true
};

// Use helmet middleware to set security-related HTTP headers
app.use(helmet());

// Set the X-Frame-Options header to DENY
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    next();
});

// Enable HSTS with Helmet
app.use(helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply HSTS to all subdomains
    preload: true // Add the preload flag for HSTS preload list
}));

// Use CORS middleware for all routes ( domain)
app.use(cors());

// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Use cookie-parser middleware
app.use(cookieParser());

// Set headers for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
});

// Apply IP blacklisting middleware
app.use(ipFilter);
app.use(handleIpFilterErrors);

// Apply rate limiting middleware globally
app.use(limiter);

// Use the imported routes
app.use("/employee", employees);
app.route("/employee", employees);

app.use("/user", users);
app.route("/user", users);

app.use("/home", home);
app.route("/home", home);

app.use('/payment', payment);
app.route('/payment', payment);

// Add a simple test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Create an HTTPS server
const server = https.createServer(options, app);

// Increase the timeout settings
server.setTimeout(30000); 

// Start the server and listen on the defined PORT
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});