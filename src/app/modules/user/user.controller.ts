import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";

const signUpRegistration = catchAsync(async (req: Request, res: Response) => {
    const result = await userService.signUp(req.body)
    sendResponse(res, {
        statusCode: 201,
        status: 201,
        success: true,
        message: 'User Registration Successfully',
        data: result
    })
})

const getProfile = async (req: Request, res: Response) => {
    try {

        const token = req.headers.authorization?.split(' ')[1]
        const result = await userService.getMyProfile(token as string)

        res.status(200).json({
            success: true,
            message: "User profile retrived successfully!",
            data: result
        })
    } catch (err) {
        console.log(err)
    }

};

const getUpdatedUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]
    const updatedData = req.body

    try {
        const updatedUser = await userService.getUpdatedUser(token as string, updatedData)
        console.log(updatedUser)

        res.status(200).json({
            success: true,
            message: "user updated successfully!",
            data: updatedUser
        })
    } catch (err) {
        console.log(err)
    }
}


export const userController = {
    signUpRegistration,
    getProfile,
    getUpdatedUser
}