

import jwt from 'jsonwebtoken'
import { TUser } from './user.interface';
import { User } from './user.model';
import config from '../../config';


const signUp = async (payload: TUser) => {
    const result = await User.create(payload)
    return result
}



const getMyProfile = async (token: string) => {
    try {

        const decoded = jwt.verify(token, config.jwtAccessSecret as string)

        if (typeof decoded === 'string' || !('email' in decoded)) {
            throw new Error('Invalid token structure');
        }

        const userEmail = decoded.email

        const user = await User.findOne({ email: userEmail });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        throw new Error('Invalid token');
    }
};

const getUpdatedUser = async (token: string, payload: Partial<TUser>) => {
    try {
        const decoded = jwt.verify(token, config.jwtAccessSecret as string)

        if (typeof decoded === 'string' || !('email' in decoded)) {
            throw new Error('Invalid token structure');
        }

        const userEmail = decoded.email
        const updatedUser = await User.findOneAndUpdate({ email: userEmail }, payload, { new: true })
        
        return updatedUser
    } catch (error) {
        console.log(error)
    }
}

export const userService = {
    signUp,
    getMyProfile,
    getUpdatedUser
}