import Profile from "@/pages/Profile";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RouteConfig } from "../routeConfig";
import { ManageGoogleAccountPage } from "@/components/Settings/ManageGoogleAccountPage";
import { SubscriptionPage } from "@/components/Settings/SubscriptionPage";
import { GenieSubscriptionPage } from "@/components/Settings/GenieSubscriptionPage";
import { ListingManagementPage } from "@/components/Settings/ListingManagementPage";
import { Navigate } from "react-router-dom";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import { VerifyPayment } from "@/pages/VerifyPayment";
import GMBHealthPage from "@/pages/GMBHealthPage";
import { ListingProvider } from "@/context/ListingContext";

export const generalRoutes: RouteConfig[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Profile />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:listingId", // 🔥 Add this dynamic route
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <Profile />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <TeamPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/google-account",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/subscription",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/genie-subscription",
    element: (
      <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/integrations",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/listings/:accountId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/:listingId",
    element: (
      <ProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify-payment",
    element: (
      <ProtectedRoute>
        <VerifyPayment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/payment-success",
    element: (
      <ProtectedRoute>
        <PaymentSuccess />
      </ProtectedRoute>
    ),
  },
  {
    path: "/gmb-health",
    element: (
      <ProtectedRoute>
        <GMBHealthPage />
      </ProtectedRoute>
    ),
  },
  // Catch-all route - must be last
  {
    path: "*",
    element: <NotFound />,
  },
];
