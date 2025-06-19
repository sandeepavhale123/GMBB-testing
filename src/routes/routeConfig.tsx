
import { authRoutes } from "./configs/authRoutes";
import { dashboardRoutes } from "./configs/dashboardRoutes";
import { generalRoutes } from "./configs/generalRoutes";
import { listingRoutes } from "./configs/listingRoutes";

export interface RouteConfig {
  path: string;
  element: JSX.Element;
}

export const routeConfigs: RouteConfig[] = [
  ...dashboardRoutes,
  ...authRoutes,
  ...generalRoutes,
  ...listingRoutes
];
