import { model, Schema } from "mongoose";
import { TPost } from "./post.interface";


const postSchema = new Schema<TPost>(
    {
        postId: {
            type: String,
            required: true
        },
        userEmail: {
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
        }
    },
    {
        timestamps: true
    }
)

export const postModel = model<TPost>('Post', postSchema)