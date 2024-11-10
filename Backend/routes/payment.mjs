import express from 'express';
import { processPayment } from '../Controller/PaymentController.mjs';
import { ensureAuthentication } from '../Middlewares/Auth.mjs';

const router = express.Router();

router.post('/process', ensureAuthentication,processPayment);

export default router;