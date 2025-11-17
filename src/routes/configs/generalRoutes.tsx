import Profile from "@/pages/Profile";
import AnalyticsPage from "@/pages/AnalyticsPage";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleProtectedRoute } from "@/routes/RoleProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { RouteConfig } from "../routeConfig";
import { ManageGoogleAccountPage } from "@/components/Settings/ManageGoogleAccountPage";
import { SubscriptionPage } from "@/components/Settings/SubscriptionPage";
import { GenieSubscriptionPage } from "@/components/Settings/GenieSubscriptionPage";
import { ListingManagementPage } from "@/components/Settings/ListingManagementPage";
import { Navigate } from "react-router-dom";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import { VerifyPayment } from "@/pages/VerifyPayment";
import { ListingProvider } from "@/context/ListingContext";
import { VerifyTopUp } from "@/pages/VerifyTopUp";
import { lazyImport } from "../lazyImport";
const ReportsPage = lazyImport(() => import("@/pages/ReportsPage"));
const GMBHealthPage = lazyImport(() => import("@/pages/GMBHealthPage"));

export const generalRoutes: RouteConfig[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Profile />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/:listingId", // 🔥 Add this dynamic route
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <Profile />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <ReportsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reports/:listingId",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <ReportsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <AnalyticsPage />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/team",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <TeamPage />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/google-account",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/subscription",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/theme-customization",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/report-branding",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/genie-subscription",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <SettingsPage />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings/integrations",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/team-members",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/listings/:accountId",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/team-members/edit/:memberId",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/:listingId",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <ListingProvider>
            <SettingsPage />
          </ListingProvider>
        </DashboardTypeGuard>
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
    path: "/verify-topup-credits",
    element: (
      <ProtectedRoute>
        <VerifyTopUp />
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
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <GMBHealthPage />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
  },
  // Catch-all route - must be last
  {
    path: "*",
    element: <NotFound />,
  },
];
