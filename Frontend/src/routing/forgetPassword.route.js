import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import ForgetPasswordPage from "../pages/ForgetPasswordPage"


export const forgetPassword = createRoute({
    getParentRoute: () => rootRoute,
    path: "/forgetPassword",
    component: ForgetPasswordPage
})