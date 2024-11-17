import { model, Schema } from "mongoose";
import { IInterested, TEvent } from "./event.interface";

const InterestedSchema = new Schema<IInterested>(
    {
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
    }
);


const eventSchema = new Schema<TEvent>(
    {
        userName : {
            type : String,
            required : true,
        },
        userId : {
            type : String,
            required : true
        },
        userPhoto : {
            type : String,
            required : true
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
            default : 'started'
        },
        interested: {
            type: [InterestedSchema],
            default: []
        },
        going: {
            type: [InterestedSchema],
            default: []
        },
    },

    {
        timestamps: true
    }
)

export const eventModel = model<TEvent>('event', eventSchema)