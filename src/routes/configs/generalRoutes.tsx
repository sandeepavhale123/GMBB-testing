
import Profile from "@/pages/Profile";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleProtectedRoute } from "@/routes/RoleProtectedRoute";
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
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/google-account",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/subscription",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/theme-customization",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/report-branding",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
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
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/team-members",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/listings/:accountId",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/team-members/edit/:memberId",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/:listingId",
    element: (
      <RoleProtectedRoute>
        <ListingProvider>
          <SettingsPage />
        </ListingProvider>
      </RoleProtectedRoute>
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
