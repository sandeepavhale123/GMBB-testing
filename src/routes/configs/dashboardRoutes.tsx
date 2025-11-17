import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";
import { lazyImport } from "../lazyImport";
const Index = lazyImport(() => import("@/pages/Index"));

export const dashboardRoutes: RouteConfig[] = [
  // Main dashboard route
  {
    path: "/location-dashboard/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // AI Tasks route
  {
    path: "/ai-tasks/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // Gallery route
  {
    path: "/gallery/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // Posts route
  {
    path: "/posts/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // Media route
  {
    path: "/media/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // Insights route
  {
    path: "/insights/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // Geo Ranking route
  {
    path: "/geo-ranking/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // Reviews route
  {
    path: "/reviews/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  // QA route
  {
    path: "/qa/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },

  {
    path: "/plan-expired",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Index />
          </ListingProvider>
        </DashboardTypeGuard>
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
