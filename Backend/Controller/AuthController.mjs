import express from 'express';
import { connectToDatabase } from '../db/conn.mjs';
import bcrypt from 'bcrypt';
import ExpressBrute from 'express-brute';
import { User } from '../Models/User.mjs';
import jwt from 'jsonwebtoken';

const db = await connectToDatabase();
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";
dotenv.config();


const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let collection = db.collection("users");
    const user = await collection.findOne({ email});

    if (user) {
        return res.status(400)
        .json({ message: "User already exists",sucess:false });
    }
    const newUser = new User({ name, email, password });
    newUser.password = await bcrypt.hash(req.body.password, 10);
    let result = await collection.insertOne(newUser);
    res.status(201).json({ message:"Registration successful",success: true });
    

  } catch (error) {
    res.status(500).json({ message:"Internal Server Error",success: true });
  }
};

/*const login = async (req, res) => {
  try {

    const { email, password } = req.body;
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ email: user.email , _id: user._id}, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).
    json({
       message: "Login successful",
       success: true ,
       token: token,
       email: email,
       name: user.name
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error",
       success: false, 
       error: error.message });
  }
};
*/
const login = async (req, res) => {
  try {
    console.log('Login endpoint hit'); // Log when the endpoint is hit
    const { email, password } = req.body;
    console.log('Login request received:', { email, password }); // Log the received request

    const user = await db.collection("users").findOne({ email });
    console.log('User found:', user); // Log the user found

    if (!user) {
      console.log('User not found'); // Log if user is not found
      return res.status(403).json({ message: "User not found", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch); // Log if password matches

    if (!isMatch) {
      console.log('Invalid credentials'); // Log if credentials are invalid
      return res.status(403).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ email: user.email, _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    console.log('Login successful:', { email, token }); // Log the successful login

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token,
      email: email,
      name: user.name
    });
  } catch (error) {
    console.error('Error during login:', error.message); // Log the error
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: error.message
    });
  }
};

export { signup, login };