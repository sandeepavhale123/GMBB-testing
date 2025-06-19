
import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { ListingProvider } from "@/context/ListingContext";
import { RouteConfig } from "../routeConfig";

export const dashboardRoutes: RouteConfig[] = [
  // Root redirects
  {
    path: "/",
    element: <Navigate to="/location-dashboard/default" replace />
  },
  {
    path: "/location-dashboard",
    element: <Navigate to="/location-dashboard/default" replace />
  },
  
  // Main dashboard route
  {
    path: "/location-dashboard/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Index />
        </ListingProvider>
      </ProtectedRoute>
    )
  }
];
