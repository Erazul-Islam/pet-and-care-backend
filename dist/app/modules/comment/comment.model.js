"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoSchema = exports.commentSchema = void 0;
const mongoose_1 = require("mongoose");
exports.commentSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userProfilePhoto: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.InfoSchema = new mongoose_1.Schema({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userProfilePhoto: {
        type: String,
        required: true,
    },
});
