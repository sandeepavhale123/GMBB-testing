import { lazyImport } from "../lazyImport";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";

const GeoRankingLayout = lazyImport(
  () => import("@/modules/GEO-Ranking/components/PageLayout")
);
const Dashboard = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/Dashboard")
);
const CheckRanking = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/CheckRanking")
);
const ManageGoogleAPIKey = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/ManageGoogleAPIKey")
);
const CreditHistory = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/CreditHistory")
);
const ViewProjectDetails = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/ViewProjectDetails")
);
const ViewKeywords = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/ViewKeywords")
);
const AIChatBoxPage = lazyImport(
  () => import("@/modules/GEO-Ranking/pages/AI-ChatBoxPage")
);
const GeoRankingSettingsLayout = lazyImport(
  () => import("@/modules/GEO-Ranking/components/GeoRankingSettingsLayout")
);
const ThemeCustomizationWrapper = lazyImport(
  () =>
    import(
      "@/modules/GEO-Ranking/components/settings/ThemeCustomizationWrapper"
    )
);
const GoogleApiKeyWrapper = lazyImport(
  () => import("@/modules/GEO-Ranking/components/settings/GoogleApiKeyWrapper")
);

import type { RouteConfig } from "../routeConfig";

export const geoRankingModuleRoutes: RouteConfig[] = [
  {
    path: "/module/geo-ranking",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1, 2]}>
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
        path: "credit-history",
        element: <CreditHistory />,
      },
      {
        path: "view-project-keywords/:projectId",
        element: <ViewKeywords />,
      },
      {
        path: "view-project-details/:project_id",
        element: <ViewProjectDetails />,
      },
      {
        path: "aiChatBox/:projectId",
        element: <AIChatBoxPage />,
      },
      {
        path: "settings",
        element: <GeoRankingSettingsLayout />,
        children: [
          {
            path: "",
            element: <ThemeCustomizationWrapper />,
          },
          {
            path: "theme-customization",
            element: <ThemeCustomizationWrapper />,
          },
          {
            path: "google-api-key",
            element: <GoogleApiKeyWrapper />,
          },
        ],
      },
    ],
  },
];
