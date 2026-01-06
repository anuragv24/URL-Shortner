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
    // console.log("email  ::  ", email)
    // console.log("otp  ::  ", otpString)
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

export const deleteUserUrl = async (urlId) => {
    console.log("deleteUserurl called")
    const {data} = await axiosInstance.delete("/api/user/deleteUrl", {
        data: {urlId}
    })
    console.log("data ;;; ", data)
    return data
}

export const verifyUserEmail = async (email) => {
    const {data} = await axiosInstance.post("/api/auth/forget-password", {email})
    return data.data
}

export const setPassword = async (email, password) => {
    const {data} = await axiosInstance.post("/api/auth/set-password", {email, password})
    return data.data
}