"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const stripe = new stripe_1.default(process.env.secret_Key);
const createPaymentIntent = (amount, userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: {
                userEmail: userInfo.email,
                userName: userInfo.name,
                userProfilePhoto: userInfo.profilePhoto
            }
        });
        return paymentIntent;
    }
    catch (_a) {
        throw new Error('Error creating payment intent: ');
    }
});
const createFullPaymentIntent = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(amount);
    try {
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method_types: ['card'],
        });
        console.log(paymentIntent);
        return paymentIntent;
    }
    catch (_a) {
        throw new Error('Error creating payment intent: ');
    }
});
const confirmPayment = (paymentIntentId, paymentMethodId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentIntent = yield stripe.paymentIntents.confirm(paymentIntentId, {
            payment_method: paymentMethodId,
        });
        return paymentIntent;
    }
    catch (_a) {
        throw new Error('Error confirming payment: ');
    }
});
const getTransactionHistory = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (limit = 6) {
    try {
        const paymentIntent = yield stripe.paymentIntents.list({
            limit: limit
        });
        return paymentIntent.data;
    }
    catch (_a) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'payment history not found');
    }
});
exports.paymentService = {
    createFullPaymentIntent,
    confirmPayment,
    createPaymentIntent,
    getTransactionHistory
};
