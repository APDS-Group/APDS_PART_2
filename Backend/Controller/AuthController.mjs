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
const store = new ExpressBrute.MemoryStore();

// Create a brute force instance with the store
//var bruteforce = new ExpressBrute(store); // eslint-disable-line no-unused-vars

// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

dotenv.config();

// Define the signup controller function
const signup = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password, accountNumber, idNumber } = req.body;

    console.log("Received signup request with data:", { firstname, lastname, username, email, accountNumber, idNumber });

    const collection = db.collection("users");

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
    const newUser = new User({ firstname, lastname, username, email, password, accountNumber, idNumber });
    newUser.password = await bcrypt.hash(req.body.password, 10);

    console.log("Inserting new user into the database");
    const result = await collection.insertOne(newUser);

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
// Define the pre-register controller function
const preRegister = async (req, res) => {
  try {
    const { firstname, lastname, username, password, empNum, idNumber } = req.body;

    console.log("Received signup request with data:", { firstname, lastname, username, password, empNum, idNumber });

    const db = await connectToDatabase();
    const collection = db.collection("employees");

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
    const result = await collection.insertOne(newEmployee);

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
// Define the login controller function
const login = async (req, res) => {
  try {
    const { usernameOrAccountNumber, password } = req.body;

    // Sanitize user inputs
    const sanitizedUsernameOrAccountNumber = usernameOrAccountNumber.toString();
    const sanitizedPassword = password.toString();

    // Find the user in the database
    const collection = db.collection("users");
    const user = await collection.findOne({
      $or: [
        { username: sanitizedUsernameOrAccountNumber },
        { accountNumber: sanitizedUsernameOrAccountNumber }
      ]
    });

    if (!user) {
      return res.status(403).json({ message: "User does not exist", success: false });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Set req.user
    req.user = {
      _id: user._id,
      username: user.username,
      name: `${user.firstname} ${user.lastname}`
    };

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      id: user._id,
      username: user.username,
      name: `${user.firstname} ${user.lastname}`,
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

// Define the employee login controller function
const employeeLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("Login attempt with username:", username);

     // Sanitize user inputs
     const sanitizedUsername = username.toString();
     const sanitizedPassword = password.toString();

    const db = await connectToDatabase();
    const collection = db.collection("employees");

    const employee = await collection.findOne({ username: sanitizedUsername });

    if (!employee) {
      console.log("Employee not found with username:",sanitizedUsername);
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const isMatch = await bcrypt.compare(sanitizedPassword, employee.password);
    if (!isMatch) {
      console.log("Invalid password for username:",sanitizedUsername);
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ username: employee.username, _id: employee._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    // Set req.user
    req.user = {
      _id: employee._id,
      username: employee.username,
      name: `${employee.firstname} ${employee.lastname}`
    };

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      id: employee._id,
      username: employee.username,
      name: `${employee.firstname} ${employee.lastname}`,     
    });
  } catch (error) {
    console.log("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
// Export the signup and login controller functions
export { signup, login, preRegister, employeeLogin };
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____