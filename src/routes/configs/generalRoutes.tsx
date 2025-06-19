
import Profile from "@/pages/Profile";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteConfig } from "../routeConfig";

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
  
  // Catch-all route - must be last
  {
    path: "*",
    element: <NotFound />
  }
];
