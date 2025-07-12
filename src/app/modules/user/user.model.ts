/* eslint-disable @typescript-eslint/no-this-alias */
import mongoose, { model, Schema } from "mongoose";
import { TUser, UserModel } from "./user.interface";
import bcrypt from 'bcrypt'
import config from "../../config";

const userSchema = new Schema<TUser, UserModel>(
    {
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
        },
        address: {
            type: String,
        },
        friendRequest: [
            {
                sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
                status: { type: String, enum: ["pending", "accepted", "declined"], default: "pending" },
                senderProfilePhoto : {type : String, required : true},
                senderName : {type : String, required : true}
            }
        ],
        friend: [
            {
                id: { type: Schema.Types.ObjectId, ref: "User", required: true },
                email: { type: String, required: true },
                username: { type: String, required: true },
                profilePhoto: { type: String },
            }
        ],
        followers: [{
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'pet_care_user' },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String }
        }],
        following: [{
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'pet_care_user' },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String, }
        }]
    },
    {
        timestamps: true,
    },
);


userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );

    next();
});


userSchema.statics.isUSerExistByCustomEmial = async function (email: string) {
    return await User.findOne({ email }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (plainTextPass: string, hashedPass: string) {
    return await bcrypt.compare(plainTextPass, hashedPass)
}

export const User = model<TUser, UserModel>('pet_care_user', userSchema);