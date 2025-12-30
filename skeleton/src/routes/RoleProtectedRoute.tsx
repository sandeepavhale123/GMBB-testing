
import React from "react";
import { Navigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { ProtectedRoute } from "./ProtectedRoute";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  restrictedRoles?: string[];
  redirectTo?: string;
}

const RESTRICTED_SETTINGS_ROUTES = [
  '/settings/google-account',
  '/settings/listings',
  '/settings/team-members',
  '/settings/subscription',
  '/settings/theme-customization',
  '/settings/report-branding',
  '/settings/integrations'
];

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  restrictedRoles = ['staff', 'client'],
  redirectTo = '/location-dashboard'
}) => {
  const { profileData } = useProfile();
  
  // Helper function to check if current route should be restricted
  const shouldRestrictAccess = () => {
    const userRole = profileData?.role?.toLowerCase();
    if (!userRole) return false; // Allow access if role is undefined
    
    const isRestrictedRole = restrictedRoles.some(role => role.toLowerCase() === userRole);
    if (!isRestrictedRole) return false;
    
    // Check if current path matches any restricted route
    const currentPath = window.location.pathname;
    return RESTRICTED_SETTINGS_ROUTES.some(route => 
      currentPath.startsWith(route) || currentPath.includes(route)
    );
  };

  return (
    <ProtectedRoute>
      {shouldRestrictAccess() ? (
        <Navigate to={redirectTo} replace />
      ) : (
        <>{children}</>
      )}
    </ProtectedRoute>
  );
};
