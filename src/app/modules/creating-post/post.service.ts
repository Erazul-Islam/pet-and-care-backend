import jwt from 'jsonwebtoken'
import { TPost } from "./post.interface";
import { postModel } from "./post.model";
import config from '../../config';
import { User } from '../user/user.model';
import { TComment } from '../comment/comment.interface';


const addPost = async (payload: TPost, token: string) => {

    const decoded = jwt.verify(token, config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const finduser = await User.findOne({ email: decoded.email })

    const userEmail = finduser?.email
    const userName = finduser?.name
    const userId = finduser?._id
    const userProfilePhoto = finduser?.profilePhoto

    payload.userEmail = userEmail as string
    payload.userName = userName as string
    payload.userId = userId as string
    payload.userProfilePhoto = userProfilePhoto as string
    payload.comments = []

    const result = await postModel.create(payload)
    return result
}

const getAllPost = async () => {
    const result = await postModel.find().populate("comments.userId", "name profilePhoto")
    return result
}

const addComment = async (postId: string, text: string, token: string) => {
    const decoded = jwt.verify(token, config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const finduser = await User.findOne({ email: decoded.email })

    if (!finduser) {
        throw new Error("User not found")
    }

    const newComment: TComment = {
        _id: finduser?._id,
        userId: finduser._id.toString(),
        userName: finduser.name,
        userProfilePhoto: finduser.profilePhoto,
        text: text,
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const result = await postModel.findByIdAndUpdate(postId, { $push: { comments: newComment } }, { new: true })

    if (!result) {
        throw new Error("Post not found");
    }

    return result
}

const EditComment = async (postId: string, commentId: string, text: string, token: string) => {
    const decoded = jwt.verify(token, config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const finduser = await User.findOne({ email: decoded.email })

    if (!finduser) {
        throw new Error("User not found")
    }

    const result = await postModel.findOneAndUpdate(
        { _id: postId, "comments._id": commentId },
        { $set: { "comments.$.text": text } },
        { new: true }
    )

    if (!result) {
        throw new Error("Post or comment not found");
    }

    return result;
}

export const postService = {
    addPost,
    getAllPost,
    addComment,
    EditComment
}