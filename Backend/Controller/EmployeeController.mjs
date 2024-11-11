// Import the connectToDatabase function to establish a connection to the database
import { connectToDatabase } from '../db/conn.mjs';

// Import ExpressBrute for brute force protection
//import ExpressBrute from 'express-brute';

// Import the Employee model
import { Employee } from '../Models/Employee.mjs';
// Import jsonwebtoken for generating JWT tokens
//import jwt from 'jsonwebtoken';

// Establish a connection to the database
const db = await connectToDatabase();

// Create a memory store for ExpressBrute (not recommended for production)
//var store = new ExpressBrute.MemoryStore(); 

// Import bcrypt for hashing passwords
import bcrypt from 'bcrypt';
// Create a brute force instance with the store
//var bruteforce = new ExpressBrute(store); // eslint-disable-line no-unused-vars

// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

dotenv.config();

// Define the signup controller function
const verification = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, accountNumber, idNumber } = req.body;

    console.log("Received signup request with data:", { firstname, lastname, username, email, accountNumber, idNumber });

    let collection = db.collection("users");

    console.log("Checking if user already exists with email, username, or account number");
    const user = await collection.findOne({
      $or: [
        { email: email },
        { username: username },
        { accountNumber: accountNumber },
        { idNumber: idNumber }
      ]
    });

    if (user) {
      let errors = {};
      if (user.email === email) errors.email = "Email already exists";
      if (user.username === username) errors.username = "Username already exists";
      if (user.accountNumber === accountNumber) errors.accountNumber = "Account number already exists";
      if (user.idNumber === idNumber) errors.idNumber = "ID number already exists";
      console.log(errors);
      return res.status(400).json({ message: "User already exists", success: false, errors });
    }

     // Create a new user instance with the provided name, email, and password
    const newUser = new Employee({ firstname, lastname, username, email, password, accountNumber, idNumber });
    newUser.password = await bcrypt.hash(req.body.password, 10);

    console.log("Inserting new user into the database");
    let result = await collection.insertOne(newUser);

    console.log("Registration successful for user:", email);
    res.status(201).json({ 
      message: "Registration successful", 
      success: true,
      userId: result.insertedId // Use the insertedId from the result
    });
  } catch (error) {
    console.log("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Export the signup and login controller functions
export { verification};
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____