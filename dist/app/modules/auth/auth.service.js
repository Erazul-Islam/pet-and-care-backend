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
exports.authService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUSerExistByCustomEmial(payload.email);
    console.log(user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found');
    }
    if (!(yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Password');
    }
    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        mobileNumber: user.mobileNumber,
        address: user.address,
        profilePhoto: user.profilePhoto,
        coverPhoto: user.coverPhoto,
        intro: user.intro,
        college: user.college,
        university: user.university,
        lives: user.lives,
        from: user.from,
        followers: user.followers,
        following: user.following
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtAccessSecret, config_1.default.JWT_ACCESS_EXPIRES_IN);
    return {
        accessToken,
        user
    };
});
const changePassword = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(payload.oldPassword, user.password);
    console.log("password matched", isPasswordMatched);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Old password is incorrect');
    }
    user.password = payload === null || payload === void 0 ? void 0 : payload.newPassword;
    user.needsPasswordChange = false;
    user.passwordChangedAt = new Date();
    yield user.save();
    console.log("user after password change", user);
    return {
        message: "Password updated successfully"
    };
});
const forgetPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found');
    }
    const jwtPayload = {
        email: user.email,
        role: user.role,
        _id: user._id
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwtAccessSecret, '10m');
    // const resetlink = `${config.reset_link}?email=${user.email}&token=${resetToken}`
    const resetlink = `${config_1.default.reset_link}/reset/${resetToken}?email=${user.email}`;
    (0, sendEmail_1.sendEmail)(user.email, resetlink);
    console.log(resetlink);
});
const resetPassword = (token, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        console.log("decoded", decoded);
    }
    catch (err) {
        console.log(err);
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Invvalid or expired token');
    }
    const user = yield user_model_1.User.findById(decoded._id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User not found');
    }
    user.password = newPassword;
    yield user.save();
    return 'password reset successfully';
});
exports.authService = {
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword
};
