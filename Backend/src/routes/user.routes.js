import express from "express"
import { authMiddleware } from "../middleware/auth.middleware.js"
import {deleteUrl, getAllUserUrl} from "../controller/user.controller.js"
const userRouter = express.Router()

userRouter.post("/urls", authMiddleware, getAllUserUrl)
userRouter.delete("/deleteUrl", authMiddleware, deleteUrl)

export default userRouter