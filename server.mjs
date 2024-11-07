
// Import the https module to create an HTTPS server
import https from 'https';
// Import the fs module to read files
import fs from 'fs';
// Import the express module to create an Express application
import express from 'express'; 
// Import the cors module for handling Cross-Origin Resource Sharing
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();
// Import the routes
import users from './routes/user.mjs';


const PORT = process.env.PORT || 5051;
// Create an instance of an Express application
const app = express();


// Define HTTPS options
const options = {
    key: fs.readFileSync('./keys/privatekey.pem'),
    cert: fs.readFileSync('./keys/cert.pem')
    
}
    
// Use CORS middleware for all routes ( domain)
app.use(cors());
// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Use helmet to secure HTTP headers
app.use(helmet());

// Configure Content Security Policy (CSP)
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"], // Allow resources only from your own domain
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com", "https://www.googletagmanager.com"], // Trusted sources for scripts
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"], // Trusted sources for styles, including inline
        imgSrc: ["'self'", "data:", "https://example-image-host.com"], // Allow images from self and data URIs
        fontSrc: ["'self'", "https://fonts.gstatic.com"], // Load fonts from a trusted source
        connectSrc: ["'self'"], // Allow connections only to the same origin
        objectSrc: ["'none'"], // Block <object>, <embed>, and <applet> tags
        upgradeInsecureRequests: [], // Ensure insecure HTTP requests are upgraded to HTTPS
    }
}));


// Configure X-Frame-Options
app.use(helmet.frameguard({ action: 'deny' }));

// Configure Strict-Transport-Security (HSTS)
app.use(helmet.hsts({
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply HSTS to all subdomains
    preload: true
}));
// Set headers for CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    next();
})


// Use the imported routes

app.use("/user", users);
app.route("/user", users);


// Add a simple test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Create an HTTPS server
const server = https.createServer(options, app);
//let server = https.createServer(options, app);


// Increase the timeout settings
server.setTimeout(30000); 
// Start the server and listen on the defined PORT
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});;

export { app };



