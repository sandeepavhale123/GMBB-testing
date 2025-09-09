import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { LeadLayout } from "@/modules/lead-module/components/PageLayout";
import Dashboard from "@/modules/lead-module/pages/Dashboard";
import ReportBranding from "@/modules/lead-module/pages/ReportBranding";
import EmailTemplate from "@/modules/lead-module/pages/EmailTemplate";
import EmbeddedIframe from "@/modules/lead-module/pages/EmbeddedIframe";
import Integration from "@/modules/lead-module/pages/Integration";
import CreditHistory from "@/modules/lead-module/pages/CreditHistory";
import { GmbHealthReport } from "@/modules/lead-module/public-reports/pages/GmbHealthReport";
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
        path: "gmb-health-report",
        element: <GmbHealthReport />,
      },
    ],
  },
];