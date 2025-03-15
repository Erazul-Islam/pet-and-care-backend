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
exports.postService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const post_model_1 = require("./post.model");
const config_1 = __importDefault(require("../../config"));
const user_model_1 = require("../user/user.model");
const meilisearch_1 = require("../../utils/meilisearch");
const addPost = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const finduser = yield user_model_1.User.findOne({ email: decoded.email });
    const userEmail = finduser === null || finduser === void 0 ? void 0 : finduser.email;
    const userName = finduser === null || finduser === void 0 ? void 0 : finduser.name;
    const userId = finduser === null || finduser === void 0 ? void 0 : finduser._id;
    const userProfilePhoto = finduser === null || finduser === void 0 ? void 0 : finduser.profilePhoto;
    payload.userEmail = userEmail;
    payload.userName = userName;
    payload.userId = userId;
    payload.userProfilePhoto = userProfilePhoto;
    payload.comments = [];
    const result = yield post_model_1.postModel.create(payload);
    yield (0, meilisearch_1.addDocumentToIndex)(result, 'posts');
    return result;
});
const getAllPost = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.postModel.find();
    return result;
});
const getPaginatedPosts = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, pageSize = 1) {
    try {
        const skip = (page - 1) * pageSize;
        const posts = yield post_model_1.postModel.find().skip(skip).limit(pageSize);
        const totalPosts = yield post_model_1.postModel.countDocuments();
        const totalPages = Math.ceil(totalPosts / pageSize);
        return {
            posts,
            totalPosts,
            totalPages,
            currentPage: page,
            pageSize
        };
    }
    catch (err) {
        console.error(err);
        throw new Error('Failed to fetch posts with pagination');
    }
});
const getMyPostsByUserId = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const user = yield user_model_1.User.findOne({ email: decoded.email });
    const userId = user === null || user === void 0 ? void 0 : user._id;
    const result = yield post_model_1.postModel.find({ userId: userId });
    return result;
});
const addComment = (postId, text, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const finduser = yield user_model_1.User.findOne({ email: decoded.email });
    if (!finduser) {
        throw new Error("User not found");
    }
    const newComment = {
        userId: finduser._id.toString(),
        userName: finduser.name,
        userProfilePhoto: finduser.profilePhoto,
        text: text,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    const result = yield post_model_1.postModel.findByIdAndUpdate(postId, { $push: { comments: newComment } }, { new: true });
    if (!result) {
        throw new Error("Post not found");
    }
    return result;
});
const EditComment = (postId, commentId, text, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const finduser = yield user_model_1.User.findOne({ email: decoded.email });
    if (!finduser) {
        throw new Error("User not found");
    }
    const result = yield post_model_1.postModel.findOneAndUpdate({ _id: postId, "comments._id": commentId }, { $set: { "comments.$.text": text } }, { new: true });
    if (!result) {
        throw new Error("Post or comment not found");
    }
    return result;
});
const deleteComment = (postId, commentId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const findUser = yield user_model_1.User.findOne({ email: decoded.email });
    if (!findUser) {
        throw new Error("User not found");
    }
    const result = yield post_model_1.postModel.findOneAndUpdate({ _id: postId }, { $pull: { comments: { _id: commentId } } }, { new: true });
    if (!result) {
        throw new Error("Post not found or comment does not exist");
    }
    return result;
});
const upVotePost = (postId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const findUser = yield user_model_1.User.findOne({ email: decoded.email });
    if (!findUser) {
        throw new Error("User not found");
    }
    const userId = findUser === null || findUser === void 0 ? void 0 : findUser._id.toString();
    const post = yield post_model_1.postModel.findById(postId);
    const newInfo = {
        userId: findUser._id.toString(),
        userName: findUser.name,
        userProfilePhoto: findUser.profilePhoto,
    };
    console.log(newInfo);
    if (post === null || post === void 0 ? void 0 : post.upvotes.some((upvote) => upvote.userId === userId)) {
        return { message: "Already upvoted" };
    }
    yield post_model_1.postModel.findOneAndUpdate({ _id: postId, "downVotes.userId": userId }, { $pull: { downVotes: { userId } }, $inc: { totalDownvotes: -1 } });
    const result = yield post_model_1.postModel.findByIdAndUpdate(postId, {
        $inc: { totalUpvotes: 1 }, $push: { upvotes: newInfo }
    }, { new: true });
    return result;
});
const downvotePost = (postId, token) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtAccessSecret);
    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }
    const findUser = yield user_model_1.User.findOne({ email: decoded.email });
    if (!findUser) {
        throw new Error("User not found");
    }
    const userId = findUser === null || findUser === void 0 ? void 0 : findUser._id.toString();
    const post = yield post_model_1.postModel.findById(postId);
    const newInfo = {
        userId: findUser._id.toString(),
        userName: findUser.name,
        userProfilePhoto: findUser.profilePhoto,
    };
    console.log(newInfo);
    if (post === null || post === void 0 ? void 0 : post.downVotes.some((downVote) => downVote.userId === userId)) {
        return { message: "User has already downvoted this post" };
    }
    yield post_model_1.postModel.findOneAndUpdate({ _id: postId, "upvotes.userId": userId }, { $pull: { upvotes: { userId } }, $inc: { totalUpvotes: -1 } });
    const result = yield post_model_1.postModel.findByIdAndUpdate(postId, {
        $inc: { totalDownvotes: 1 }, $push: { downVotes: newInfo }
    }, { new: true });
    return result;
});
const deletePost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield post_model_1.postModel.findByIdAndDelete(id);
    console.log(result);
    const deletedItemId = result === null || result === void 0 ? void 0 : result._id;
    console.log(deletedItemId);
    if (deletedItemId) {
        yield (0, meilisearch_1.deleteDocumentFromIndex)('posts', deletedItemId.toString());
    }
    return result;
});
const unPublishPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.postModel.findById(id);
        if (!post) {
            return { message: 'Post is not Found' };
        }
        const unPublish = yield post_model_1.postModel.findByIdAndUpdate({ _id: id }, { isPublished: false }, { new: true });
        return unPublish;
    }
    catch (err) {
        console.log(err);
    }
});
const publishPost = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_model_1.postModel.findById(id);
        if (!post) {
            return { message: 'Post is not Found' };
        }
        const Publish = yield post_model_1.postModel.findByIdAndUpdate({ _id: id }, { isPublished: true }, { new: true });
        return Publish;
    }
    catch (err) {
        console.log(err);
    }
});
const searchPost = (searchTerm) => __awaiter(void 0, void 0, void 0, function* () {
    const searchAbleFields = ["caption"];
    let query = {};
    if (searchTerm) {
        query = {
            $or: searchAbleFields.map((field) => ({ [field]: { $regex: searchTerm, $options: "i" } }))
        };
        console.log(query);
    }
    const result = yield post_model_1.postModel.find(query);
    return result;
});
const sharePost = (postId) => __awaiter(void 0, void 0, void 0, function* () {
    const post = post_model_1.postModel.findById(postId);
    return post;
});
exports.postService = {
    addPost,
    getAllPost,
    addComment,
    EditComment,
    deleteComment,
    deletePost,
    upVotePost,
    downvotePost,
    unPublishPost,
    publishPost,
    searchPost,
    getMyPostsByUserId,
    sharePost,
    getPaginatedPosts
};
