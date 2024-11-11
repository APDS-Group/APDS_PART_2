// Import the connectToDatabase function to establish a connection to the database
import { connectToDatabase } from '../db/conn.mjs';

// Import bcrypt for hashing passwords
import bcrypt from 'bcrypt';

// Import ExpressBrute for brute force protection
import ExpressBrute from 'express-brute';

// Import the User model
import { User } from '../Models/User.mjs';

// Import jsonwebtoken for generating JWT tokens
import jwt from 'jsonwebtoken';

// Establish a connection to the database
const db = await connectToDatabase();

// Create a memory store for ExpressBrute (not recommended for production)
var store = new ExpressBrute.MemoryStore(); 

// Create a brute force instance with the store
var bruteforce = new ExpressBrute(store, {
  freeRetries: 4,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 5 * 60 * 1000, // 5 minutes
  lifetime: 5 * 60 // 5 minutes
});
// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";
dotenv.config();

// Define the signup controller function
const signup = async (req, res) => {
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
    res.status(500).json({ message: "Internal Server Error", success: false });
    console.log(error)
  }
};

// Define the login controller function
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User does not exist", success: false });
    }

    // Check if the user is currently locked out
    if (user.lockoutUntil && user.lockoutUntil > new Date()) {
      return res.status(403).json({ message: "Account locked. Try again later.", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Check if failed login attempts have reached the limit
      if (user.failedLoginAttempts >= 4) {
        user.lockoutUntil = new Date(Date.now() + 5 * 60 * 1000); // Lockout for 5 minutes
      }

      await db.collection("users").updateOne({ email }, { $set: user });

      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    // Reset failed login attempts and lockout time on successful login
    user.failedLoginAttempts = 0;
    user.lockoutUntil = null;
    await db.collection("users").updateOne({ email }, { $set: user });

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      email: email,
      name: user.name
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false, error: error.message });
  }
};

// Export the signup and login controller functions
export { signup, login };
//(Shaikh, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____