import config from "../../config";
import { User } from "../user/user.model";
import { IInterested, TEvent } from "./event.interface"
import jwt from 'jsonwebtoken'
import { eventModel } from "./event.model";

const createEvent = async (payload: TEvent, token: string) => {

    const decoded = jwt.verify(token, config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const finduser = await User.findOne({ email: decoded.email })

    const userName = finduser?.name
    const userId = finduser?._id
    const userProfilePhoto = finduser?.profilePhoto

    payload.userName = userName as string
    payload.userId = userId as string
    payload.userPhoto = userProfilePhoto as string

    const result = await eventModel.create(payload)

    return result

}

const interestedEvent = async (eventId: string, token: string) => {
    const decoded = jwt.verify(token, config.jwtAccessSecret as string)

    if (typeof decoded === 'string' || !('email' in decoded)) {
        throw new Error('Invalid token structure');
    }

    const finduser = await User.findOne({ email: decoded.email })

    if (!finduser) {
        throw new Error("User not found")
    }

    const interested: IInterested = {
        id: finduser?._id,
        email: finduser?.email,
        username: finduser?.name,
        profilePhoto: finduser?.profilePhoto
    }

    const result = await eventModel.findByIdAndUpdate(eventId, { $push: { interested: interested } }, { new: true })

    if (!result) {
        throw new Error("Post not found");
    }

    return result
}

const endEvent = async (eventId: string) => {
    const result = eventModel.findOneAndUpdate(
        { _id: eventId },
        { $set: { "status": 'ended' } },
        { new: true }
    )
    return result
}

export const eventService = {
    createEvent,
    interestedEvent,
    endEvent
}