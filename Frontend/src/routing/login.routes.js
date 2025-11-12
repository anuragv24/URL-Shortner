import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import LoginPage from "../pages/LoginPage";
import { redirectIfAuth } from "../utils/helper";

export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    component: LoginPage ,
    beforeLoad: redirectIfAuth
})