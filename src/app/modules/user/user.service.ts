

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
    const targetUser = await User.findById(targetUserId);

    if (!currentUser || !targetUser) {
        throw new Error('User not found');
    }


    const isFollowing = currentUser.following.some(user => user.id.toString() === targetUserId);
    if (!isFollowing) {
        throw new Error('You are not following this user');
    }


    currentUser.following = currentUser.following.filter(
        (user) => user.id.toString() !== targetUserId
    );
    await currentUser.save();


    targetUser.followers = targetUser.followers.filter(
        (user) => user.id.toString() !== currentUserId
    );
    await targetUser.save();

    return { message: 'Successfully unfollowed the user' };
};


const getUpdatedUserRole = async (id: string) => {
    try {
        const user = await User.findById(id)

        if (!user) {
            return { message: 'User not Found' }
        }

        if (user.role === "ADMIN") {
            throw new Error("Cannot change role of an admin")
        }

        const updatedUser = await User.findByIdAndUpdate({ _id: id }, { role: "ADMIN" }, { new: true })

        return updatedUser
    }
    catch (err) {
        console.log(err)
    }
}


const requestFriend = async (senderId: string, receiverId: string) => {


    if (!senderId) {
        console.log("Invalid id")
    }
    if (!receiverId) {
        console.log("Invalid rec id")
    }

    const sender = await User.findById(senderId)

    const receiver = await User.findById(receiverId)
    const senderProfilePhoto = sender?.profilePhoto
    const senderName = sender?.name
 
    if (!sender || !receiver) {
        throw new Error("User not found");
    }

    const existingRequest = receiver?.friendRequest.find(
        (req) => req.sender.toString() === senderId
    );

    if (existingRequest) {
        throw new Error("Friend request already sent");
    }

    receiver?.friendRequest.push({ sender: senderId, status: 'pending', senderProfilePhoto: senderProfilePhoto, senderName: senderName })
    const result = await receiver?.save()

    return result

}


const acceptFriendRequest = async (userId: string, senderId: string) => {
    const user = await User.findById(userId)
    const sender = await User.findById(senderId)

    console.log('user id',user)
    console.log('sender id',senderId)

    if (!user || !sender) {
        throw new Error("User not found.");
    }

    const friendRequest = user.friendRequest.find(
        (req) => req.sender.toString() === senderId && req.status === 'pending'
    )

    if (!friendRequest) {
        throw new Error('No pending friend request')
    }

    friendRequest.status = 'accepted'

    user.friend.push({
        id: senderId,
        email: sender.email,
        username: sender.name,
        profilePhoto: sender.profilePhoto
    })

    sender.friend.push({
        id: senderId,
        email: sender.email,
        username: sender.name,
        profilePhoto: sender.profilePhoto
    })

    const result = await user.save()
    await sender.save()

    return result
}

const viewFriendRequest = async (userId :string) => {
    const user = await User.findById(userId)

    if(!user){
        throw new Error ('User not found')
    }

    const result = await user.friendRequest.filter((req) => req.status === 'pending')

    return result
} 

const viewFriend = async (userId:string) => {
    const user = await User.findById(userId)

    if(!user){
        throw new Error ('User not found')
    }

    const result = user.friend

    return result

}

const deleteUser = async (id: string) => {
    const result = await User.deleteOne({ _id: id })

    return result
}

const getAllProfileFromDB = async () => {
    try {
        const result = await User.find();
        return result;
    } catch (err) {
        console.error("Error retrieving profiles:", err);
        throw err; 
    }
}

const getPaginatedUserFromDB = async (page=1,pageSize=1) => {
    try{
        const skip = (page - 1) * pageSize
        const users = await User.find().skip(skip).limit(pageSize)
        const totalUsers = await User.countDocuments()
        const totalPages = Math.ceil(totalUsers/pageSize)

        return {
            users,
            totalUsers,
            totalPages,
            currentPage : page,
            pageSize
        }
    }
    catch (err){
        console.log(err)
        throw new Error ('Something went wrong')
    }
}

const getSingleProfile = async (id:string) => {
   

    const result = await User.findById(id)

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
    getAllProfileFromDB,
    requestFriend,
    acceptFriendRequest,
    viewFriendRequest,
    viewFriend,
    getSingleProfile,
    getPaginatedUserFromDB
}