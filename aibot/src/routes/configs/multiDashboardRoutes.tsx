import { ProtectedRoute } from "../ProtectedRoute";
import { DashboardTypeGuard } from "../guards/DashboardTypeGuard";
import { MultiDashboardLayout } from "@/multiDashboardLayout/pageLayout";
import { StandaloneLayout } from "@/multiDashboardLayout/layouts/StandaloneLayout";
import { SettingsLayout } from "@/multiDashboardLayout/components/SettingsLayout";
import { TeamMembersWrapper } from "@/multiDashboardLayout/components/settings/TeamMembersWrapper";
import { SubscriptionWrapper } from "@/multiDashboardLayout/components/settings/SubscriptionWrapper";
import { BrandingWrapper } from "@/multiDashboardLayout/components/settings/BrandingWrapper";
import { ReportBrandingWrapper } from "@/multiDashboardLayout/components/settings/ReportBrandingWrapper";
import { IntegrationsWrapper } from "@/multiDashboardLayout/components/settings/IntegrationsWrapper";
import { EditTeamMemberWrapper } from "@/multiDashboardLayout/components/settings/EditTeamMemberWrapper";
import { RouteConfig } from "../routeConfig";
import { Profile } from "@/multiDashboardLayout/pages/Profile";
import { lazy } from "react";

const SamplePage = lazy(() => import("@/pages/SamplePage"));

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
        element: <SamplePage />,
      },
      {
        path: "settings",
        element: <SettingsLayout />,
        children: [
          {
            path: "",
            element: <TeamMembersWrapper />,
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