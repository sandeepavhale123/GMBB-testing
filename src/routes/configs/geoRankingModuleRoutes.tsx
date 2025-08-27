import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { GeoRankingLayout } from "@/modules/GEO-Ranking/components/PageLayout";
import { Dashboard } from "@/modules/GEO-Ranking/pages/Dashboard";
import { CheckRanking } from "@/modules/GEO-Ranking/pages/CheckRanking";
import { ManageGoogleAPIKey } from "@/modules/GEO-Ranking/pages/ManageGoogleAPIKey";
import { CreditHistory } from "@/modules/GEO-Ranking/pages/CreditHistory";
import type { RouteConfig } from "../routeConfig";

export const geoRankingModuleRoutes: RouteConfig[] = [
  {
    path: "/module/geo-ranking",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[2]}>
          <GeoRankingLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "check-rank",
        element: <CheckRanking />,
      },
      {
        path: "google-api-key",
        element: <ManageGoogleAPIKey />,
      },
      {
        path: "credit-history",
        element: <CreditHistory />,
      },
    ],
  },
];