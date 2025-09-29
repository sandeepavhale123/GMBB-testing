import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { LeadLayout } from "@/modules/lead-module/components/PageLayout";
import { LeadSettingsLayout } from "@/modules/lead-module/components/LeadSettingsLayout";
import Dashboard from "@/modules/lead-module/pages/Dashboard";
import ReportBranding from "@/modules/lead-module/pages/ReportBranding";
import EmailTemplate from "@/modules/lead-module/pages/EmailTemplate";
import EmbeddedIframe from "@/modules/lead-module/pages/EmbeddedIframe";
import Integration from "@/modules/lead-module/pages/Integration";
import CreditHistory from "@/modules/lead-module/pages/CreditHistory";
import { ThemeCustomizationWrapper } from "@/modules/lead-module/components/settings/ThemeCustomizationWrapper";
import { ReportBrandingWrapper } from "@/modules/lead-module/components/settings/ReportBrandingWrapper";
import { IntegrationsWrapper } from "@/modules/lead-module/components/settings/IntegrationsWrapper";
import { CTACustomizationWrapper } from "@/modules/lead-module/components/settings/CTACustomizationWrapper";
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