import express from 'express';
import { connectToDatabase } from '../db/conn.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressBrute from 'express-brute';
import validator from 'validator';

const router = express.Router();
const db = await connectToDatabase();

var store = new ExpressBrute.MemoryStore(); 
var bruteforce = new ExpressBrute(store);

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const usernamePattern = /^[a-zA-Z0-9_-]{3,16}$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

// Validation functions
function validateEmail(email) {
    return emailPattern.test(email);
}

function validateUsername(username) {
    return usernamePattern.test(username);
}

function validatePassword(password) {
    return passwordPattern.test(password);
}

// SIGN UP FUNCTION 
router.post("/signup", async (req, res) => {
    try {

        const { email, password } = req.body;
       
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
    
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser = {
            email: email,
            password: hashedPassword
        };

        let collection = db.collection("users");
        let user = await collection.findOne({ email });
        if (user) {
            return res.status(400).send("User already exists");
        }

        // Registration successful
        let result = await collection.insertOne(newUser);
        console.log("Registration successful, Hashed Password:", hashedPassword);
        res.status(204).send(result);
    } catch (error) {
        console.error("Error in POST /signup route:", error);
        res.status(500).send("Internal Server Error");
    }
});

// LOGIN FUNCTION 
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { email, password } = req.body;
    console.log(email + " " + password);

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        } else {
            // Authentication successful
            const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET || "default_secret_key", { expiresIn: "1h" });
            res.status(200).json({ message: "Login | Authentication successful", token: token, email: req.body.email });
            console.log("your new token is", token);
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});
// Password validation
// function validatePassword(password) {
//     const minLength = 8;
//     const hasUpperCase = /[A-Z]/.test(password);
//     const hasLowerCase = /[a-z]/.test(password);
//     const hasNumbers = /[0-9]/.test(password);
//     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

//     return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
// }

// Define your routes here
router.get('/', (req, res) => {
    res.send('User route');
});

// Export the router as the default export
export default router;