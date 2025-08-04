
import { Routes, Route } from "react-router-dom";
import { AuthInitializer } from "@/store/slices/auth/AuthInitializer";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { routeConfigs, RouteConfig } from "./routeConfig";

// Recursive function to render routes with children
const renderRoutes = (routes: RouteConfig[]) => {
  return routes.map((route, index) => (
    <Route
      key={index}
      path={route.path}
      element={route.element}
    >
      {route.children && renderRoutes(route.children)}
    </Route>
  ));
};

export const AppRoutes = () => {
  // Initialize axios auth helpers - now inside Router context
  useAxiosAuth();

  return (
    <>
      {/* Kick off auth refresh if refresh token exists */}
      <AuthInitializer />
      <Routes>
        {renderRoutes(routeConfigs)}
      </Routes>
    </>
  );
};
