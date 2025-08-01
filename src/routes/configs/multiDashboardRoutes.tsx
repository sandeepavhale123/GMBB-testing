import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
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
    children: [
      {
        path: "",
        element: <MultiDashboard />,
      },
      {
        path: "bulk-post",
        element: <BulkPost />,
      },
      {
        path: "bulk-media",
        element: <BulkMedia />,
      },
      {
        path: "bulk-review",
        element: <BulkReview />,
      },
    ],
  },
];