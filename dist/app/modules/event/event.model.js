"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventModel = void 0;
const mongoose_1 = require("mongoose");
const InterestedSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    profilePhoto: {
        type: String,
        required: true
    },
});
const eventSchema = new mongoose_1.Schema({
    userName: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true
    },
    userPhoto: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    host: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        // required: true,
        default: Date
    },
    endDate: {
        type: Date,
        required: true
    },
    endTime: {
        type: String,
        // required: true
    },
    picture: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['classic', 'comedy', 'sports', 'fitness', 'dance', 'films', 'parties'],
        required: true,
    },
    details: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['started', 'ended'],
        default: 'started'
    },
    interested: {
        type: [InterestedSchema],
        default: []
    },
    going: {
        type: [InterestedSchema],
        default: []
    },
}, {
    timestamps: true
});
exports.eventModel = (0, mongoose_1.model)('event', eventSchema);
