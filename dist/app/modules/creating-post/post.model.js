"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postModel = void 0;
const mongoose_1 = require("mongoose");
const comment_model_1 = require("../comment/comment.model");
const postSchema = new mongoose_1.Schema({
    userEmail: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    isPremium: {
        type: String,
        required: true
    },
    isPublished: {
        type: Boolean,
        // required : true,
        default: true
    },
    userId: {
        type: String,
        required: true
    },
    userProfilePhoto: {
        type: String,
        required: true
    },
    totalUpvotes: {
        type: Number,
        default: 0
    },
    totalDownvotes: {
        type: Number,
        default: 0
    },
    upvotes: [comment_model_1.InfoSchema],
    downVotes: [comment_model_1.InfoSchema],
    comments: [comment_model_1.commentSchema]
}, {
    timestamps: true
});
exports.postModel = (0, mongoose_1.model)('Post', postSchema);
