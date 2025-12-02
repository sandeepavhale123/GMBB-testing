
import { authRoutes } from "./configs/authRoutes";
import { dashboardRoutes } from "./configs/dashboardRoutes";
import { generalRoutes } from "./configs/generalRoutes";
import { listingRoutes } from "./configs/listingRoutes";
import { rootRoutes } from "./configs/rootRoutes";
import { publicReportRoutes } from "./configs/publicReportRoutes";
import { multiDashboardRoutes } from "./configs/multiDashboardRoutes";
import { geoRankingDashboardRoutes } from "./configs/geoRankingDashboardRoutes";
import { geoRankingModuleRoutes } from "./configs/geoRankingModuleRoutes";
import { reputationModuleRoutes } from "./configs/reputationModuleRoutes";
import { leadModuleRoutes } from "./configs/leadModuleRoutes";
import { liveSeoFixerModuleRoutes } from "./configs/liveSeoFixerModuleRoutes";
import { utilityRoutes } from "./configs/utilityRoutes";
import { socialPosterModuleRoutes } from "./configs/socialPosterModuleRoutes";

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
  ...geoRankingDashboardRoutes,
  ...geoRankingModuleRoutes,
  ...reputationModuleRoutes,
  ...leadModuleRoutes,
  ...liveSeoFixerModuleRoutes,
  ...utilityRoutes,
  ...socialPosterModuleRoutes
];
