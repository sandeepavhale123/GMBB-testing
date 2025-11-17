import { lazyImport } from "../lazyImport";
const LiveSeoFixerLayout = lazyImport(
  () => import("@/modules/live-seo-fixer/components/PageLayout")
);
const Dashboard = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/Dashboard")
);
const CreateProject = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/CreateProject")
);
const ProjectDetail = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/ProjectDetail")
);
const PageSelection = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/PageSelection")
);
const AuditProgress = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/AuditProgress")
);
const AuditResults = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/AuditResults")
);
const AuditResultsGrouped = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/AuditResultsGrouped")
);
const PageAudit = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/PageAudit")
);
const Settings = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/Settings")
);
const ProjectSettings = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/ProjectSettings")
);
const SchemaEditor = lazyImport(
  () => import("@/modules/live-seo-fixer/pages/SchemaEditor")
);
import { Navigate } from "react-router-dom";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";

import { RouteConfig } from "../routeConfig";

export const liveSeoFixerModuleRoutes: RouteConfig[] = [
  {
    path: "/module/live-seo-fixer",
    element: (
      <DashboardTypeGuard allowedDashboardTypes={[0, 1, 2]}>
        <LiveSeoFixerLayout />
      </DashboardTypeGuard>
    ),
    children: [
      {
        path: "",
        element: <Navigate to="/module/live-seo-fixer/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "create-project",
        element: <CreateProject />,
      },
      {
        path: "projects/:projectId",
        element: <ProjectDetail />,
      },
      {
        path: "projects/:projectId/page-selection",
        element: <PageSelection />,
      },
      {
        path: "projects/:projectId/audit-progress",
        element: <AuditProgress />,
      },
      {
        path: "projects/:projectId/audit-results",
        element: <AuditResults />,
      },
      {
        path: "projects/:projectId/audit-results-grouped",
        element: <AuditResultsGrouped />,
      },
      {
        path: "projects/:projectId/pages/:pageId/audit",
        element: <PageAudit />,
      },
      {
        path: "projects/:projectId/pages/:pageId/schema-editor",
        element: <SchemaEditor />,
      },
      {
        path: "projects/:projectId/audits/:auditId/schema-editor",
        element: <SchemaEditor />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
      {
        path: "projects/:projectId/settings",
        element: <ProjectSettings />,
      },
    ],
  },
];
