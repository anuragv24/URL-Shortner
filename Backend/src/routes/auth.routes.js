import express from "express"
import { getCurrentUser, login, logout, register } from "../controller/auth.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const authRouter = express.Router()

authRouter.route("/register").post(register)
authRouter.route("/login").post(login)
authRouter.route("/logout").get(authMiddleware,logout)
authRouter.route('/me').get(authMiddleware, getCurrentUser)

authRouter.route("/resend-otp").post(resendOtp)
authRouter.route("/verify-otp").post(verifyOtp)


export default authRouter
