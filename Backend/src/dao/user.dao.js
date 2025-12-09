import User from "../models/user.model.js"
import { createOTP } from "../utils/helper.js"

export const findUserByEmail = async (email) => {
    const user = await User.findOne({email})
    return user
}

export const findUserById = async (id) => {
    const user = await User.findById(id)
    return user
}

export const createUser = async (name, email, password) => {
    const newUser = new User({name, email, password})
    const otp = createOTP()
    await newUser.setOTP(otp)
    // await newUser.save()
    return {newUser, otp}
}

export const findUserByIdPublic = async (id) => {
    const user = await User.findById(id).select("-password -referenceToken -__v")
    return user
}

export const otpSetUp = async (user) => {
    const otp = createOTP()
    await user.setOTP(otp)
    return {otp}
}