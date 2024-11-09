import express from 'express';
import { processPayment } from '../Controller/PaymentController.mjs';

const router = express.Router();

router.post('/process', processPayment);

export default router;