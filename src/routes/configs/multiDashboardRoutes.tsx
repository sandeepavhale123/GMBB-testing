import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
import { MultiDashboardLayout } from "@/multiDashboardLayout/pageLayout";
import { MultiDashboard } from "@/multiDashboardLayout/pages/MultiDashboard";
import { BulkPost } from "@/multiDashboardLayout/pages/BulkPost";
import { BulkPostDetails } from "@/multiDashboardLayout/pages/BulkPostDetails";
import { BulkMediaDetails } from "@/multiDashboardLayout/pages/BulkMediaDetails";
import { StandaloneLayout } from "@/multiDashboardLayout/layouts/StandaloneLayout";
import { BulkMedia } from "@/multiDashboardLayout/pages/BulkMedia";
import { BulkReview } from "@/multiDashboardLayout/pages/BulkReview";
import { Reports } from "@/multiDashboardLayout/pages/Reports";
import { SettingsLayout } from "@/multiDashboardLayout/components/SettingsLayout";
import { ManageGoogleAccountWrapper } from "@/multiDashboardLayout/components/settings/ManageGoogleAccountWrapper";
import { TeamMembersWrapper } from "@/multiDashboardLayout/components/settings/TeamMembersWrapper";
import { SubscriptionWrapper } from "@/multiDashboardLayout/components/settings/SubscriptionWrapper";
import { BrandingWrapper } from "@/multiDashboardLayout/components/settings/BrandingWrapper";
import { ReportBrandingWrapper } from "@/multiDashboardLayout/components/settings/ReportBrandingWrapper";
import { IntegrationsWrapper } from "@/multiDashboardLayout/components/settings/IntegrationsWrapper";
import { EditTeamMemberWrapper } from "@/multiDashboardLayout/components/settings/EditTeamMemberWrapper";
import { ListingManagementWrapper } from "@/multiDashboardLayout/components/settings/ListingManagementWrapper";
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
        path: "bulk-post-details/:bulkId",
        element: <BulkPostDetails />,
      },
      {
        path: "bulk-media-details/:bulkId",
        element: <BulkMediaDetails />,
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <ManageGoogleAccountWrapper />,
          },
          {
            path: "google-account",
            element: <ManageGoogleAccountWrapper />,
          },
          {
            path: "team-members",
            element: <TeamMembersWrapper />,
          },
          {
            path: "subscription",
            element: <SubscriptionWrapper />,
          },
          {
            path: "theme-customization",
            element: <BrandingWrapper />,
          },
          {
            path: "report-branding",
            element: <ReportBrandingWrapper />,
          },
          {
            path: "integrations",
            element: <IntegrationsWrapper />,
          },
          {
            path: "team-members/edit/:memberId",
            element: <EditTeamMemberWrapper />,
          },
          {
            path: "listings/:accountId",
            element: <ListingManagementWrapper />,
          },
        ],
      },
    ],
  },
];