import axios from "axios";

const axiosInstance = axios.create({
    baseURL:`${import.meta.env.VITE_API_BASE_URL}`,
    timeout:10000,
    withCredentials: true
})

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (error.response) {
      const { status } = error.response
      const url = originalRequest?.url

      // ✅ DO NOT refresh for these routes
      const isAuthMe = url?.includes("/auth/me")
      const isRefresh = url?.includes("/auth/refresh")

      // 🔁 Access token expired → try refresh
      if (
        status === 401 &&
        !originalRequest._retry &&
        !isAuthMe &&
        !isRefresh
      ) {
        originalRequest._retry = true

        try {
          await axiosInstance.post("/api/auth/refresh")
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          // Refresh failed → session dead
          console.warn("Refresh token expired. Logging out.")
          window.location.href = "/login"
          return Promise.reject(refreshError)
        }
      }

      // 🧠 Normal error handling (no refresh)
      switch (status) {
        case 400:
          console.error("Bad Request")
          break
        case 401:
          console.error("Unauthorized")
          break
        case 403:
          console.error("Forbidden")
          break
        case 404:
          console.error("Not Found")
          break
        case 500:
          console.error("Server Error")
          break
        default:
          console.error(`Error (${status})`)
      }
    }

    else if (error.request) {
      console.error("Network Error: No response received")
    }

    else {
      console.error("Error:", error.message)
    }

    return Promise.reject({
      message:
        error.response?.data?.message ||
        error.message ||
        "Unknown error occurred",
      status: error.response?.status,
      data: error.response?.data,
    })
  }
)



export default axiosInstance