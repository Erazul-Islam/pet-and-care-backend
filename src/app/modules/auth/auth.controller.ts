import catchAsync from "../../utils/catchAsync";
import { authService } from "./auth.service";

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

export const authController = {
    loginUser,
    changePassword
}