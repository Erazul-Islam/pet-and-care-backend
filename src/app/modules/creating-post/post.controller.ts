import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { postService } from "./post.service";
import sendResponse from "../../utils/sendResponse";


const addPostController = catchAsync(async (req:Request,res:Response) => {

    const token = req.headers.authorization?.split(' ')[1];

    const result = await postService.addPost(req.body,token as string)

    sendResponse(res, {
        success:true,
        status: 200,
        message: 'Post Added successfully',
        data: result,
        statusCode: 200
    })
})

export const postController = {
    addPostController
}