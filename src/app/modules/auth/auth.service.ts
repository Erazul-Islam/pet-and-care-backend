import httpStatus from "http-status"
import config from "../../config"
import AppError from "../../errors/AppError"
import { User } from "../user/user.model"
import { TLoginUser } from "./auth.interface"
import { createToken } from "./auth.utils"
import bcrypt from 'bcrypt';
import { sendEmail } from "../../utils/sendEmail"

const loginUser = async (payload: TLoginUser) => {

    const user = await User.isUSerExistByCustomEmial(payload.email)
    console.log(user)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found')
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Invalid Password')
    }

    const jwtPayload = {
        _id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        mobileNumber: user.mobileNumber,
        address: user.address,
        profilePhoto: user.profilePhoto,
        coverPhoto: user.coverPhoto,
        intro: user.intro,
        college: user.college,
        university: user.university,
        lives: user.lives,
        from: user.from,
        followers: user.followers,
        following: user.following
    }

    const accessToken = createToken(jwtPayload, config.jwtAccessSecret as string, config.JWT_ACCESS_EXPIRES_IN as string)
    return {
        accessToken,
        user
    }
}

const changePassword = async (userId: string, payload: { oldPassword: string, newPassword: string }) => {


    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);
    console.log("password matched", isPasswordMatched)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
    }

    user.password = payload?.newPassword;
    user.needsPasswordChange = false;
    user.passwordChangedAt = new Date();

    await user.save();

    console.log("user after password change", user)

    return {
        message: "Password updated successfully"
    }
}

const forgetPassword = async (email: string) => {
    const user = await User.isUSerExistByCustomEmial(email)
    console.log(user)

    if(!user){
        throw new AppError(httpStatus.NOT_FOUND,'This user is not found')
    }

    const jwtPayload = {
        email : user.email,
        role : user.role
    }

    console.log(jwtPayload)

    const resetToken = createToken(
        jwtPayload,
        config.jwtAccessSecret as string,
        '10m'
    )

    const resetlink = `${config.reset_link}?email=${user.email}&token=${resetToken}`

    sendEmail(user.email,resetlink)

    console.log(resetlink)
}

export const authService = {
    loginUser,
    changePassword,
    forgetPassword
}