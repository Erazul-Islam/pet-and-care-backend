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
            required: true
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        coverPhoto : {
            type : String,
            default: ''
        },
        intro : {
            type : String,
            default: ''
        },
        college : {
            type : String,
            default: ''
        },
        university : {
            type : String,
            default: ''
        },
        lives : {
            type : String,
            default: ''
        },
        from : {
            type : String,
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
        followers: [{
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'pet_care_user' },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String, required: true }
        }],
        following: [{
            id: { type: mongoose.Schema.Types.ObjectId, ref: 'pet_care_user' },
            email: { type: String, required: true },
            username: { type: String, required: true },
            profilePhoto: { type: String, required: true }
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

// userSchema.pre('save', async function (next) {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const user = this; // doc
//     // hashing password and save into DB

//     user.password = await bcrypt.hash(
//         user.password,
//         Number(config.bcrypt_salt_rounds),
//     );

//     next();
// });

userSchema.pre('save', async function (next) {
    const user = this; // doc

    if (!user.isModified('password')) {
        return next();
    }
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

// userSchema.statics.isUserExistsByCustomId = async function (id: string) {
//     return await User.findOne({ id }).select('+password');
// };

userSchema.statics.isUSerExistByCustomEmial = async function (email: string) {
    return await User.findOne({ email }).select('+password')
}

userSchema.statics.isPasswordMatched = async function (plainTextPass: string, hashedPass: string) {
    return await bcrypt.compare(plainTextPass, hashedPass)
}

export const User = model<TUser, UserModel>('pet_care_user', userSchema);