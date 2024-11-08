// Import the express module to create a router and handle HTTP requests
import express from 'express';

// Import the signup and login controller functions from the AuthController module
import { preRegister, employeeLogin } from '../Controller/AuthController.mjs';

// Import the signupValidation and loginValidation middleware functions from the AuthValidation module
import { preRegisterValidation, employeeValidation} from '../Middlewares/AuthValidation.mjs';

// Import ExpressBrute for brute force protection
import ExpressBrute from 'express-brute';

// Create a new router instance using express.Router()
const router = express.Router();

// Create a memory store for ExpressBrute (not recommended for production)
var store = new ExpressBrute.MemoryStore();

// Create a brute force instance with the store
var bruteforce = new ExpressBrute(store);

// Define a POST route for the "/preregistration" path
// The preRegisterValidation middleware is used to validate the request data
// If the validation passes, the preRegister controller function is called to handle the request
router.post("/preregistration", preRegisterValidation, preRegister);

// Define a POST route for the "/login" path
// The bruteforce middleware is used to protect against brute force attacks
// The loginValidation middleware is used to validate the request data
// If the validation passes, the login controller function is called to handle the request
router.post("/login", bruteforce.prevent, employeeValidation, employeeLogin);

// Define a GET route for the root path ("/")
// This route sends a simple response indicating that it is the employee route
router.get('/', (req, res) => {
    res.send('Employee route');
});

// Export the router instance as the default export of this module
export default router;