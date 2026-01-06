import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import UrlModel from "../models/shortUrl.models.js"
import { ApiError } from "../utils/apiErrorHandler.js";


export const getAllUserUrl = asyncHandler(async (req, res) => {
    const {_id} = req.user
    // console.log("req.user: ", req.user)
    // console.log("getAllUserUrl --> id", _id)
    const urls = await UrlModel.find({user:_id})
    // console.log("urkls: ", urls);
    
    res.status(200).json(
        new ApiResponse (
            200,
            {urls: urls},
            "Urls"
        )
    )
})

export const deleteUrl = asyncHandler(async(req, res) => {
    const {urlId} = req.body
    const {_id: userId} = req.user

    if(!urlId){
        throw new ApiError(400, "URL id is required")
    }

    const deleted = await UrlModel.deleteOne({
        _id: urlId,
        user: userId,
    })

    if(deleted.deletedCount === 0){
        throw new ApiError(404, "URL not found or not authorised")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            {urlId},
            "Url deleted successfully"
        )
    )
})