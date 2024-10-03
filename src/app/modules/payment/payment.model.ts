import mongoose from "mongoose";


const PaymentSchema = new mongoose.Schema({
    amount: { type: Number, required: true },
    paymentMethodId: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;