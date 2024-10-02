
// Import the https module to create an HTTPS server
import https from 'https';
// Import the fs module to read files
import fs from 'fs';
// Import the express module to create an Express application
import express from 'express'; 
// Import the cors module for handling Cross-Origin Resource Sharing
import cors from 'cors';

// Import the routes
import users from './routes/user.mjs';


// Define the PORT to access the server
const PORT = 5050; 
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


// Create an HTTPS server
const server = https.createServer(options, app);
//let server = https.createServer(options, app);


// Increase the timeout settings
server.setTimeout(30000); 
// Start the server and listen on the defined PORT
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});;



