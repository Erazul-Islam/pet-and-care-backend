import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { eventService } from "./event.service";



const addEventController = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization?.split(' ')[1];

    const result = await eventService.createEvent(req.body, token as string)

    console.log(result)

    sendResponse(res, {
        success: true,
        status: 200,
        message: 'Event Added successfully',
        data: result,
        statusCode: 200
    })
})

const interestedEventController = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.params


    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
        return sendResponse(res, {
            success: false,
            status: 401,
            message: "Unauthorized",
            data: null,
            statusCode: 401,
        });
    }


    const interestedEvent = await eventService.interestedEvent(eventId, token as string);

    sendResponse(res, {
        success: true,
        status: 200,
        message: "Interested the event",
        data: interestedEvent,
        statusCode: 200,
    });
})

const EndEventController = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.params

    const endEvent = await eventService.endEvent(eventId);

    sendResponse(res, {
        success: true,
        status: 200,
        message: "The event ended",
        data: endEvent,
        statusCode: 200,
    });
})


export const eventController = {
    addEventController,
    interestedEventController,
    EndEventController

}