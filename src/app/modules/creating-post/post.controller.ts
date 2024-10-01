import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { postService } from "./post.service";
import sendResponse from "../../utils/sendResponse";


const addPostController = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization?.split(' ')[1];

    const result = await postService.addPost(req.body, token as string)

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

    const updatedComment = await postService.EditComment(postId,commentId,text, token as string)

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Comment updated successfully",
        data: updatedComment,
        statusCode: 200,
    });
})


const getAllPostFromDB = async (req: Request, res: Response) => {
    try {
        const result = await postService.getAllPost()
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Post retrived successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}

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


export const postController = {
    addPostController,
    getAllPostFromDB,
    addCommentController,
    editCommentController,
    deleteCommentController
}