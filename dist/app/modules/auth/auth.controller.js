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
exports.authController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const loginUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.loginUser(req.body);
    const User = {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        mobileNumber: result.user.mobileNumber,
        address: result.user.address,
        profilePhoto: result.user.profilePhoto,
        role: result.user.role,
    };
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: `${User.name} logged in successfully`,
        accessToken: result.accessToken,
        data: User
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    const passwordData = req.body;
    const result = yield auth_service_1.authService.changePassword(userId, passwordData);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: ` password updated successfully`,
        data: result
    });
}));
const forgetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const result = yield auth_service_1.authService.forgetPassword(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reset link is generated succesfully!',
        data: result,
        status: 200
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.params.token;
    const password = req.body.password;
    if (!token || !password) {
        res.status(400).json({ message: 'Token and new password are required' });
        return;
    }
    const message = yield auth_service_1.authService.resetPassword(token, password);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Reset succesfully!',
        data: message,
        status: 200
    });
}));
exports.authController = {
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword
};
