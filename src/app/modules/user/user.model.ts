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
            required: true
        },
        mobileNumber: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        followers: [{
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'pet_care_user' }, 
            email: { type: String, required: true },
            username: { type: String, required: true } 
        }],
        following: [{
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'pet_care_user' }, 
            email: { type: String, required: true },
            username: { type: String, required: true } 
        }]
    },
    {
        timestamps: true,
    },
);

// userSchema.set('toJSON', {
//     transform: (doc, ret, options) => {
//         delete ret.password;
//         return ret;
//     }
// })

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB

    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );

    next();
});

// userSchema.post('save', function (doc, next) {
//     doc.password = '';
//     next();
// });

userSchema.statics.isUSerExistByCustomEmial = async function (email: string) {
    return await User.findOne({ email }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (plainTextPass: string, hashedPass: string) {
    return await bcrypt.compare(plainTextPass, hashedPass)
}

export const User = model<TUser, UserModel>('pet_care_user', userSchema);