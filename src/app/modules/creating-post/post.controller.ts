import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { postService } from "./post.service";
import sendResponse from "../../utils/sendResponse";


const addPostController = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization?.split(' ')[1];

    const result = await postService.addPost(req.body, token as string)

    console.log(result)

    sendResponse(res, {
        success: true,
        status: 200,
        message: 'Post Added successfully',
        data: result,
        statusCode: 200
    })
})

const addCommentController = catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params
    const { comments } = req.body

    const text = comments[0].text

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return sendResponse(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }


    const updatedPost = await postService.addComment(postId, text, token as string);

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Comment added successfully",
        data: updatedPost,
        statusCode: 200,
    });
})



const editCommentController = catchAsync(async (req: Request, res: Response) => {
    const { postId, commentId } = req.params
    const { comments } = req.body

    const text = comments[0].text

    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return sendResponse(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }

    const updatedComment = await postService.EditComment(postId, commentId, text, token as string)

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Comment updated successfully",
        data: updatedComment,
        statusCode: 200,
    });
})


const getAllScrollPostFromDB = async (req: Request, res: Response) => {
    try {

        const result = await postService.getScrollAllPost()

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Post retrived successfully",
            data: result,
        })
    } catch (err) {
        console.log(err)
    }
}
const getAllPostFromDB = async (req: Request, res: Response) => {
    try {

        const result = await postService.getAllPost()

        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Post retrived successfully",
            data: result,
        })
    } catch (err) {
        console.log(err)
    }
}
// const getAllPostFromDB = async (req: Request, res: Response) => {
//     try {

//         const { page = 1, limit = 5 } = req.query

//         const result = await postService.getAllPost(page as number, limit as number)
//         const hasMore = result.length === limit

//         res.status(200).json({
//             statusCode: 200,
//             success: true,
//             message: "Post retrived successfully",
//             data: result,
//             hasMore
//         })
//     } catch (err) {
//         console.log(err)
//     }
// }

const deleteCommentController = catchAsync(async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return sendResponse(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }

    const updatedPost = await postService.deleteComment(postId, commentId, token as string);

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Comment deleted successfully",
        data: updatedPost,
        statusCode: 200,
    });
});

const deletePostController = async (req: Request, res: Response) => {
    try {
        const postId = req.params.postId

        const result = await postService.deletePost(postId)

        res.status(200).json({
            success: true,
            message: "Post deleted successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}

const upvoteController = async (req: Request, res: Response) => {
    const postId = req.params.postId
    const token = req.headers.authorization?.split(" ")[1];

    const result = await postService.upVotePost(postId, token as string)

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Post upvoted successfully",
        statusCode: 200,
        data: result
    })
}

const downVoteController = async (req: Request, res: Response) => {
    const postId = req.params.postId
    const token = req.headers.authorization?.split(" ")[1];

    const result = await postService.downvotePost(postId, token as string)

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Post downvoted successfully",
        statusCode: 200,
        data: result
    })
}

const unPublishController = async (req: Request, res: Response) => {
    const postId = req.params.postId

    try {
        const unPublish = await postService.unPublishPost(postId)

        res.status(200).json({
            success: true,
            message: "unPublished post successfully",
            data: unPublish,
        })
    } catch (err) {
        console.log(err)
    }
}


const PublishController = async (req: Request, res: Response) => {
    const postId = req.params.postId

    try {
        const Publish = await postService.publishPost(postId)

        res.status(200).json({
            success: true,
            message: "Published post successfully",
            data: Publish,
        })
    } catch (err) {
        console.log(err)
    }
}


const searchProductsController = async (req: Request, res: Response) => {
    const { searchTerm } = req.query
    console.log(searchTerm)
    if (searchTerm) {
        try {
            const result = await postService.searchPost(searchTerm as string)
            res.status(200).json({
                success: true,
                message: 'Search product',
                data: result
            })
        }
        catch (err) {
            res.status(500).json({
                success: false,
                message: " search something went wrong",
                error: err,
            });
        }
    }
}



export const postController = {
    addPostController,
    getAllPostFromDB,
    addCommentController,
    editCommentController,
    deleteCommentController,
    deletePostController,
    upvoteController,
    downVoteController,
    unPublishController,
    PublishController,
    getAllScrollPostFromDB,
    searchProductsController
}