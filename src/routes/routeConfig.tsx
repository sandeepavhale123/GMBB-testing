
import { authRoutes } from "./configs/authRoutes";
import { dashboardRoutes } from "./configs/dashboardRoutes";
import { generalRoutes } from "./configs/generalRoutes";
import { listingRoutes } from "./configs/listingRoutes";
import { rootRoutes } from "./configs/rootRoutes";
import { publicReportRoutes } from "./configs/publicReportRoutes";
import { multiDashboardRoutes } from "./configs/multiDashboardRoutes";
import { geoRankingDashboardRoutes } from "./configs/geoRankingDashboardRoutes";

export interface RouteConfig {
  path: string;
  element: JSX.Element;
  children?: RouteConfig[];
}

export const routeConfigs: RouteConfig[] = [
  ...rootRoutes,
  ...dashboardRoutes,
  ...authRoutes,
  ...generalRoutes,
  ...listingRoutes,
  ...publicReportRoutes,
  ...multiDashboardRoutes,
  ...geoRankingDashboardRoutes
];
