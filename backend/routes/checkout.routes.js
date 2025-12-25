import express from 'express';
import { createPaymentIntent, confirmPayment, getPaymentStatus } from '../controllers/checkout.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/payment-status/:paymentIntentId', protect, getPaymentStatus);

export default router; 