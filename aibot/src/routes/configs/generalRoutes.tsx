import { Profile } from "@/multiDashboardLayout/pages/Profile";
import TeamPage from "@/pages/TeamPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { RoleProtectedRoute } from "@/routes/RoleProtectedRoute";
import { DashboardTypeGuard } from "@/routes/guards/DashboardTypeGuard";
import { RouteConfig } from "../routeConfig";
import { PaymentSuccess } from "@/pages/PaymentSuccess";
import { VerifyPayment } from "@/pages/VerifyPayment";
import { VerifyTopUp } from "@/pages/VerifyTopUp";
import { StandaloneLayout } from "@/multiDashboardLayout/layouts/StandaloneLayout";

export const generalRoutes: RouteConfig[] = [
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <StandaloneLayout />
        </DashboardTypeGuard>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Profile />,
      },
    ],
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
          <SettingsPage />
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/subscription",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <SettingsPage />
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
    path: "/settings/team-members",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <SettingsPage />
        </DashboardTypeGuard>
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/settings/team-members/edit/:memberId",
    element: (
      <RoleProtectedRoute>
        <DashboardTypeGuard allowedDashboardTypes={[0, 1]}>
          <SettingsPage />
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
  // Catch-all route - must be last
  {
    path: "*",
    element: <NotFound />,
  },
];