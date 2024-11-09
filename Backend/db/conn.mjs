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
const client = new MongoClient(connectionString, {
    tlsAllowInvalidCertificates: true, // Disable SSL validation (for testing only)
});

let db = null; // Declare a variable to hold the database reference

// Function to connect to the database
export async function connectToDatabase() {
    if (!db) { // Check if the db variable is null
        try {
            // Attempt to connect to the MongoDB server
            await client.connect();
            // Log a success message if the connection is established
            console.log('MongoDB is CONNECTED!!! :)');
            // Get a reference to the "users" database
            db = client.db("apds");
        } catch (e) {
            // Log any errors that occur during the connection attempt
            console.error('Error connecting to MongoDB:', e);
            throw e; // Rethrow the error to be handled by the caller
        }
    }
    return db; // Return the database reference
}

// Export the database reference for use in other parts of the application
export default db;
// (Shaikh, 2024) (The Independent Institute of Education, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____---____---____---____---__\\