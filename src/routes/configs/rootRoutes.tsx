import { Navigate } from "react-router-dom";
import { SmartRedirect } from "./SmartRedirect";
import { RouteConfig } from "../routeConfig";

export const rootRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <SmartRedirect />,
  },
];
