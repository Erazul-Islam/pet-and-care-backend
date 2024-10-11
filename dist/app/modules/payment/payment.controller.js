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
exports.transactionHistoryController = exports.confirmPaymentController = exports.createFullPaymentIntentController = exports.createPaymentIntentController = void 0;
const payment_service_1 = require("./payment.service");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const createPaymentIntentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { amount } = req.body;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid amount',
            });
        }
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized, token missing' });
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        if (typeof decoded === 'string' || !('email' in decoded)) {
            return res.status(401).json({ success: false, message: 'Invalid token structure' });
        }
        const user = yield user_model_1.User.findOne({ email: (decoded).email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const userInfo = {
            email: user.email,
            name: user.name,
            profilePhoto: user.profilePhoto || '',
        };
        const secret = yield payment_service_1.paymentService.createPaymentIntent(amount, userInfo);
        res.status(200).json({
            success: true,
            message: 'Payment intent created successfully',
            data: { secret, user: userInfo },
        });
    }
    catch (_b) {
        res.status(500).json({
            success: false,
            message: `Error creating payment intent:`,
        });
    }
});
exports.createPaymentIntentController = createPaymentIntentController;
const createFullPaymentIntentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Invalid totalCost ',
            });
        }
        const secret = yield payment_service_1.paymentService.createFullPaymentIntent(amount);
        console.log(secret);
        res.status(200).json({
            success: true,
            message: 'Payment intent created successfully',
            data: secret
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: `Error creating payment intent:`,
        });
        console.log(error);
    }
});
exports.createFullPaymentIntentController = createFullPaymentIntentController;
const confirmPaymentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { paymentMethodId, clientSecret } = req.body;
        if (!paymentMethodId || !clientSecret) {
            return res.status(400).json({
                success: false,
                message: 'Missing payment method ID or client secret',
            });
        }
        const paymentIntent = yield payment_service_1.paymentService.confirmPayment(paymentMethodId, clientSecret);
        res.status(200).json({
            success: true,
            message: 'Payment confirmed successfully',
            data: paymentIntent,
        });
    }
    catch (_a) {
        res.status(500).json({
            success: false,
            message: `Error confirming payment: `,
        });
    }
});
exports.confirmPaymentController = confirmPaymentController;
const transactionHistoryController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transaction = yield payment_service_1.paymentService.getTransactionHistory(6);
        return res.status(200).json({
            success: true,
            data: transaction
        });
    }
    catch (_a) {
        res.status(500).json({
            success: false,
            message: `Error to get transaction history `,
        });
    }
});
exports.transactionHistoryController = transactionHistoryController;
