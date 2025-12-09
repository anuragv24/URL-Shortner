import { createUser, findUserByEmail, findUserByIdPublic, otpSetUp } from "../dao/user.dao.js"
import { ApiError } from "../utils/apiErrorHandler.js"
import { sendVerificationEmail } from "./emailHelper.js"


export const registerUser = async (name, email, password) => {
  
    let user = await findUserByEmail(email)
    let otp
    let isNewUser = false

    if(user){
        if(user.isVerified)
            throw new ApiError(409, "User already exist")
        
       otp =  await otpSetUp(user)
    } else {
        const result = await createUser(name, email, password)
        if(!result) throw new ApiError(500, "Failed to create user due to server error")

        otp = result.otp
        user = result.otp
        isNewUser = true
        
    }

    try {
        await sendVerificationEmail(name, email, otp)
        return true
    } catch (error) {
        if(isNewUser)
        await isNewUser.deleteOne()
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

