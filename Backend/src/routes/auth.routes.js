import express from "express"
import { getCurrentUser, login, logout, OTPResendForPasswordChange, OTPVerificationForPasswordChange, register, resendOtp, setNewPassword, verifyEmail, verifyOtp } from "../controller/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {authLimiter, strictLimiter} from "../middleware/rateLimiters.middleware.js"

const authRouter = express.Router()

authRouter.route("/register").post(authLimiter, register)
authRouter.route("/login").post( login)
authRouter.route("/logout").get(authMiddleware,logout)
authRouter.route('/me').get(authMiddleware, getCurrentUser)

authRouter.route("/resend-otp").post(strictLimiter, resendOtp)
authRouter.route("/verify-otp").post(strictLimiter, verifyOtp)

authRouter.route("/forget-password").post(strictLimiter, verifyEmail)
authRouter.route("/otp-verify").post(strictLimiter, OTPVerificationForPasswordChange)
authRouter.route("/set-password").post(strictLimiter, setNewPassword)
authRouter.route("/otp-resend").post(strictLimiter, OTPResendForPasswordChange )


export default authRouter
