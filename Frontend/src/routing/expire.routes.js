import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import Expired from "../pages/Expired";



export const expireRoute = createRoute({
    getParentRoute: () => rootRoute,
    path : "/expire",
    component: Expired,

})