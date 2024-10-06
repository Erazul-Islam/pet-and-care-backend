import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import config from "../../config";
import jwt, { JwtPayload } from 'jsonwebtoken'

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


const followConntroller = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const targetUserId = req.params.id; 
    const decoded = jwt.verify(token as string, config.jwtAccessSecret as string);

    const currentUserId = (decoded as JwtPayload)._id as string;
  
    const result = await userService.followUser(currentUserId, targetUserId);

  
    sendResponse(res, {
      statusCode: 200,
      status: 200,
      success: true,
      message: result.message,
      data: result
    });
  });
  
  const unfollowCoontroller = catchAsync(async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1];
    const targetUserId = req.params.id; 
    const decoded = jwt.verify(token as string, config.jwtAccessSecret as string);
    const currentUserId = (decoded as JwtPayload)._id as string;
  
    const result = await userService.unfollowUser(currentUserId, targetUserId);
  
    sendResponse(res, {
      statusCode: 200,
      status: 200,
      success: true,
      message: result.message,
      data: null
    });
  });


export const userController = {
    signUpRegistration,
    getProfile,
    getUpdatedUser,
    followConntroller,
    unfollowCoontroller
}