import jwt from 'jsonwebtoken'
import { TPost } from "./post.interface";
import { postModel } from "./post.model";
import config from '../../config';
import { User } from '../user/user.model';


const addPost = async (payload: TPost, token: string) => {

    const decoded = jwt.verify(token,config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const finduser = await User.findOne({ email: decoded.email })

    const userEmail = finduser?.email

    payload.userEmail = userEmail as string

    const result = await postModel.create(payload)
    return result
}

export const postService = {
    addPost
}