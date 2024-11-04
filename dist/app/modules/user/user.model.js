"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
    },
    email: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    coverPhoto: {
        type: String,
        default: "https://i.ibb.co.com/gW4N1YR/image-3-2x.jpg"
    },
    intro: {
        type: String,
        default: ''
    },
    college: {
        type: String,
        default: ''
    },
    university: {
        type: String,
        default: ''
    },
    lives: {
        type: String,
        default: ''
    },
    isPremium: {
        type: Boolean,
        default: false
    },
    from: {
        type: String,
        default: ''
    },
    passwordChangedAt: {
        type: Date,
    },
    mobileNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    friendRequest: [
        {
            sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
            status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
            senderProfilePhoto: { type: String, required: true },
            senderName: { type: String, required: true }
        }
    ],
    friend: [
        {
            id: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String },
        }
    ],
    followers: [{
            id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'pet_care_user' },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String }
        }],
    following: [{
            id: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'pet_care_user' },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String, }
        }]
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this; // doc
        if (!user.isModified('password')) {
            return next();
        }
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
userSchema.statics.isUSerExistByCustomEmial = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email }).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPass, hashedPass) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPass, hashedPass);
    });
};
exports.User = (0, mongoose_1.model)('pet_care_user', userSchema);
