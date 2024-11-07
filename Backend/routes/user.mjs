// Import the express module to create a router and handle HTTP requests
import express from 'express';

// Import the signup and login controller functions from the AuthController module
import { signup, login } from '../Controller/AuthController.mjs';

// Import the signupValidation and loginValidation middleware functions from the AuthValidation module
import { signupValidation, loginValidation } from '../Middlewares/AuthValidation.mjs';

// Import ExpressBrute for brute force protection
import ExpressBrute from 'express-brute';

// Create a new router instance using express.Router()
const router = express.Router();

// Create a memory store for ExpressBrute (not recommended for production)
var store = new ExpressBrute.MemoryStore();

// Create a brute force instance with the store
var bruteforce = new ExpressBrute(store);

// Define a POST route for the "/signup" path
// The signupValidation middleware is used to validate the request data
// If the validation passes, the signup controller function is called to handle the request
router.post("/signup", signupValidation, signup);

// Define a POST route for the "/login" path
// The bruteforce middleware is used to protect against brute force attacks
// The loginValidation middleware is used to validate the request data
// If the validation passes, the login controller function is called to handle the request
router.post("/login", bruteforce.prevent, loginValidation, login);

// Define a GET route for the root path ("/")
// This route sends a simple response indicating that it is the user route
router.get('/', (req, res) => {
    res.send('User route');
});

// Export the router instance as the default export of this module
export default router;
//  (The Independent Institute of Education, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____---____---____---____---__\\