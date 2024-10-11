"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PaymentSchema = new mongoose_1.default.Schema({
    amount: { type: Number, required: true },
    paymentMethodId: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });
const Payment = mongoose_1.default.model('Payment', PaymentSchema);
module.exports = Payment;
