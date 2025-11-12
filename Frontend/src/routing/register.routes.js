import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import RegisterPage from "../pages/RegisterPage";
import { redirectIfAuth } from "../utils/helper";

export const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/register",
    component: RegisterPage,
    beforeLoad: redirectIfAuth
})