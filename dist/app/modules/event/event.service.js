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
exports.eventService = void 0;
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const event_model_1 = require("./event.model");
const createEvent = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const finduser = yield user_model_1.User.findOne({ email: decoded.email });
    const userName = finduser === null || finduser === void 0 ? void 0 : finduser.name;
    const userId = finduser === null || finduser === void 0 ? void 0 : finduser._id;
    const userProfilePhoto = finduser === null || finduser === void 0 ? void 0 : finduser.profilePhoto;
    payload.userName = userName;
    payload.userId = userId;
    payload.userPhoto = userProfilePhoto;
    const result = yield event_model_1.eventModel.create(payload);
    return result;
});
const interestedEvent = (eventId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const finduser = yield user_model_1.User.findOne({ email: decoded.email });
    if (!finduser) {
        throw new Error("User not found");
    }
    const interested = {
        id: finduser === null || finduser === void 0 ? void 0 : finduser._id,
        email: finduser === null || finduser === void 0 ? void 0 : finduser.email,
        username: finduser === null || finduser === void 0 ? void 0 : finduser.name,
        profilePhoto: finduser === null || finduser === void 0 ? void 0 : finduser.profilePhoto
    };
    const result = yield event_model_1.eventModel.findByIdAndUpdate(eventId, { $push: { interested: interested } }, { new: true });
    if (!result) {
        throw new Error("Post not found");
    }
    return result;
});
const endEvent = (eventId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = event_model_1.eventModel.findOneAndUpdate({ _id: eventId }, { $set: { "status": 'ended' } }, { new: true });
    return result;
});
exports.eventService = {
    createEvent,
    interestedEvent,
    endEvent
};
