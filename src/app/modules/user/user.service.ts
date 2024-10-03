

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

const followUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) {
        throw new Error('You cannot follow yourself')
    }

    const currentUser = await User.findById(currentUserId)
    const targetUser = await User.findById(targetUserId)

    if (!currentUser || !targetUser) {
        throw new Error('User not found');
    }

    if (!currentUser.following.some(user => user.id === targetUserId)) {
        currentUser.following.push({
            id: targetUserId,
            email: targetUser.email,
            username: targetUser.name,
            profilePhoto: targetUser.profilePhoto
        });
        await currentUser.save();
    }

    // Check if current user is already a follower
    if (!targetUser.followers.some(user => user.id === currentUserId)) {
        targetUser.followers.push({
            id: currentUserId,
            email: currentUser.email,
            username: currentUser.name,
            profilePhoto: targetUser.profilePhoto
        });
        await targetUser.save();
    }

    return { message: 'Successfully followed the user' };
}

const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    if (currentUserId === targetUserId) {
        throw new Error('You cannot unfollow yourself');
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
        throw new Error('User not found');
    }

    // Remove targetUserId from currentUser's following array
    currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUserId
    );
    await currentUser.save();

    // Remove currentUserId from targetUser's followers array
    targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUserId
    );
    await targetUser.save();

    return { message: 'Successfully unfollowed the user' };
};



export const userService = {
    signUp,
    getMyProfile,
    getUpdatedUser,
    followUser,
    unfollowUser,
}