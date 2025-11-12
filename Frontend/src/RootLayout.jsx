import { Outlet, useRouter} from "@tanstack/react-router";
import NavBar from "./components/NavBar";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/user.api";

const RootLayout = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const router = useRouter()
  
  const [hasAuthChecked, setHasAuthChecked] = useState(false)
  
  useEffect(()=>{
    if(hasAuthChecked) return
    const checkAuth = async () => {
      try {
        const user = await queryClient.ensureQueryData({
          queryKey: ['currentUser'],
          queryFn: getCurrentUser
        })
        if(user && user.user){
          dispatch(login(user.user))
          if(window.location.pathname === '/'){
            router.navigate({to: "/dashboard"})
          }
        }
      } catch (error) {
      } finally {
        setHasAuthChecked(true)
      }
    }
    checkAuth()
  },[hasAuthChecked, queryClient, dispatch, router])

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
