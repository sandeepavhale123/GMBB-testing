import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NewPassword from "@/pages/NewPassword";
import Success from "@/pages/Success";
import { PublicRoute } from "@/routes/PublicRoute";
import { RouteConfig } from "../routeConfig";
import { VerifySignupPage } from "@/pages/VerifySignUp";
import { ThemePreloader } from "@/components/ThemePreloader";

export const authRoutes: RouteConfig[] = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <ThemePreloader loadFromAPI={true}>
          <Login />
        </ThemePreloader>
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <ThemePreloader loadFromAPI={true}>
          <Signup />
        </ThemePreloader>
      </PublicRoute>
    ),
  },
  {
    path: "/verify-signup",
    element: (
      <PublicRoute>
        <VerifySignupPage />
      </PublicRoute>
    ),
  },
  {
    path: "/new-password",
    element: (
      <PublicRoute>
        <NewPassword />
      </PublicRoute>
    ),
  },
  {
    path: "/success",
    element: <Success />,
  },
];
