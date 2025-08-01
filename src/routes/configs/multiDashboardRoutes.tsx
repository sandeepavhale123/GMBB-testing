import { ProtectedRoute } from "../ProtectedRoute";
import { MultiDashboardLayout } from "@/multiDashboardLayout/pageLayout";
import { MultiDashboard } from "@/multiDashboardLayout/pages/MultiDashboard";
import { BulkPost } from "@/multiDashboardLayout/pages/BulkPost";
import { BulkMedia } from "@/multiDashboardLayout/pages/BulkMedia";
import { BulkReview } from "@/multiDashboardLayout/pages/BulkReview";
import { RouteConfig } from "../routeConfig";

export const multiDashboardRoutes: RouteConfig[] = [
  {
    path: "/main-dashboard",
    element: (
      <ProtectedRoute>
        <MultiDashboardLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: "/main-dashboard/index",
    element: (
      <ProtectedRoute>
        <MultiDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/main-dashboard/bulk-post",
    element: (
      <ProtectedRoute>
        <BulkPost />
      </ProtectedRoute>
    ),
  },
  {
    path: "/main-dashboard/bulk-media",
    element: (
      <ProtectedRoute>
        <BulkMedia />
      </ProtectedRoute>
    ),
  },
  {
    path: "/main-dashboard/bulk-review",
    element: (
      <ProtectedRoute>
        <BulkReview />
      </ProtectedRoute>
    ),
  },
];