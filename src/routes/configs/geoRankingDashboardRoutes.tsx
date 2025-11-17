import { lazyImport } from "../lazyImport";
import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";

const GeoRankingDashboardLayout = lazyImport(
  () => import("@/GEO-ranking-dashboard/layouts/GeoRankingDashboardLayout")
);
const ComingSoonPage = lazyImport(
  () => import("@/GEO-ranking-dashboard/pages/coming-soon")
);
const Profile = lazyImport(
  () => import("@/GEO-ranking-dashboard/pages/profile")
);

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
