// Import the connectToDatabase function to establish a connection to the database
import { connectToDatabase } from '../db/conn.mjs';

// Import bcrypt for hashing passwords
import bcrypt from 'bcrypt';

// Import ExpressBrute for brute force protection
import ExpressBrute from 'express-brute';

// Import the User model
import { User } from '../Models/User.mjs';

// Import the Employee model
import { Employee } from '../Models/Employee.mjs';
// Import jsonwebtoken for generating JWT tokens
import jwt from 'jsonwebtoken';

// Establish a connection to the database
const db = await connectToDatabase();

// Create a memory store for ExpressBrute (not recommended for production)
var store = new ExpressBrute.MemoryStore(); 

// Create a brute force instance with the store
var bruteforce = new ExpressBrute(store); // eslint-disable-line no-unused-vars

// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

dotenv.config();

// Define the signup controller function
const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, accountNumber, idNumber } = req.body;

    console.log("Received signup request with data:", { firstname, lastname, username, email, accountNumber, idNumber });

    let collection = db.collection("users");

    console.log("Checking if user already exists with email, username, or account number");
    const user = await collection.findOne({
      $or: [
        { email: email },
        { username: username },
        { accountNumber: accountNumber }
      ]
    });

    if (user) {
      let errorMessage = "User already exists with ";
      if (user.email === email) errorMessage += "email";
      if (user.username === username) errorMessage += (errorMessage.endsWith(" ") ? "" : ", ") + "username";
      if (user.accountNumber === accountNumber) errorMessage += (errorMessage.endsWith(" ") ? "" : ", ") + "account number";
      console.log(errorMessage);
      return res.status(400).json({ message: errorMessage, success: false });
    }

     // Create a new user instance with the provided name, email, and password
    const newUser = new User({ firstname, lastname, username, email, password, accountNumber, idNumber });
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
/*const signup = async (req, res) => {
  try {
    // Extract name, email, and password from the request body
    const { name, email, password } = req.body;
   
    // Get the users collection from the database
    let collection = db.collection("users");

    // Check if a user with the given email already exists
    const user = await collection.findOne({ email });

    // If the user already exists, return a 400 status with an error message
    if (user) {
      return res.status(400).json({ message: "User already exists", success: false });
    }    

    // Create a new user instance with the provided name, email, and password   
    const newUser = new User({ name, email, password });

    // Hash the user's password before saving it to the database
    newUser.password = await bcrypt.hash(req.body.password, 10);

    // Insert the new user into the users collection
    let result = await collection.insertOne(newUser); // eslint-disable-line no-unused-vars

    // Return a 201 status with a success message
    res.status(201).json({ message: "Registration successful", success: true });

  } catch (error) {
    // If an error occurs, return a 500 status with an error message
    res.status(500).json({ message: "Internal Serveer Error", success: false });
    console.log(error)
  }
};
*/
// Define the pre-register controller function
const preRegister = async (req, res) => {
  try {
    const { firstname, lastname, username, password, empNum, idNumber } = req.body;

    console.log("Received signup request with data:", { firstname, lastname, username,password, empNum, idNumber });

    const db = await connectToDatabase();
    let collection = db.collection("employees");

    console.log("Checking if employee user already exists with username, or employee number");
    const employee = await collection.findOne({
      $or: [
        { username: username },
        { empNum: empNum }
      ]
    });

    if (employee) {
      let errorMessage = "User already exists with ";
      if (employee.username === username) errorMessage += (errorMessage.endsWith(" ") ? "" : ", ") + "username";
      if (employee.empNum === empNum) errorMessage += (errorMessage.endsWith(" ") ? "" : ", ") + "employee number";
      console.log(errorMessage);
      return res.status(400).json({ message: errorMessage, success: false });
    }

    // Create a new employee instance with the provided data
    const newEmployee = new Employee({ firstname, lastname, username, password, empNum, idNumber });
    newEmployee.password = await bcrypt.hash(req.body.password, 10);

    console.log("Inserting new employee user into the database");
   // await newEmployee.save();    
    let result = await collection.insertOne(newEmployee);

    console.log("Registration successful for employee:", username);
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

// Define the login controller function
const login = async (req, res) => {
  try {
    const { usernameOrAccountNumber, password } = req.body;

    const user = await db.collection("users").findOne({
      $or: [
        { username: usernameOrAccountNumber },
        { accountNumber: usernameOrAccountNumber }
      ]
    });

    if (!user) {
      return res.status(403).json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      email: user.email,
      name: `${user.firstname} ${user.lastname}`
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message
    });
  }
};
/*const login = async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;
    // Find a user with the given email in the users collection
    const user = await db.collection("users").findOne({ email });

    // If the user is not found, return a 403 status with an error message
    if (!user) {
      return res.status(403).json({ message: "User does not exist", success: false });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    // If the password does not match, return a 403 status with an error message
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    // Generate a JWT token with the user's email and ID, and set it to expire in 1 hour
    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return a 200 status with a success message, token, email, and name
    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      email: email,
      name: user.name
    });
  } catch (error) {
    // If an error occurs, return a 500 status with an error message
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message
    });
  }
};
*/
// Define the employee login controller function
const employeeLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Login attempt with username:", username);

    const db = await connectToDatabase();
    let collection = db.collection("employees");

    const employee = await collection.findOne({ username: username });

    if (!employee) {
      console.log("Employee not found with username:", username);
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      console.log("Invalid password for username:", username);
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ username: employee.username, _id: employee._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      username: employee.username,
      name: `${employee.firstname} ${employee.lastname}`
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
// Export the signup and login controller functions
export { signup, login, preRegister, employeeLogin };
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____