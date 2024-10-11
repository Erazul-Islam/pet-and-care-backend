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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const user_service_1 = require("./user.service");
const config_1 = __importDefault(require("../../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUpRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userService.signUp(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        status: 201,
        success: true,
        message: 'User Registration Successfully',
        data: result
    });
}));
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        const result = yield user_service_1.userService.getMyProfile(token);
        res.status(200).json({
            success: true,
            message: "User profile retrived successfully!",
            data: result
        });
    }
    catch (err) {
        console.log(err);
    }
});
const getUpdatedUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const updatedData = req.body;
    try {
        const updatedUser = yield user_service_1.userService.getUpdatedUser(token, updatedData);
        console.log(updatedUser);
        res.status(200).json({
            success: true,
            message: "user updated successfully!",
            data: updatedUser
        });
    }
    catch (err) {
        console.log(err);
    }
});
const followConntroller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const targetUserId = req.params.id;
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    const currentUserId = decoded._id;
    const result = yield user_service_1.userService.followUser(currentUserId, targetUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        status: 200,
        success: true,
        message: result.message,
        data: result
    });
}));
const unfollowCoontroller = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const targetUserId = req.params.id;
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    const currentUserId = decoded._id;
    const result = yield user_service_1.userService.unfollowUser(currentUserId, targetUserId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        status: 200,
        success: true,
        message: result.message,
        data: null
    });
}));
const getUpdatedUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    try {
        const updatedUserRole = yield user_service_1.userService.getUpdatedUserRole(userId);
        if (!updatedUserRole) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: updatedUserRole,
        });
    }
    catch (err) {
        console.log(err);
    }
});
const deleteSingleUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const result = yield user_service_1.userService.deleteUser(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: result
        });
    }
    catch (err) {
        console.log(err);
    }
});
const getAllProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_service_1.userService.getAllProfileFromDB();
        res.status(200).json({
            statusCode: 200,
            status: 200,
            success: true,
            message: "All profile retrieved successfully",
            data: result
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports.userController = {
    signUpRegistration,
    getProfile,
    getUpdatedUser,
    followConntroller,
    unfollowCoontroller,
    getUpdatedUserRole,
    deleteSingleUser,
    getAllProfile
};
