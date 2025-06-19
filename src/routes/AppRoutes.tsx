
import { Routes, Route } from "react-router-dom";
import { AuthInitializer } from "@/store/slices/auth/AuthInitializer";
import { useAxiosAuth } from "@/hooks/useAxiosAuth";
import { routeConfigs } from "./routeConfig";

export const AppRoutes = () => {
  // Initialize axios auth helpers - now inside Router context
  useAxiosAuth();

  return (
    <>
      {/* Kick off auth refresh if refresh token exists */}
      <AuthInitializer />
      <Routes>
        {routeConfigs.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </>
  );
};
