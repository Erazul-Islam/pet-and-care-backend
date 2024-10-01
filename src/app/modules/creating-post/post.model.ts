import { model, Schema } from "mongoose";
import { TPost } from "./post.interface";
import { commentSchema } from "../comment/comment.model";


const postSchema = new Schema<TPost>(
    {
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
        userId: {
            type: String,
            required: true
        },
        userProfilePhoto: {
            type: String,
            required: true
        },
        comments: [commentSchema]

    },
    {
        timestamps: true
    }
)

export const postModel = model<TPost>('Post', postSchema)