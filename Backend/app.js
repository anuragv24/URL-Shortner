import express from "express";
import {ApiResponse} from "./src/utils/ApiResponse.js"
import dotenv from "dotenv";
import connectDB from "./src/config/mongo.config.js";
import urlRouter from "./src/routes/shortUrl.routes.js";
import { redirectToShortUrl } from "./src/controller/shortUrl.controller.js";
import cors from "cors"
import authRouter from "./src/routes/auth.routes.js";
import userRouter from "./src/routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config("./.env");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

app.use("/api/user", userRouter)
app.use("/api/auth", authRouter)
app.use("/api/create", urlRouter)
app.use("/:id", redirectToShortUrl)

app.use((req, res, next) => {
  res.status(404).json(new ApiResponse(404, {}, "Route Not Found"))
})

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json(new ApiResponse(err.statusCode || 500, {}, err.message || "Internal Server Error"));
})



connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Failed to connect to the DB : ", error);
  });


 
