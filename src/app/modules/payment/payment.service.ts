import Stripe from "stripe";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const stripe = new Stripe(process.env.secret_Key as string);

const createPaymentIntent = async (amount: number, userInfo : {email : string, name : string, profilePhoto : string}) => {

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata : {
                userEmail : userInfo.email,
                userName : userInfo.name,
                userProfilePhoto : userInfo.profilePhoto
            }
        });
        return paymentIntent;

    } catch {
        throw new Error('Error creating payment intent: ');
    }
};

const createFullPaymentIntent = async (amount: number) => {
    console.log(amount)
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        console.log(paymentIntent)
        return paymentIntent;

    } catch {
        throw new Error('Error creating payment intent: ');
    }
};

const confirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        });
        return paymentIntent;
    } catch {
        throw new Error('Error confirming payment: ');
    }
};

const getTransactionHistory = async (limit = 5) => {
    try{
        const paymentIntent = await stripe.paymentIntents.list({
            limit : limit
        })

        return paymentIntent.data
    }
    catch  {
        throw new AppError(httpStatus.NOT_FOUND,'payment history not found')
    }
}

export const paymentService = {
    createFullPaymentIntent,
    confirmPayment,
    createPaymentIntent,
    getTransactionHistory
}