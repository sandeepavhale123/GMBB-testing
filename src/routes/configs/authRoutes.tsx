
import { Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NewPassword from "@/pages/NewPassword";
import Success from "@/pages/Success";
import Onboarding from "@/pages/Onboarding";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { RouteConfig } from "../routeConfig";

export const authRoutes: RouteConfig[] = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    )
  },
  {
    path: "/new-password",
    element: (
      <PublicRoute>
        <NewPassword />
      </PublicRoute>
    )
  },
  {
    path: "/success",
    element: <Success />
  },
  {
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    )
  }
];
