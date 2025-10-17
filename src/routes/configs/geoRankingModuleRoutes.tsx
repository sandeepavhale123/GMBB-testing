import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { GeoRankingLayout } from "@/modules/GEO-Ranking/components/PageLayout";
import { Dashboard } from "@/modules/GEO-Ranking/pages/Dashboard";
import { CheckRanking } from "@/modules/GEO-Ranking/pages/CheckRanking";
import { ManageGoogleAPIKey } from "@/modules/GEO-Ranking/pages/ManageGoogleAPIKey";
import { CreditHistory } from "@/modules/GEO-Ranking/pages/CreditHistory";
import { ViewProjectDetails } from "@/modules/GEO-Ranking/pages/ViewProjectDetails";
import { ViewKeywords } from "@/modules/GEO-Ranking/pages/ViewKeywords";
import { AIChatBoxPage } from "@/modules/GEO-Ranking/pages/AI-ChatBoxPage";
import { GeoRankingSettingsLayout } from "@/modules/GEO-Ranking/components/GeoRankingSettingsLayout";
import { ThemeCustomizationWrapper } from "@/modules/GEO-Ranking/components/settings/ThemeCustomizationWrapper";
import { GoogleApiKeyWrapper } from "@/modules/GEO-Ranking/components/settings/GoogleApiKeyWrapper";
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
