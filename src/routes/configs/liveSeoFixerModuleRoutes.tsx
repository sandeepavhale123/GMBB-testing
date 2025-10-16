import { Navigate } from "react-router-dom";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { LiveSeoFixerLayout } from "@/modules/live-seo-fixer/components/PageLayout";
import { Dashboard } from "@/modules/live-seo-fixer/pages/Dashboard";
import { CreateProject } from "@/modules/live-seo-fixer/pages/CreateProject";
import { ProjectDetail } from "@/modules/live-seo-fixer/pages/ProjectDetail";
import { PageSelection } from "@/modules/live-seo-fixer/pages/PageSelection";
import { AuditProgress } from "@/modules/live-seo-fixer/pages/AuditProgress";
import { AuditResults } from "@/modules/live-seo-fixer/pages/AuditResults";
import { AuditResultsGrouped } from "@/modules/live-seo-fixer/pages/AuditResultsGrouped";
import { PageAudit } from "@/modules/live-seo-fixer/pages/PageAudit";
import { Settings } from "@/modules/live-seo-fixer/pages/Settings";
import { ProjectSettings } from "@/modules/live-seo-fixer/pages/ProjectSettings";
import { SchemaEditor } from "@/modules/live-seo-fixer/pages/SchemaEditor";
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
        element: <Navigate to="/module/live-seo-fixer/dashboard" replace />
      },
      {
        path: "dashboard",
        element: <Dashboard />
      },
      {
        path: "create-project",
        element: <CreateProject />
      },
      {
        path: "projects/:projectId",
        element: <ProjectDetail />
      },
      {
        path: "projects/:projectId/page-selection",
        element: <PageSelection />
      },
      {
        path: "projects/:projectId/audit-progress",
        element: <AuditProgress />
      },
      {
        path: "projects/:projectId/audit-results",
        element: <AuditResults />
      },
      {
        path: "projects/:projectId/audit-results-grouped",
        element: <AuditResultsGrouped />
      },
      {
        path: "projects/:projectId/pages/:pageId/audit",
        element: <PageAudit />
      },
      {
        path: "projects/:projectId/pages/:pageId/schema-editor",
        element: <SchemaEditor />
      },
      {
        path: "projects/:projectId/audits/:auditId/schema-editor",
        element: <SchemaEditor />
      },
      {
        path: "settings",
        element: <Settings />
      },
      {
        path: "projects/:projectId/settings",
        element: <ProjectSettings />
      }
    ]
  }
];