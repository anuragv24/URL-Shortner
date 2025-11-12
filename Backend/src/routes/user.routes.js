import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {getAllUserUrl} from "../controller/user.controller.js"
const userRouter = express.Router()

userRouter.post("/urls", authMiddleware, getAllUserUrl)

export default userRouter