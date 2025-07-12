"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("./user.model");
const config_1 = __importDefault(require("../../config"));
const signUp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getMyProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        if (typeof decoded === 'string' || !('email' in decoded)) {
            throw new Error('Invalid token structure');
        }
        const userEmail = decoded.email;
        const user = yield user_model_1.User.findOne({ email: userEmail });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        throw new Error('Invalid token');
    }
});
const getUpdatedUser = (token, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
        if (typeof decoded === 'string' || !('email' in decoded)) {
            throw new Error('Invalid token structure');
        }
        const userEmail = decoded.email;
        const updatedUser = yield user_model_1.User.findOneAndUpdate({ email: userEmail }, payload, { new: true });
        return updatedUser;
    }
    catch (error) {
        console.log(error);
    }
});
const followUser = (currentUserId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUserId === targetUserId) {
        throw new Error('You cannot follow yourself');
    }
    const currentUser = yield user_model_1.User.findById(currentUserId);
    const targetUser = yield user_model_1.User.findById(targetUserId);
    if (!currentUser || !targetUser) {
        throw new Error('User not found');
    }
    const isAlreadyFollowing = currentUser.following.some(user => user.id.toString() === targetUserId);
    if (isAlreadyFollowing) {
        return { message: "You are already following" };
    }
    if (!currentUser.following.some(user => user.id.toString() === targetUserId)) {
        currentUser.following.push({
            id: targetUserId,
            email: targetUser.email,
            username: targetUser.name,
            profilePhoto: targetUser.profilePhoto
        });
        yield currentUser.save();
    }
    // Check if current user is already a follower
    if (!targetUser.followers.some(user => user.id === currentUserId)) {
        targetUser.followers.push({
            id: currentUserId,
            email: currentUser.email,
            username: currentUser.name,
            profilePhoto: currentUser.profilePhoto
        });
        yield targetUser.save();
    }
    return { message: 'Successfully followed the user' };
});
const unfollowUser = (currentUserId, targetUserId) => __awaiter(void 0, void 0, void 0, function* () {
    if (currentUserId === targetUserId) {
        throw new Error('You cannot unfollow yourself');
    }
    const currentUser = yield user_model_1.User.findById(currentUserId);
    console.log("Current User:", currentUser);
    const targetUser = yield user_model_1.User.findById(targetUserId);
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
    currentUser.following = currentUser.following.filter((user) => user.id.toString() !== targetUserId);
    yield currentUser.save();
    console.log("Updated Following:", currentUser.following);
    // Remove currentUserId from targetUser's followers array
    targetUser.followers = targetUser.followers.filter((user) => user.id.toString() !== currentUserId);
    yield targetUser.save();
    console.log("Updated Followers:", targetUser.followers);
    return { message: 'Successfully unfollowed the user' };
});
const getUpdatedUserRole = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(id);
        if (!user) {
            return { message: 'User not Found' };
        }
        if (user.role === "ADMIN") {
            throw new Error("Cannot change role of an admin");
        }
        const updatedUser = yield user_model_1.User.findByIdAndUpdate({ _id: id }, { role: "ADMIN" }, { new: true });
        return updatedUser;
    }
    catch (err) {
        console.log(err);
    }
});
const requestFriend = (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
    if (!senderId) {
        console.log("Invalid id");
    }
    if (!receiverId) {
        console.log("Invalid rec id");
    }
    const sender = yield user_model_1.User.findById(senderId);
    const receiver = yield user_model_1.User.findById(receiverId);
    const senderProfilePhoto = sender === null || sender === void 0 ? void 0 : sender.profilePhoto;
    const senderName = sender === null || sender === void 0 ? void 0 : sender.name;
    if (!sender || !receiver) {
        throw new Error("User not found");
    }
    const existingRequest = receiver === null || receiver === void 0 ? void 0 : receiver.friendRequest.find((req) => req.sender.toString() === senderId);
    if (existingRequest) {
        throw new Error("Friend request already sent");
    }
    receiver === null || receiver === void 0 ? void 0 : receiver.friendRequest.push({ sender: senderId, status: 'pending', senderProfilePhoto: senderProfilePhoto, senderName: senderName });
    const result = yield (receiver === null || receiver === void 0 ? void 0 : receiver.save());
    return result;
});
const acceptFriendRequest = (userId, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    const sender = yield user_model_1.User.findById(senderId);
    console.log('user id', user);
    console.log('sender id', senderId);
    if (!user || !sender) {
        throw new Error("User not found.");
    }
    const friendRequest = user.friendRequest.find((req) => req.sender.toString() === senderId && req.status === 'pending');
    if (!friendRequest) {
        throw new Error('No pending friend request');
    }
    friendRequest.status = 'accepted';
    user.friend.push({
        id: senderId,
        email: sender.email,
        username: sender.name,
        profilePhoto: sender.profilePhoto
    });
    sender.friend.push({
        id: senderId,
        email: sender.email,
        username: sender.name,
        profilePhoto: sender.profilePhoto
    });
    const result = yield user.save();
    yield sender.save();
    return result;
});
const viewFriendRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const result = yield user.friendRequest.filter((req) => req.status === 'pending');
    return result;
});
const viewFriend = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const result = user.friend;
    return result;
});
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.deleteOne({ _id: id });
    return result;
});
const getAllProfileFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.User.find();
        return result;
    }
    catch (err) {
        console.error("Error retrieving profiles:", err);
        throw err;
    }
});
const getPaginatedUserFromDB = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 1) {
    try {
        const skip = (page - 1) * pageSize;
        const users = yield user_model_1.User.find().skip(skip).limit(pageSize);
        const totalUsers = yield user_model_1.User.countDocuments();
        const totalPages = Math.ceil(totalUsers / pageSize);
        return {
            users,
            totalUsers,
            totalPages,
            currentPage: page,
            pageSize
        };
    }
    catch (err) {
        console.log(err);
        throw new Error('Something went wrong');
    }
});
const getSingleProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
exports.userService = {
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
};
