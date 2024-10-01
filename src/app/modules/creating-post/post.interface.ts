import { TComment } from "../comment/comment.interface"

export type TPost = {
    userName: string,
    userId: string,
    userProfilePhoto: string,
    userEmail: string,
    caption: string,
    description: string,
    photo: string,
    category: string,
    comments : TComment[]
}