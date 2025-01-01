import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { userService } from "./user.service";
import config from "../../config";
import jwt, { JwtPayload } from 'jsonwebtoken'

const signUpRegistration = catchAsync(async (req: Request, res: Response) => {

    // const data = req.body
    // if(req.file){
    //     data.profilePhoto = req.file?.path
    // }

    // const result = await userService.signUp(data)
    const result = await userService.signUp({
        ...JSON.parse(req.body.data),
        profilePhoto : req.file?.path
    })
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



const getSingleProfile = async (req: Request, res: Response) => {
    try {

        const id = req.params.userId

        const result = await userService.getSingleProfile(id)

        res.status(200).json({
            success: true,
            message: "Single profile retrived successfully!",
            data: result
        })
    } catch (err) {
        console.log(err)
    }

};


const getUpdatedUser = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]  
    const updatedData = req.body
    if (req.file) {
        updatedData.profilePhoto = req.file.path;
    }

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


  const getUpdatedUserRole = async (req: Request, res: Response) => {
    const userId = req.params.userId

    try {
        const updatedUserRole = await userService.getUpdatedUserRole(userId)

        if (!updatedUserRole) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: updatedUserRole,
        })
    } catch (err) {
        console.log(err)
    }
}

const deleteSingleUser = async (req: Request, res: Response) => {

    try {

        const userId = req.params.userId;

        const result = await userService.deleteUser(userId)
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: result
        })
    } catch (err) {
        console.log(err)
    }

}

const getAllProfile = async (req: Request, res: Response) => {


    try {
        const result = await userService.getAllProfileFromDB()
        res.status(200).json({
            statusCode: 200,
            status: 200,
            success: true,
            message: "All profile retrieved successfully",
            data: result
        })
    } catch (err) {
        console.log(err)
    }
}

const sendFriendRequest = async (req:Request,res:Response) => {
    const {senderId,receiverId} = req.body

    try {
        const result = await userService.requestFriend(senderId, receiverId);
        res.status(200).json({
            statusCode: 200,
            status: 200,
            success: true,
            message: "Friend Request sent successfully",
            data: result
        })
      } catch (error) {
        console.log(error)
      }
}


const acceptFrinedRequest = async (req:Request,res:Response) => {
    const {userId,senderId} = req.body

    try {
        const result = await userService.acceptFriendRequest(userId, senderId);
        res.status(200).json({
            statusCode: 200,
            status: 200,
            success: true,
            message: "Friend Request accepted successfully",
            data: result
        })
      } catch (error) {
        console.log(error)
      }
}

const viewFriendRequest = async (req:Request,res:Response) => {
    const userId = req.params.userId

    try {
        const result = await userService.viewFriendRequest(userId);
        res.status(200).json({
            statusCode: 200,
            status: 200,
            success: true,
            message: "Friend Request viewed successfully",
            data: result
        })
      } catch (error) {
        console.log(error)
      }
}

const viewFriend = async (req:Request,res:Response) => {
    const userId = req.params.userId

    try {
        const result = await userService.viewFriend(userId);
        res.status(200).json({
            statusCode: 200,
            status: 200,
            success: true,
            message: "Friends viewed successfully",
            data: result
        })
      } catch (error) {
        console.log(error)
      }
}

export const userController = {
    signUpRegistration,
    getProfile,
    getUpdatedUser,
    followConntroller,
    unfollowCoontroller,
    getUpdatedUserRole,
    deleteSingleUser,
    getAllProfile,
    sendFriendRequest,
    acceptFrinedRequest,
    viewFriendRequest,
    viewFriend,
    getSingleProfile
}