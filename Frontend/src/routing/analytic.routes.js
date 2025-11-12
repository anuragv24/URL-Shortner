import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./routeTree";
import Anaytics from "../pages/Anaytics";
import { checkAuth } from "../utils/helper";

export const analyticPageRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/analytic',
    component: Anaytics,
    beforeLoad: checkAuth

})