import { Request, Response } from "express";
import { paymentService } from "./payment.service";
import jwt from 'jsonwebtoken';
import config from "../../config";
import { User } from "../user/user.model";


export const createPaymentIntentController = async (req: Request, res: Response) => {
    try {
        const { amount } = req.body;

        const token = req.headers.authorization?.split(' ')[1]

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount',
            });
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized, token missing' });
        }

        const decoded = jwt.verify(token, config.jwtAccessSecret as string);

        if (typeof decoded === 'string' || !('email' in decoded)) {
            return res.status(401).json({ success: false, message: 'Invalid token structure' });
        }
        const user = await User.findOne({ email: (decoded).email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userInfo = {
            email: user.email,
            name: user.name,
            profilePhoto: user.profilePhoto || '', 
        };

        const secret = await paymentService.createPaymentIntent(amount, userInfo);

        res.status(200).json({
            success: true,
            message: 'Payment intent created successfully',
            data: { secret, user: userInfo },
        });
    } catch {
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

export const transactionHistoryController = async (req: Request, res: Response) => {

    try {
        const transaction = await paymentService.getTransactionHistory(6)

        return res.status(200).json({
            success: true,
            data: transaction
        })
    }
    catch {
        res.status(500).json({
            success: false,
            message: `Error to get transaction history `,
        });
    }
}