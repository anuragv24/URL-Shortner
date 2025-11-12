import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import Homepage from "../pages/Homepage";
import store from "../store/store";
import { redirectIfAuth } from "../utils/helper";


export const homePageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: Homepage,
    beforeLoad: redirectIfAuth
})