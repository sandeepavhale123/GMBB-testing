import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { ReputationLayout } from "@/modules/Reputation-module/components/PageLayout";
import { Dashboard } from "@/modules/Reputation-module/pages/Dashboard";
import { Review } from "@/modules/Reputation-module/pages/Review";
import { Request } from "@/modules/Reputation-module/pages/Request";
import { Feedback } from "@/modules/Reputation-module/pages/Feedback";
import { CreateCampaign } from "@/modules/Reputation-module/pages/CreateCampaign";
import { CreateTemplate } from "@/modules/Reputation-module/pages/CreateTemplate";
import { ReviewLink } from "@/modules/Reputation-module/pages/ReviewLink";
import { CreateFeedbackForm } from "@/modules/Reputation-module/pages/CreateFeedbackForm";
import { Setting } from "@/modules/Reputation-module/pages/Setting";
import { QRCodePoster } from "@/modules/Reputation-module/pages/QRCodePoster";
import { ReputationOnboarding } from "@/modules/Reputation-module/pages/ReputationOnboarding";
import { Dashboard as V1Dashboard } from "@/modules/Reputation-module/v1/pages/Dashboard";
import { CreateFeedbackForm as V1CreateFeedbackForm } from "@/modules/Reputation-module/v1/pages/CreateFeedbackForm";
import { FeedbackDetails as V1FeedbackDetails } from "@/modules/Reputation-module/v1/pages/FeedbackDetails";
import { PublicFeedbackForm } from "@/modules/Reputation-module/v1/pages/PublicFeedbackForm";
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
        path: "feedback",
        element: <Feedback />,
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
        path: "create-feedback-form",
        element: <CreateFeedbackForm />,
      },
      {
        path: "edit-feedback-form/:formId",
        element: <CreateFeedbackForm />,
      },
      {
        path: "review-link",
        element: <ReviewLink />,
      },
      {
        path: "setting",
        element: <Setting />,
      },
      {
        path: "qr-code-poster",
        element: <QRCodePoster />,
      },
      {
        path: "onboarding",
        element: <ReputationOnboarding />,
      },
    ],
  },
  {
    path: "/module/reputation/v1",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1, 2]}>
          <ReputationLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <V1Dashboard />,
      },
      {
        path: "create-feedback-form",
        element: <V1CreateFeedbackForm />,
      },
      {
        path: "feedback/:id",
        element: <V1FeedbackDetails />,
      },
    ],
  },
  // Public route - no authentication required
  {
    path: "/review/feedback-form/:formId",
    element: <PublicFeedbackForm />,
  },
];
