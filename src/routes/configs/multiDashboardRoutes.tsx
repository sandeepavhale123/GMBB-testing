import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
import { MultiDashboardLayout } from "@/multiDashboardLayout/pageLayout";
import { MultiDashboard } from "@/multiDashboardLayout/pages/MultiDashboard";
import { BulkPost } from "@/multiDashboardLayout/pages/BulkPost";
import { BulkMedia } from "@/multiDashboardLayout/pages/BulkMedia";
import { BulkReview } from "@/multiDashboardLayout/pages/BulkReview";
import { Reports } from "@/multiDashboardLayout/pages/Reports";
import { SettingsLayout } from "@/multiDashboardLayout/components/SettingsLayout";
import { ManageGoogleAccountPage } from "@/components/Settings/ManageGoogleAccountPage";
import TeamMembersPage from "@/components/Settings/TeamMembersPage";
import { SubscriptionPage } from "@/components/Settings/SubscriptionPage";
import { BrandingPage } from "@/components/Settings/BrandingPage";
import { ReportBrandingPage } from "@/components/Settings/ReportBrandingPage";
import { IntegrationsPage } from "@/components/Settings/IntegrationsPage";
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
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "google-account",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <ManageGoogleAccountPage />,
          },
        ],
      },
      {
        path: "team-members",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <TeamMembersPage />,
          },
        ],
      },
      {
        path: "subscription",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <SubscriptionPage />,
          },
        ],
      },
      {
        path: "theme-customization",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <BrandingPage />,
          },
        ],
      },
      {
        path: "report-branding",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <ReportBrandingPage />,
          },
        ],
      },
      {
        path: "integrations",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <IntegrationsPage />,
          },
        ],
      },
    ],
  },
];