import { findUserById } from "../dao/user.dao.js"

export const generateAccessAndRefreshTokens = async (userId) => {
    const user = await findUserById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.referenceToken = refreshToken
    await user.save({validateBeforeSave: false})
    
    return {accessToken, refreshToken}
}

