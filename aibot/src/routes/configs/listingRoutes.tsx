import { Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteConfig } from "../routeConfig";
import { lazyImport } from "../lazyImport";

const PlanExpiredPage = lazyImport(() => import("@/pages/PlanExpiredPage"));

export const listingRoutes: RouteConfig[] = [
  {
    path: "/plan-expired",
    element: (
      <ProtectedRoute>
        <PlanExpiredPage />
      </ProtectedRoute>
    ),
  },
];
