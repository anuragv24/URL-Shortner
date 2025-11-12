import express from "express"
import { createShortUrl } from "../controller/shortUrl.controller.js"
import { attachUser } from "../middleware/attachUser.js"

const urlRouter = express.Router()

urlRouter.route("/").post(attachUser ,createShortUrl)


export default urlRouter