import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { ReputationLayout } from "@/modules/Reputation-module/components/PageLayout";
import { Dashboard } from "@/modules/Reputation-module/pages/Dashboard";
import { Review } from "@/modules/Reputation-module/pages/Review";
import { Request } from "@/modules/Reputation-module/pages/Request";
import { CreateCampaign } from "@/modules/Reputation-module/pages/CreateCampaign";
import { CreateTemplate } from "@/modules/Reputation-module/pages/CreateTemplate";
import { ReviewLink } from "@/modules/Reputation-module/pages/ReviewLink";
import { Setting } from "@/modules/Reputation-module/pages/Setting";
import type { RouteConfig } from "../routeConfig";

export const reputationModuleRoutes: RouteConfig[] = [
  {
    path: "/module/reputation",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1, 2]}>
          <ReputationLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "review",
        element: <Review />,
      },
      {
        path: "request",
        element: <Request />,
      },
      {
        path: "create-campaign",
        element: <CreateCampaign />,
      },
      {
        path: "create-template",
        element: <CreateTemplate />,
      },
      {
        path: "edit-template/:templateId",
        element: <CreateTemplate />,
      },
      {
        path: "review-link",
        element: <ReviewLink />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
    ],
  },
];
