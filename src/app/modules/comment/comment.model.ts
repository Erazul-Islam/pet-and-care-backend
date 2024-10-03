import { Schema } from "mongoose"
import { TComment, TInfo } from "./comment.interface"

export const commentSchema = new Schema<TComment>(
    {
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
        ,
        userProfilePhoto: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

export const InfoSchema = new Schema<TInfo>(
    {
        userId: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true
        }
        ,
        userProfilePhoto: {
            type: String,
            required: true,
        },
    }
)