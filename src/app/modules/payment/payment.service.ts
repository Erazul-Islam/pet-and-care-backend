import Stripe from "stripe";

const stripe = new Stripe(process.env.secret_Key as string);

const createPaymentIntent = async (amount: number) => {
    console.log(amount)
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        console.log(paymentIntent)
        return paymentIntent;

    } catch  {
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

    } catch  {
        throw new Error('Error creating payment intent: ');
    }
};

const confirmPayment = async (paymentIntentId: string, paymentMethodId: string) => {
    try {
        const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        });
        return paymentIntent;
    } catch  {
        throw new Error('Error confirming payment: ');
    }
};


export const paymentService = {
    createFullPaymentIntent,
    confirmPayment,
    createPaymentIntent
}