import { Outlet, useRouter} from "@tanstack/react-router";
import NavBar from "./components/NavBar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCurrentUser } from "./api/user.api";
import AppSkeleton from "./components/AppSkeleton";
import {login} from "./store/slice/authSlice"

const RootLayout = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  const router = useRouter()
  
  const isPublicRoute = window.location.pathname === "/"
  const [hasAuthChecked, setHasAuthChecked] = useState(false)

  const {
    data, isLoading, isError
  } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
    enabled: !isPublicRoute,
  })

  useEffect(()=>{
    if(data?.user){
      dispatch(login(data.user))
    }

    if(window.location.pathname === '/' && data?.user){
      router.navigate({to: "/dashboard"})
    }
  }, [data, dispatch, router])

  // useEffect(()=>{
  //   if(hasAuthChecked) return
  //   const checkAuth = async () => {
  //     try {
  //       const user = await queryClient.ensureQueryData({
  //         queryKey: ['currentUser'],
  //         queryFn: getCurrentUser
  //       })
  //       // const {user, isLoading, isError} = useQuery({
  //       //   queryKey: ['currentUser'],
  //       //   queryFn: getCurrentUser,
  //       //   retry: false,
  //       // })
  //       if(user && user.user){
  //         dispatch(login(user.user))
  //         if(window.location.pathname === '/'){
  //           router.navigate({to: "/dashboard"})
  //         }
  //       }
  //     } catch (error) {
  //     } finally {
  //       setHasAuthChecked(true)
  //     }
  //   }
  //   checkAuth()
  // },[hasAuthChecked, queryClient, dispatch, router])

  if(isLoading){
    return <AppSkeleton />
  }

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
