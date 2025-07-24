import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";

export const dashboardRoutes: RouteConfig[] = [
  // Main dashboard route
  {
    path: "/location-dashboard/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // AI Tasks route
  {
    path: "/ai-tasks/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/plan-expired",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  // Redirect /location-dashboard to default
  {
    path: "/location-dashboard",
    element: <Navigate to="/location-dashboard/default" replace />,
  },

  // Redirect /ai-tasks to default
  {
    path: "/ai-tasks",
    element: <Navigate to="/ai-tasks/default" replace />,
  },
];
