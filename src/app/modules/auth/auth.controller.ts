import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authService } from "./auth.service";
import { Request, Response } from "express";

const loginUser = catchAsync(async (req, res) => {

    const result = await authService.loginUser(req.body)

    const User = {
        _id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        mobileNumber: result.user.mobileNumber,
        address: result.user.address,
        profilePhoto: result.user.profilePhoto,
        role: result.user.role,
    }

    res.status(200).json({
        success: true,
        statusCode: 200,
        message: `${User.name} logged in successfully`,
        accessToken: result.accessToken,
        data: User
    })

})

const changePassword = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const passwordData = req.body;

    const result = await authService.changePassword(userId, passwordData);
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: ` password updated successfully`,
        data: result
    })
});

const forgetPassword = catchAsync(async (req, res) => {
    const email = req.body.email;
    const result = await authService.forgetPassword(email);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Reset link is generated succesfully!',
        data: result,
        status: 200
    });
});


const resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const token = req.params.token
    const password = req.body.password


    if (!token || !password) {
        res.status(400).json({ message: 'Token and new password are required' });
        return;
    }


    const message = await authService.resetPassword(token, password)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Reset succesfully!',
        data: message,
        status: 200
    });

})

export const authController = {
    loginUser,
    changePassword,
    forgetPassword,
    resetPassword
}