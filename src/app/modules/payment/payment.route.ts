import express from 'express';
import { confirmPaymentController, createFullPaymentIntentController, createPaymentIntentController } from './payment.controller';



const router = express.Router();

router.post('/create-payment-intent', createPaymentIntentController);
router.post('/create-full-payment-intent', createFullPaymentIntentController);
router.post('/confirm-payment', confirmPaymentController);

export const payemtRoute = router