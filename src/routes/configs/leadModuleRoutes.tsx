import { lazyImport } from "../lazyImport";
const LeadLayout = lazyImport(() => import("@/modules/lead-module/components/PageLayout"));
const Dashboard = lazyImport(() => import("@/modules/lead-module/pages/Dashboard"));
const ReportBranding = lazyImport(() => import("@/modules/lead-module/pages/ReportBranding"));
const EmailTemplate = lazyImport(() => import("@/modules/lead-module/pages/EmailTemplate"));
const EmbeddedIframe = lazyImport(() => import("@/modules/lead-module/pages/EmbeddedIframe"));
const Integration = lazyImport(() => import("@/modules/lead-module/pages/Integration"));
const CreditHistory = lazyImport(() => import("@/modules/lead-module/pages/CreditHistory"));

// Settings.
const ThemeCustomizationWrapper = lazyImport(
  () => import("@/modules/lead-module/components/settings/ThemeCustomizationWrapper"),
);
const ReportBrandingWrapper = lazyImport(
  () => import("@/modules/lead-module/components/settings/ReportBrandingWrapper"),
);
const IntegrationsWrapper = lazyImport(() => import("@/modules/lead-module/components/settings/IntegrationsWrapper"));
const CTACustomizationWrapper = lazyImport(
  () => import("@/modules/lead-module/components/settings/CTACustomizationWrapper"),
);
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";

import { LeadSettingsLayout } from "@/modules/lead-module/components/LeadSettingsLayout";

import type { RouteConfig } from "../routeConfig";

export const leadModuleRoutes: RouteConfig[] = [
  {
    path: "/module/lead",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1, 2]}>
          <LeadLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "report-branding",
        element: <ReportBranding />,
      },
      {
        path: "email-template",
        element: <EmailTemplate />,
      },
      {
        path: "embedded-iframe",
        element: <EmbeddedIframe />,
      },
      {
        path: "integration",
        element: <Integration />,
      },
      {
        path: "credits",
        element: <CreditHistory />,
      },
      {
        path: "settings",
        element: <LeadSettingsLayout />,
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
            path: "report-branding",
            element: <ReportBrandingWrapper />,
          },
          {
            path: "integrations",
            element: <IntegrationsWrapper />,
          },
          {
            path: "cta-customization",
            element: <CTACustomizationWrapper />,
          },
        ],
      },
    ],
  },
];
