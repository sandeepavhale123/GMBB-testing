import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
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

  // Gallery route
  {
    path: "/gallery/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Posts route
  {
    path: "/posts/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Media route
  {
    path: "/media/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Insights route
  {
    path: "/insights/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Geo Ranking route
  {
    path: "/geo-ranking/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // Reviews route
  {
    path: "/reviews/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },

  // QA route
  {
    path: "/qa/:listingId",
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
