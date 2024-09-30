import express from 'express';

//import db from "../db/conn.mjs";
import { connectToDatabase } from '../db/conn.mjs';
import { ObjectId } from "mongodb";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressBrute from 'express-brute';


const router = express.Router();
const db = await connectToDatabase();

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);

//SIGN UP FUNCTION 
router.post("/signup", async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        let newUser = {
            name: req.body.name,
            password: (await password).toString()
        };

        let collection = db.collection("users");
        let user = await collection.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).send("User already exists");
        }
        let result = await collection.insertOne(newUser);
        console.log("Hashed Password:", password);
        res.status(204).send(result);
    } catch (error) {
        console.error("Error in POST /signup route:", error);
        res.status(500).send("Internal Server Error");
    }
});


//LOGIN FUNCTION 
router.post("/login", bruteforce.prevent, async (req, res) => {
    const { name, password } = req.body;
    console.log(name + " " + password)

    try {
        const collection = await db.collection("users");
        const user = await collection.findOne({ name });
        if (!user) {
            return res.status(401).json({ message: "Authentication failed" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Authentication failed" });
        }
        else {
            // Authentication successful
            const token = jwt.sign({ username: req.body.username, password: req.body.password }, "this_secret_should_be_longer_than_it_is", { expiresIn: "1h" })
            res.status(200).json({ message: "Authentication successful", token: token, name: req.body.name });
            
            //TOKEN TO VERIFIY USER'S SESSION 
            console.log("your new token is", token)


        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }

});




// Define your routes here
router.get('/', (req, res) => {
    res.send('User route');
});

// Export the router as the default export
export default router;