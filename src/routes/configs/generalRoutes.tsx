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
import { AppLayout, EmptyLayout } from "@/components/Layout";

export const generalRoutes: RouteConfig[] = [
  {
    path: "/profile",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <Profile />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/profile/:listingId", // 🔥 Add this dynamic route
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <Profile />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/analytics",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <AnalyticsPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/team",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <TeamPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings/google-account",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings/subscription",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings/genie-subscription",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings/integrations",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings/listings/:accountId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/settings/:listingId",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/verify-payment",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <VerifyPayment />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/payment-success",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <PaymentSuccess />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  {
    path: "/gmb-health",
    element: (
      <AppLayout>
        <ProtectedRoute>
          <GMBHealthPage />
        </ProtectedRoute>
      </AppLayout>
    ),
  },
  // Catch-all route - must be last
  {
    path: "*",
    element: (
      <EmptyLayout>
        <NotFound />
      </EmptyLayout>
    ),
  },
];
