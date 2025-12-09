import express from "express"
import { getCurrentUser, login, logout, register, resendOtp, verifyOtp } from "../controller/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {authLimiter, strictLimiter} from "../middleware/rateLimiters.middleware.js"

const authRouter = express.Router()

authRouter.route("/register").post(authLimiter, register)
authRouter.route("/login").post( login)
authRouter.route("/logout").get(authMiddleware,logout)
authRouter.route('/me').get(authMiddleware, getCurrentUser)

authRouter.route("/resend-otp").post(strictLimiter, resendOtp)
authRouter.route("/verify-otp").post(strictLimiter, verifyOtp)


export default authRouter
