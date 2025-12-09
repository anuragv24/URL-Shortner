import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/apiErrorHandler.js";

//for resend OTP & verify OTP
export const strictLimiter = rateLimit({
    windowMs: 15*60*1000, //15 min
    max: 5,
    // message: {message: "Too many attempts, please try again after 15min"},
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const error = new ApiError(
            options.statusCode || 429,
            "Too many attempts, please wait before retrying"
        )
        next(error)
    }
})

// for login & register
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, 
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res, next, options) => {
        const error = new ApiError(
            options.statusCode || 429,
            "Too many attempts, please wait before retrying"
        )
        next(error)
    }
});

