import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import UrlModel from "../models/shortUrl.models.js"


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