import express from 'express';
import { connectToDatabase } from '../db/conn.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ExpressBrute from 'express-brute';
import { signup ,login} from '../Controller/AuthController.mjs';
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.mjs';


const router = express.Router();
const db = await connectToDatabase();

var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);



// SIGN UP FUNCTION 
/*router.post("/signup", async (req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        let newUser = {
            email: req.body.email,
            password: (await password).toString()
        };

        let collection = db.collection("users");
        let user = await collection.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).send("User already exists");
        }
        //Registration successful
        let result = await collection.insertOne(newUser);
        console.log("Registration successful,Hashed Password:", password);
        res.status(204).send(result);
    } catch (error) {
        console.error("Error in POST /signup route:", error);
        res.status(500).send("Internal Server Error");
    }
});*/
router.post("/signup", signupValidation, signup); 

router.post("/login", loginValidation, login); 

// LOGIN FUNCTION 
/*router.post("/login", bruteforce.prevent, async (req, res) => {
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
            const token = jwt.sign({ email: req.body.email, password: req.body.password }, "this_secret_should_be_longer_than_it_is", { expiresIn: "1h" });
            res.status(200).json({ message: "Login | Authentication successful", token: token, email: req.body.email });
            
            // TOKEN TO VERIFY USER'S SESSION 
            console.log("your new token is", token);
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
});*/

// Define your routes here
router.get('/', (req, res) => {
    res.send('User route');
});

// Export the router as the default export
export default router;