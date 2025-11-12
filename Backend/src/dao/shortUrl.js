import urlSchema from "../models/shortUrl.models.js"
import { ApiError } from "../utils/apiErrorHandler.js"

export const saveShortUrl = async  (shortUrl, longUrl, userId) => {
    try {
        const newUrl = new urlSchema({
            full_url: longUrl,
            short_url: shortUrl
        })
        if(userId){
            newUrl.user = userId
        }else {
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
            newUrl.expiresAt = expiresAt
        }

        await newUrl.save()
    } catch (error) {
        console.log("error occured:")
        if(error.code === 11000) {
            throw new ApiError(409, "Conflict error: Short URL already exists")
        }
        throw new ApiError(500, "Failed to save short URL: " + error.message);
    }
}

export const getShortUrl = async (shortUrl) => {
    return await urlSchema.findOneAndUpdate(
        {short_url: shortUrl},
        {$inc:{clicks:1}}
    )
}                        