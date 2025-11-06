import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { MapCreatorLayout } from "@/utility/map-creator/components/MapCreatorLayout";
import { MapCreatorPage } from "@/utility/map-creator/pages/MapCreatorPage";
import type { RouteConfig } from "../routeConfig";

export const utilityRoutes: RouteConfig[] = [
  {
    path: "/utility/map-creator",
    element: (
      <ProtectedRoute>
        <MapCreatorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <MapCreatorPage />,
      },
    ],
  },
];
