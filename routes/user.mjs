import express from 'express';

const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
    res.send('User route');
});

// Export the router as the default export
export default router;