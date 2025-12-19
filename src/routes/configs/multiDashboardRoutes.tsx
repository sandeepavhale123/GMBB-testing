import { lazyImport } from "../lazyImport";
import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
import { MultiDashboardLayout } from "@/multiDashboardLayout/pageLayout";

const MultiDashboard = lazyImport(() => import("@/multiDashboardLayout/pages/MultiDashboard"));

import { BulkPost } from "@/multiDashboardLayout/pages/BulkPost";
import { BulkPostDetails } from "@/multiDashboardLayout/pages/BulkPostDetails";
import { BulkMediaDetails } from "@/multiDashboardLayout/pages/BulkMediaDetails";
import { StandaloneLayout } from "@/multiDashboardLayout/layouts/StandaloneLayout";
import { BulkMedia } from "@/multiDashboardLayout/pages/BulkMedia";
import { BulkReview } from "@/multiDashboardLayout/pages/BulkReview";
import Reports from "@/multiDashboardLayout/pages/Reports";
import { GenerateBulkReport } from "@/multiDashboardLayout/pages/GenerateBulkReport";
import { BulkAutoReply } from "@/multiDashboardLayout/pages/BulkAutoReply";
import { BulkAutoReplyProjectDetails } from "@/multiDashboardLayout/pages/BulkAutoReplyProjectDetails";
import { BulkReportDetails } from "@/multiDashboardLayout/pages/BulkReportDetails";
import { SettingsLayout } from "@/multiDashboardLayout/components/SettingsLayout";
import { ManageGoogleAccountWrapper } from "@/multiDashboardLayout/components/settings/ManageGoogleAccountWrapper";
import { TeamMembersWrapper } from "@/multiDashboardLayout/components/settings/TeamMembersWrapper";
import { SubscriptionWrapper } from "@/multiDashboardLayout/components/settings/SubscriptionWrapper";
import { BrandingWrapper } from "@/multiDashboardLayout/components/settings/BrandingWrapper";
import { ReportBrandingWrapper } from "@/multiDashboardLayout/components/settings/ReportBrandingWrapper";
import { NotificationsWrapper } from "@/multiDashboardLayout/components/settings/NotificationsWrapper";
import { IntegrationsWrapper } from "@/multiDashboardLayout/components/settings/IntegrationsWrapper";
import { EditTeamMemberWrapper } from "@/multiDashboardLayout/components/settings/EditTeamMemberWrapper";
import { ListingManagementWrapper } from "@/multiDashboardLayout/components/settings/ListingManagementWrapper";
import { ManageGroupsWrapper } from "@/multiDashboardLayout/components/settings/ManageGroupsWrapper";
import { GroupDetailsWrapper } from "@/multiDashboardLayout/components/settings/GroupDetailsWrapper";
import { ActivityWrapper } from "@/multiDashboardLayout/components/settings/ActivityWrapper";
import { RouteConfig } from "../routeConfig";
import { Profile } from "@/multiDashboardLayout/pages/Profile";
import { ImportPostCSV } from "@/multiDashboardLayout/pages/ImportPostCSV";
import { ImportPostCSVWizard } from "@/multiDashboardLayout/pages/ImportPostCSVWizard";
import { BulkImportDetails } from "@/multiDashboardLayout/pages/BulkImportDetails";
import { GalleryPage } from "@/multiDashboardLayout/pages/Gallery";
import { BulkMapRanking } from "@/multiDashboardLayout/pages/BulkMapRanking";
import { CheckBulkMapRank } from "@/multiDashboardLayout/pages/CheckBulkMapRank";
import { ViewBulkMapRank } from "@/multiDashboardLayout/pages/ViewBulkMapRank";

export const multiDashboardRoutes: RouteConfig[] = [
  {
    path: "/main-dashboard",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[1]}>
          <MultiDashboardLayout />
        </DashboardTypeGuard>
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
        path: "import-post-csv",
        element: <ImportPostCSV />,
      },
      {
        path: "import-post-csv-wizard",
        element: <ImportPostCSVWizard />,
      },
      {
        path: "bulk-import-details/:id",
        element: <BulkImportDetails />,
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
        path: "gallery",
        element: <GalleryPage />,
      },
      {
        path: "generate-bulk-report",
        element: <GenerateBulkReport />,
      },
      {
        path: "bulk-auto-reply",
        element: <BulkAutoReply />,
      },
      {
        path: "bulk-auto-reply-project-details/:projectId",
        element: <BulkAutoReplyProjectDetails />,
      },
      {
        path: "bulk-report-details/:projectId",
        element: <BulkReportDetails />,
      },
      {
        path: "bulk-map-ranking",
        element: <BulkMapRanking />,
      },
      {
        path: "check-bulk-map-ranking",
        element: <CheckBulkMapRank />,
      },
      {
        path: "view-bulk-map-ranking/:id",
        element: <ViewBulkMapRank />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "gallery",
        element: <GalleryPage />,
      },
      {
        path: "generate-bulk-report",
        element: <GenerateBulkReport />,
      },
      {
        path: "bulk-auto-reply",
        element: <BulkAutoReply />,
      },
      {
        path: "bulk-auto-reply-project-details/:projectId",
        element: <BulkAutoReplyProjectDetails />,
      },
      {
        path: "bulk-report-details/:projectId",
        element: <BulkReportDetails />,
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
            path: "manage-groups",
            element: <ManageGroupsWrapper />,
          },
          {
            path: "manage-groups/:groupId",
            element: <GroupDetailsWrapper />,
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
            path: "notifications",
            element: <NotificationsWrapper />,
          },
          {
            path: "integrations",
            element: <IntegrationsWrapper />,
          },
          {
            path: "activity",
            element: <ActivityWrapper />,
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
  {
    path: "/main",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[1]}>
          <StandaloneLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
];
