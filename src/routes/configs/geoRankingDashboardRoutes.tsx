import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
import { GeoRankingDashboardLayout } from "@/GEO-ranking-dashboard/layouts/GeoRankingDashboardLayout";
import { ComingSoonPage } from "@/GEO-ranking-dashboard/pages/coming-soon";
import { Profile } from "@/GEO-ranking-dashboard/pages/profile";
import { RouteConfig } from "../routeConfig";

export const geoRankingDashboardRoutes: RouteConfig[] = [
  {
    path: "/geo-ranking-dashboard",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[2]}>
          <GeoRankingDashboardLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <ComingSoonPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];