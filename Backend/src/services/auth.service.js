import { createUser, findUserByEmail, findUserByIdPublic } from "../dao/user.dao.js"
import { ApiError } from "../utils/apiErrorHandler.js"


export const registerUser = async (name, email, password) => {
  
    const existedUser = await findUserByEmail(email)
    if(existedUser) throw new ApiError(409, "User already exist")

    const newUser = await createUser(name, email, password)
    if(!newUser) throw new ApiError(500, "Failed to create user due to server error")

    const createdUser = await findUserByIdPublic(newUser._id)
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user.")
    }
    
    return createdUser
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



// OTP generated and saved to records in user.dao.js.
