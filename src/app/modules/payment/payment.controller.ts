import { Request, Response } from "express";
import { paymentService } from "./payment.service";


export const createPaymentIntentController = async (req: Request, res: Response) => {
    try {
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount',
        });
      }
  
      const secret = await paymentService.createPaymentIntent(amount);

      res.status(200).json({
        success: true,
        message: 'Payment intent created successfully',
        data: secret,
      });
    } catch  {
      res.status(500).json({
        success: false,
        message: `Error creating payment intent:`,
      });
    }
  };


export const createFullPaymentIntentController = async (req: Request, res: Response) => {
    try {


        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid totalCost ',
            });
        }

        const secret = await paymentService.createFullPaymentIntent(amount);
        console.log(secret)
        res.status(200).json({
            success: true,
            message: 'Payment intent created successfully',
            data: secret
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Error creating payment intent:`,
        });
        console.log(error)
    }
};

export const confirmPaymentController = async (req: Request, res: Response) => {
    try {
        const { paymentMethodId, clientSecret } = req.body;

        if (!paymentMethodId || !clientSecret) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment method ID or client secret',
            });
        }

        const paymentIntent = await paymentService.confirmPayment(paymentMethodId, clientSecret);

        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully',
            data: paymentIntent,
        });
    } catch {
        res.status(500).json({
            success: false,
            message: `Error confirming payment: `,
        });
    }
};