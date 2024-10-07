import express from 'express';
import { ensureAuthentication } from "../Middlewares/Auth";

const router = express.Router();

router.get("/", ensureAuthentication, (req, res) => {
    res.send(`Welcome to your profile, ${req.user.name}`);
});

export default router;