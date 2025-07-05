import { Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NewPassword from "@/pages/NewPassword";
import Success from "@/pages/Success";
import Onboarding from "@/pages/Onboarding";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { PublicRoute } from "@/routes/PublicRoute";
import { RouteConfig } from "../routeConfig";
import { VerifySignupPage } from "@/pages/VerifySignUp";
import { AuthLayout, EmptyLayout, AppLayout } from "@/components/Layout";

export const authRoutes: RouteConfig[] = [
  {
    path: "/login",
    element: (
      <AuthLayout>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <PublicRoute>
          <Signup />
        </PublicRoute>
      </AuthLayout>
    ),
  },
  {
    path: "/verify-signup",
    element: (
      <AuthLayout>
        <PublicRoute>
          <VerifySignupPage />
        </PublicRoute>
      </AuthLayout>
    ),
  },
  {
    path: "/new-password",
    element: (
      <AuthLayout>
        <PublicRoute>
          <NewPassword />
        </PublicRoute>
      </AuthLayout>
    ),
  },
  {
    path: "/success",
    element: (
      <EmptyLayout>
        <Success />
      </EmptyLayout>
    ),
  },
  {
    path: "/onboarding",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
];
