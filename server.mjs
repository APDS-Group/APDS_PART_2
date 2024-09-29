
// Import the http module to create an HTTP server
import http from 'http'; 
// Import the https module to create an HTTPS server
import https from 'https';
// Import the fs module to read files
import fs from 'fs';
// Import the express module to create an Express application
import express from 'express'; 
// Import the cors module for handling Cross-Origin Resource Sharing
import cors from 'cors';

// Import the routes
import posts from './routes/post.mjs';
import users from './routes/user.mjs';

/*PAGE 35*/
// Define a route [endpoint] for the root URL ("/")
// Define a constant PORT value to 3000, which will be used for the local server
//const PORT = 3000;
//const PORT = 5050; 
const PORT = 5050; 
// Create an instance of an Express application
const app = express();



/*const server = http.createServer({
    key: fstat.readFileSync('server.key'),
    cert: fstat.readFileSync('server.cert')
},app)*/

//PAGE 35
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
app.use("/post", posts);
app.route("/post", posts);
app.use("/user", users);
app.route("/user", users);



// Add a simple test route
app.get('/test', (req, res) => {
    res.send('Server is working!');
});

// Create an HTTPS server
const server = https.createServer(options, app);
//let server = https.createServer(options, app);




//CREATE | SAVE  a product to the database
app.post('/api/products', async(req, res) => {
    //to get the data 
    try{
     // create new product
     const product = await Product.create(req.body);
     //const product = require('./models/product.model'); 
     res.status(200).json(product);
 
    }catch(error){
     res.status(500).json({message: error.message});
        console.log(error);
     }
 });
// Increase the timeout settings
server.setTimeout(30000); 
// Start the server and listen on the defined PORT
server.listen(PORT, () => {
    console.log(`Server is running on https://localhost:${PORT}`);
});;




/*PAGE 29

// Define the URL prefix
const urlprefix = '/api';
// Define a route [endpoint] for the root URL ("/")
app.get(urlprefix+'/', (req, res) => {
    // Send a response to the client with the message 'Yay! the server-side express app is running'
    res.send('Yay! the server-side express app is running with JSON data')
})

app.get(urlprefix+'/orders',(req, res)=>{
    const orders = [
    {
        id: "1",
        name: "Orange"
    },
    {
        id: "2",
        name: "Apple"
    },
    {
        id: "3",
        name: "Pear"
    },
    ]
    res.json(
        {
           message: "List of Fruits",
           orders: orders
        }
    )
})*/
// Start the Express server and listen on the defined PORT
// .listen() makes the server start listening for incoming connections on the specified port


/*PAGE 26 
// Use express.json() middleware to parse JSON request bodies
app.use(express.json());

// Define a route [endpoint] for the root URL ("/")
app.get('/', (req, res) => {
    // Send a response to the client with the message 'Yay! the server-side express app is running'
    res.send('Yay! the server-side express app is running')
})

// Define a route [endpoint] for the test URL ("/")
app.get('/test', (req, res) => {
    res.send('Yay! I am testing the this endpoint too ')
})*/

/*PAGE  ?? 
// Create an HTTP server that listens for requests and sends a response
const server = http.createServer((req, res) => {
    // Send a response to the client with the message 'Server-side code running: you got this'
    res.end('Yay! the server-side code is ruuning,  you got this');
});

// Make the server listen on the defined PORT
server.listen(PORT, () => {
    // Log a message to the console indicating the server is running and listening on the specified port
    console.log(`Yay! the server (LOG) is running at http://localhost:${PORT}/`);
});
*/

//END FOR ALL PAGES BUT NOT PAGE 31
//app.listen(PORT); // Start the server

//END PAGE 31 and 35
//server.listen(PORT);// Start the server
