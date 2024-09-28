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
        profilePhoto:result.user.profilePhoto,
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

export const authController = {
    loginUser
}