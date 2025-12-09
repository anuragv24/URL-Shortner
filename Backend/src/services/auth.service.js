import { createUser, findUserByEmail, findUserByIdPublic } from "../dao/user.dao.js"
import { ApiError } from "../utils/apiErrorHandler.js"
import { sendMail } from "./emailService.js"


export const registerUser = async (name, email, password) => {
  
    const existedUser = await findUserByEmail(email)
    if(existedUser) throw new ApiError(409, "User already exist")

    const {newUser, otp} = await createUser(name, email, password)
    if(!newUser) throw new ApiError(500, "Failed to create user due to server error")

    try {
        const message = `Your verification code is: ${otp}. This code expires in 10 minuutes.`
        await sendMail({
            to:email,
            subject: "Your Verification Code",
            text: message,
            html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Hello ${name},</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
                <br>
                <p>Thanks,<br>${process.env.APP_NAME}</p>
            </div>
            `,
        })
        return true
    } catch (error) {
        await newUser.deleteOne()
        throw new ApiError(500, "Email could not be sent. Please try again later.")
    }
}

export const loginUser = async(email, password) => {

    const existedUser = await findUserByEmail(email)
    if(!existedUser){
        throw new ApiError(404, "User not found")
    }
    
    const isPasswordValid = await existedUser.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credential")
    }

    const loggedInUser = await findUserByIdPublic(existedUser._id)

    return loggedInUser
}

