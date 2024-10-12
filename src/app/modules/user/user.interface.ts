import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    mobileNumber: string,
    profilePhoto: string,
    coverPhoto: string,
    intro: string,
    college: string,
    university: string,
    lives: string,
    from: string,
    isPremium: boolean,
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
    address: string,
    createdAt: Date,
    updatedAt: Date,
    role: 'ADMIN' | 'USER',
    followers: Array<{
        id: string;
        email: string;
        username: string;
        profilePhoto: string
    }>;
    following: Array<{
        id: string;
        email: string;
        username: string;
        profilePhoto: string
    }>;
};

export interface UserModel extends Model<TUser> {
    isUserExistsByCustomId(id: string): Promise<TUser>
    isUSerExistByCustomEmial(email: string): Promise<TUser>
    isPasswordMatched(plainTextPass: string, hashedPass: string): Promise<boolean>
}



export type TUserRole = keyof typeof USER_ROLE