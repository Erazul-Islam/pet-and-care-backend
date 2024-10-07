

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

    const isAlreadyFollowing = currentUser.following.some(user => user.id.toString() === targetUserId)

    if (isAlreadyFollowing) {
        return { message: "You are already following" }
    }

    if (!currentUser.following.some(user => user.id.toString() === targetUserId)) {
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
            profilePhoto: currentUser.profilePhoto
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
    console.log("Current User:", currentUser);
    const targetUser = await User.findById(targetUserId);
    console.log("Target User:", targetUser);

    if (!currentUser || !targetUser) {
        throw new Error('User not found');
    }

    // Check if currentUser is actually following the targetUser
    const isFollowing = currentUser.following.some(user => user.id.toString() === targetUserId);
    if (!isFollowing) {
        throw new Error('You are not following this user');
    }

    // Remove targetUserId from currentUser's following array
    currentUser.following = currentUser.following.filter(
        (user) => user.id.toString() !== targetUserId
    );
    await currentUser.save();
    console.log("Updated Following:", currentUser.following);

    // Remove currentUserId from targetUser's followers array
    targetUser.followers = targetUser.followers.filter(
        (user) => user.id.toString() !== currentUserId
    );
    await targetUser.save();
    console.log("Updated Followers:", targetUser.followers);

    return { message: 'Successfully unfollowed the user' };
};


const getUpdatedUserRole = async (id: string) => {
    try {
        const user = await User.findById(id)

        if(!user){
            return {message:'User not Found'}
        }

        if(user.role === "ADMIN"){
            throw new Error ("Cannot change role of an admin")
        }

        const updatedUser = await User.findByIdAndUpdate({_id:id}, {role : "ADMIN"}, {new : true})

        return updatedUser
    }
    catch (err) {
        console.log(err)
    }
}


const deleteUser = async (id:string) => {
    const result = await User.deleteOne({_id : id})

    return result
}

const getAllProfileFromDB = async () => {
    const result = await User.find()
    return result
}


export const userService = {
    signUp,
    getMyProfile,
    getUpdatedUser,
    followUser,
    unfollowUser,
    getUpdatedUserRole,
    deleteUser,
    getAllProfileFromDB
}