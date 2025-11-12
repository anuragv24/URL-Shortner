import axiosInstance from "../utils/axiosinstance.js"

export const loginUser = async (email, password) => {
    const {data} = await axiosInstance.post("/api/auth/login", {email, password})
    return data.data
}

export const registerUser = async(name, email, password) => {
    const {data} = await axiosInstance.post("/api/auth/register", {name, email, password})
    return data.data
}

export const logoutUser = async() => {
    const {data} = await axiosInstance.get("/api/auth/logout")
    console.log("logout:  ", data)
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
