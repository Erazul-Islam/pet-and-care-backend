import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { MeiliSearchServices } from "./meilisearch.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";


const getItemsFromMeili = catchAsync (async (req: Request, res : Response) => {
    const {searchTerm, limit} = req.query

    const numberLimit = Number(limit) || 10

    const result = await MeiliSearchServices.getAllPosts(
        numberLimit,
        searchTerm as string
    )

    sendResponse(res, {
        status : 200,
        statusCode : httpStatus.OK,
        success : true,
        message : "Posts retrive successfully",
        data : result
    })
} )

export const MeiliSearchController = {
    getItemsFromMeili
}