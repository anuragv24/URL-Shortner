import axiosInstance from "../utils/axiosinstance.js"

export const loginUser = async (email, password) => {
    const {data} = await axiosInstance.post("/api/auth/login", {email, password})
    return data.data
}

export const registerUser = async(name, email, password) => {
    const {data} = await axiosInstance.post("/api/auth/register", {name, email, password})
    return data.data
}

export const verifyUser = async(email, otpString) => {
    console.log("email  ::  ", email)
    console.log("otp  ::  ", otpString)
    const {data} = await axiosInstance.post("/api/auth/verify-otp", {email, otpString})
    return data.data
}

export const resendOTP = async(email) => {
    const {data} = await axiosInstance.post("/api/auth/resend-otp", {email})
    return data.data
}
export const logoutUser = async() => {
    const {data} = await axiosInstance.get("/api/auth/logout")
    return data.statusCode === 200
}

export const getCurrentUser = async() => {
    const {data} = await axiosInstance.get("/api/auth/me")
    return data.data
}

export const getAllUserUrls = async () => {
    const {data} = await axiosInstance.post("/api/user/urls")
    return data.data
}
