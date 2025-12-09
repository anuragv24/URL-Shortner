import jwt from "jsonwebtoken"
import { findUserByIdPublic } from "../dao/user.dao.js"
import { ApiResponse } from "../utils/ApiResponse.js"

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies?.accessToken
    if(!token) 
        return res
            .status(401)
            .json(
                new ApiResponse(
                    401,
                {},
            "Token not found1111111111"
        ))

    try{
        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user = await findUserByIdPublic(decoded?._id)
        if(!user) return res.status(401).json(
            new ApiResponse(
                401,
                {},
                "Invalid Token"
            ))
        req.user = user
        next()

    }catch(error){
        return res.status(401).json({message: "something went wrong",error})
    }
}

