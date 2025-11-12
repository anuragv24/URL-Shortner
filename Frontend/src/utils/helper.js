
import { redirect } from "@tanstack/react-router"
import { getCurrentUser } from "../api/user.api"
import { login } from "../store/slice/authSlice"

export const checkAuth =  async({context}) => {
    try {
        const {store, queryClient} = context
        const data = await queryClient.ensureQueryData({
            queryKey: ['currentUser'],
            queryFn: getCurrentUser,
        })
        
        if(!data) return false
        store.dispatch(login(data.user))
        
        const {isAuthenticated} = store.getState().auth
        if(!isAuthenticated) return false
        return true
    } catch (error) {
       return redirect({to: "/"})
    }
}

export const redirectIfAuth = async ({ context }) => {
  const { queryClient } = context
  try {
    const user = await queryClient.ensureQueryData({
      queryKey: ['currentUser'],
      queryFn: getCurrentUser,
    })
    if (user.user) {
      return redirect({ to: "/dashboard" }) // 👈 prevents seeing login again
    }
  } catch {
    return true // not logged in, stay on login
  }
}
