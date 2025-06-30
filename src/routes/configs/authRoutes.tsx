
import { Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
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
    path: "/onboarding",
    element: (
      <ProtectedRoute>
        <Onboarding />
      </ProtectedRoute>
    )
  }
];
