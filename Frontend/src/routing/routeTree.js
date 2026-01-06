import { createRootRoute } from "@tanstack/react-router";
import RootLayout from "../RootLayout";
import { homePageRoute } from "./homepage";
import { dashboardRoute } from "./dashboard";
import { analyticPageRoute } from "./analytic.routes";
import { loginRoute } from "./login.routes";
import { registerRoute } from "./register.routes";
import { expireRoute } from "./expire.routes";
import { forgetPassword } from "./forgetPassword.route";


export const rootRoute = createRootRoute({
    component: RootLayout
})

export const routeTree = rootRoute.addChildren([
    homePageRoute, 
    // authRoute,
    dashboardRoute,
    analyticPageRoute,
    loginRoute,
    registerRoute,
    expireRoute,
    forgetPassword
])