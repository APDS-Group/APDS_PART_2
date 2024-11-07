// Import the express module to create a router and handle HTTP requests
import express from 'express';

// Import the ensureAuthentication middleware from the Auth module
import { ensureAuthentication } from "../Middlewares/Auth.mjs";

// Create a new router instance using express.Router()
const router = express.Router();

// Define a GET route for the root path ("/")
// The ensureAuthentication middleware is used to protect this route
// If the user is authenticated, the request proceeds to the callback function
router.get("/", ensureAuthentication, (req, res) => {
    // Send a response with a welcome message that includes the user's name
    res.send(`Welcome to your profile, ${req.user.name}`);
});

// Export the router instance as the default export of this module
export default router;
//  (The Independent Institute of Education, 2024)__---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____---____---____---____---__\\