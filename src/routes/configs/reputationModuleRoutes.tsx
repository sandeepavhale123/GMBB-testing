import { lazyImport } from "../lazyImport";
const ReputationLayout = lazyImport(
  () => import("@/modules/Reputation-module/components/PageLayout")
);
const Dashboard = lazyImport(
  () => import("@/modules/Reputation-module/pages/Dashboard")
);
const Review = lazyImport(
  () => import("@/modules/Reputation-module/pages/Review")
);
const Request = lazyImport(
  () => import("@/modules/Reputation-module/pages/Request")
);
const Feedback = lazyImport(
  () => import("@/modules/Reputation-module/pages/Feedback")
);
const CreateCampaign = lazyImport(
  () => import("@/modules/Reputation-module/pages/CreateCampaign")
);
const CreateTemplate = lazyImport(
  () => import("@/modules/Reputation-module/pages/CreateTemplate")
);
const ReviewLink = lazyImport(
  () => import("@/modules/Reputation-module/pages/ReviewLink")
);
const CreateFeedbackForm = lazyImport(
  () => import("@/modules/Reputation-module/pages/CreateFeedbackForm")
);
const Setting = lazyImport(
  () => import("@/modules/Reputation-module/pages/Setting")
);
const QRCodePoster = lazyImport(
  () => import("@/modules/Reputation-module/pages/QRCodePoster")
);
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";

import { ReputationOnboarding } from "@/modules/Reputation-module/pages/ReputationOnboarding";
import { Dashboard as V1Dashboard } from "@/modules/Reputation-module/v1/pages/Dashboard";
import { CreateFeedbackForm as V1CreateFeedbackForm } from "@/modules/Reputation-module/v1/pages/CreateFeedbackForm";
import { FeedbackDetails as V1FeedbackDetails } from "@/modules/Reputation-module/v1/pages/FeedbackDetails";
import { PublicFeedbackForm } from "@/modules/Reputation-module/v1/public-pages/PublicFeedbackForm";
import { PublicReputationLayout } from "@/modules/Reputation-module/public-pages/PublicReputationLayout";
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
        path: "edit-feedback-form/:formId",
        element: <V1CreateFeedbackForm />,
      },
      {
        path: "feedback/:id",
        element: <V1FeedbackDetails />,
      },
    ],
  },
  {
    path: "/fb/:formId",
    element: (
      <PublicReputationLayout>
        <PublicFeedbackForm />
      </PublicReputationLayout>
    ),
  },
];
