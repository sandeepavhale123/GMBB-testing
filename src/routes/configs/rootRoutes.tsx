
import { Navigate } from "react-router-dom";
import { RouteConfig } from "../routeConfig";

export const rootRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Navigate to="/location-dashboard/default" replace />
  }
];
