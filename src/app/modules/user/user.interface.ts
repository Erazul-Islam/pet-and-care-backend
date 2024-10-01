import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface TUser {
    _id: string,
    name: string,
    email: string,
    password: string,
    mobileNumber: string,
    profilePhoto: string,
    address: string,
    createdAt: Date,
    updatedAt: Date,
    role: 'ADMIN' | 'USER',
    followers: Array<{
        id: string;        
        email: string;     
        username: string; 
    }>;
    following: Array<{
        id: string;        
        email: string;     
        username: string; 
    }>;
};

export interface UserModel extends Model<TUser> {
    // myStaticMethod(): number
    isUSerExistByCustomEmial(email: string): Promise<TUser>
    isPasswordMatched(plainTextPass: string, hashedPass: string): Promise<boolean>
}



export type TUserRole = keyof typeof USER_ROLE