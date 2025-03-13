import jwt from 'jsonwebtoken'
import { TPost } from "./post.interface";
import { postModel } from "./post.model";
import config from '../../config';
import { User } from '../user/user.model';
import { TComment, TInfo } from '../comment/comment.interface';
import { addDocumentToIndex, deleteDocumentFromIndex } from '../../utils/meilisearch';


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


    await addDocumentToIndex(result, 'posts')

    return result
}
const getAllPost = async () => {
    const result = await postModel.find()
    return result
}

const getPaginatedPosts = async (page = 1, pageSize = 1) => {
    try {
        const skip = (page - 1) * pageSize
        const posts = await postModel.find().skip(skip).limit(pageSize)

        const totalPosts = await postModel.countDocuments()

        const totalPages = Math.ceil(totalPosts/pageSize)

        return {
            posts,
            totalPosts,
            totalPages,
            currentPage : page,
            pageSize
        }
    }
    catch (err){
        console.error(err);
        throw new Error('Failed to fetch posts with pagination');
    }
}

const getMyPostsByUserId = async (token:string) => {

    const decoded = jwt.verify(token, config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const user = await User.findOne({ email: decoded.email })
    const userId = user?._id
    const result = await postModel.find({userId : userId})
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

const deleteComment = async (postId: string, commentId: string, token: string) => {
    const decoded = jwt.verify(token, config.jwtAccessSecret as string);

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const findUser = await User.findOne({ email: decoded.email });
    if (!findUser) {
        throw new Error("User not found");
    }

    const result = await postModel.findOneAndUpdate(
        { _id: postId },
        { $pull: { comments: { _id: commentId } } },
        { new: true }
    );

    if (!result) {
        throw new Error("Post not found or comment does not exist");
    }

    return result;
};

const upVotePost = async (postId: string, token: string) => {

    const decoded = jwt.verify(token, config.jwtAccessSecret as string);

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const findUser = await User.findOne({ email: decoded.email });
    if (!findUser) {
        throw new Error("User not found");
    }

    const userId = findUser?._id.toString()
    const post = await postModel.findById(postId)

    const newInfo: TInfo = {
        userId: findUser._id.toString(),
        userName: findUser.name,
        userProfilePhoto: findUser.profilePhoto,
    }

    console.log(newInfo)

    if (post?.upvotes.some((upvote) => upvote.userId === userId)) {

        return { message: "Already upvoted" }
    }

    await postModel.findOneAndUpdate(
        { _id: postId, "downVotes.userId": userId },
        { $pull: { downVotes: { userId } }, $inc: { totalDownvotes: -1 } }
    )

    const result = await postModel.findByIdAndUpdate(postId,
        {
            $inc: { totalUpvotes: 1 }, $push: { upvotes: newInfo }
        },
        { new: true })

    return result
}

const downvotePost = async (postId: string, token: string) => {
    const decoded = jwt.verify(token, config.jwtAccessSecret as string);

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const findUser = await User.findOne({ email: decoded.email });
    if (!findUser) {
        throw new Error("User not found");
    }

    const userId = findUser?._id.toString()
    const post = await postModel.findById(postId)

    const newInfo: TInfo = {
        userId: findUser._id.toString(),
        userName: findUser.name,
        userProfilePhoto: findUser.profilePhoto,
    }

    console.log(newInfo)

    if (post?.downVotes.some((downVote) => downVote.userId === userId)) {

        return { message: "User has already downvoted this post" }
    }

    await postModel.findOneAndUpdate(
        { _id: postId, "upvotes.userId": userId },
        { $pull: { upvotes: { userId } }, $inc: { totalUpvotes: -1 } }
    )

    const result = await postModel.findByIdAndUpdate(postId,
        {
            $inc: { totalDownvotes: 1 }, $push: { downVotes: newInfo }
        },
        { new: true })

    return result
}


const deletePost = async (id: string) => {
    const result = await postModel.findByIdAndDelete(id)
    console.log(result)

    const deletedItemId = result?._id
    console.log(deletedItemId)

    if (deletedItemId) {
        await deleteDocumentFromIndex('posts', deletedItemId.toString())
    }

    return result
}


const unPublishPost = async (id: string) => {
    try {
        const post = await postModel.findById(id)

        if (!post) {
            return { message: 'Post is not Found' }
        }

        const unPublish = await postModel.findByIdAndUpdate({ _id: id }, { isPublished: false }, { new: true })

        return unPublish
    }
    catch (err) {
        console.log(err)
    }
}

const publishPost = async (id: string) => {
    try {
        const post = await postModel.findById(id)

        if (!post) {
            return { message: 'Post is not Found' }
        }

        const Publish = await postModel.findByIdAndUpdate({ _id: id }, { isPublished: true }, { new: true })

        return Publish
    }
    catch (err) {
        console.log(err)
    }
}


const searchPost = async (searchTerm: string) => {
    const searchAbleFields = ["caption"];
    let query = {};
    if (searchTerm) {
        query = {
            $or:
                searchAbleFields.map((field) => ({ [field]: { $regex: searchTerm, $options: "i" } }))

        };
        console.log(query)
    }

    const result = await postModel.find(query);
    return result;
};

const sharePost = async (postId: string) => {
    const post = postModel.findById(postId)

    return post
}


export const postService = {
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
}