
// Import the MongoClient class from the mongodb package
import { MongoClient } from "mongodb";

// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

// Load environment variables from a .env file into process.env
dotenv.config();

// Retrieve the MongoDB connection string from the environment variables
// If the environment variable ATLAS_URI is not set, use an empty string as the default value
const connectionString = process.env.ATLAS_URI || "";

// Log the connection string to the console for debugging purposes
console.log(connectionString);

// Create a new MongoClient instance using the connection string
//const client = new MongoClient(connectionString);

const client = new MongoClient(connectionString, {
   
    tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing only)
});

let db = null; // Declare a variable to hold the database reference
let conn = null; // Declare a variable to hold the connection object

// Function to connect to the database
export async function connectToDatabase() {
    if (!db) {
        try {
            // Attempt to connect to the MongoDB server
            await client.connect();
            // Log a success message if the connection is established
            console.log('MongoDB is CONNECTED!!! :)');
            // Get a reference to the "users" database
            db= client.db("users");
           // db = conn;
        } catch (e) {
            // Log any errors that occur during the connection attempt
            console.error('Error connecting to MongoDB:', e);
            throw e;
        }
    }
    return db;
    
}
// Get a reference to the "users" database
//let db = client.db("users");

// Export the database reference for use in other parts of the application
export default db;

//set NODE_OPTIONS=--openssl-legacy-provider
//node server.mjs


/*// conn.mjs
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.ATLAS_URI;

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing only)
});

async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        return client;
    } catch (error) {
        console.error("FUCKKK connecting to MongoDB:", error);
        throw error;
    }
}

export default connectToDatabase;
*/

