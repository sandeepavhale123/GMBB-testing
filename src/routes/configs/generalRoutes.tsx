
import Profile from "@/pages/Profile";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteConfig } from "../routeConfig";
import { ManageGoogleAccountPage } from "@/components/Settings/ManageGoogleAccountPage";
import { SubscriptionPage } from "@/components/Settings/SubscriptionPage";
import { GenieSubscriptionPage } from "@/components/Settings/GenieSubscriptionPage";
import { ListingManagementPage } from "@/components/Settings/ListingManagementPage";
import { Navigate } from "react-router-dom";

export const generalRoutes: RouteConfig[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <TeamPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings/google-account",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings/subscription",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings/genie-subscription",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/settings/listings/:accountId",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    )
  },
  
  // Catch-all route - must be last
  {
    path: "*",
    element: <NotFound />
  }
];
