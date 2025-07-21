import { useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTokenRefresh } from "./useTokenRefresh";
import { jwtDecode } from "jwt-decode";

// Helper function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded || !decoded.exp) {
      return true; // Consider invalid tokens as expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = decoded.exp <= currentTime;

    if (isExpired) {
      // console.log("🔴 Token is expired:", {
      //   currentTime: new Date(currentTime * 1000).toISOString(),
      //   expiryTime: new Date(decoded.exp * 1000).toISOString(),
      // });
    }

    return isExpired;
  } catch (error) {
    console.error("❌ Error checking token expiry:", error);
    return true;
  }
};

// Helper function to calculate milliseconds until token expires
const getTimeUntilExpiry = (token: string): number => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expiryTime = decoded.exp;
    const timeUntilExpiry = (expiryTime - currentTime) * 1000;

    // console.log("⏰ Token expiry analysis:", {
    //   currentTime: new Date(currentTime * 1000).toISOString(),
    //   expiryTime: new Date(expiryTime * 1000).toISOString(),
    //   timeUntilExpiryMinutes: Math.round(timeUntilExpiry / 1000 / 60),
    // });

    return Math.max(0, timeUntilExpiry);
  } catch (error) {
    console.error("❌ Error calculating time until expiry:", error);
    return 0;
  }
};

export const useAutoTokenRefresh = () => {
  const { accessToken, user, isRefreshing } = useSelector(
    (state: RootState) => state.auth
  );
  const { refreshAccessToken } = useTokenRefresh(
    accessToken,
    user,
    isRefreshing
  );
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const isRefreshScheduledRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  // Computed authentication status
  const isAuthenticated = !!(accessToken && user);

  // Function to handle immediate refresh when token is expired
  const handleImmediateRefresh = useCallback(async () => {
    if (isRefreshing) {
      // console.log(
      //   "🔄 Auto-refresh: Already refreshing, skipping immediate refresh"
      // );
      return;
    }

    // console.log(
    //   "⚠️ Auto-refresh: Token expired or near expiry, refreshing immediately"
    // );
    try {
      const success = await refreshAccessToken();
      if (success) {
        // console.log("✅ Auto-refresh: Immediate token refresh successful");
      } else {
        // console.log("❌ Auto-refresh: Immediate token refresh failed");
      }
    } catch (error) {
      console.error("❌ Auto-refresh: Immediate refresh error:", error);
    }
  }, [refreshAccessToken, isRefreshing]);

  // Effect to handle token changes and expiry checks
  useEffect(() => {
    // Clear any existing timeout when token changes
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = undefined;
      isRefreshScheduledRef.current = false;
    }

    // Only proceed if we have an access token and user is authenticated
    if (!accessToken || !isAuthenticated) {
      // console.log(
      //   "🔄 Auto-refresh: No access token or not authenticated, clearing schedule"
      // );
      lastTokenRef.current = null;
      return;
    }

    // Check if this is a new token or token has changed
    const tokenChanged = lastTokenRef.current !== accessToken;
    if (tokenChanged) {
      // console.log("🔄 Auto-refresh: Token changed, updating reference");
      lastTokenRef.current = accessToken;
    }

    // First, check if token is already expired
    if (isTokenExpired(accessToken)) {
      // console.log(
      //   "🔴 Auto-refresh: Token is already expired, triggering immediate refresh"
      // );
      handleImmediateRefresh();
      return;
    }

    // Prevent multiple scheduled refreshes for the same token
    if (isRefreshScheduledRef.current && !tokenChanged) {
      // console.log(
      //   "🔄 Auto-refresh: Already scheduled for this token, skipping"
      // );
      return;
    }

    const timeUntilExpiry = getTimeUntilExpiry(accessToken);

    if (timeUntilExpiry <= 0) {
      // console.log(
      //   "⚠️ Auto-refresh: Token expiry time calculated as 0 or negative, refreshing immediately"
      // );
      handleImmediateRefresh();
      return;
    }

    // Schedule refresh 1 minute before expiry
    const refreshBuffer = 1 * 60 * 1000; // 1 minute in milliseconds
    const timeUntilRefresh = Math.max(0, timeUntilExpiry - refreshBuffer);

    // If the buffer time is greater than the time until expiry, refresh immediately
    if (timeUntilRefresh === 0) {
      // console.log(
      //   "⚠️ Auto-refresh: Token expires within refresh buffer, refreshing immediately"
      // );
      handleImmediateRefresh();
      return;
    }

    // console.log(
    //   "🔄 Auto-refresh: Scheduling token refresh in",
    //   Math.round(timeUntilRefresh / 1000 / 60),
    //   "minutes"
    // );

    isRefreshScheduledRef.current = true;
    refreshTimeoutRef.current = setTimeout(async () => {
      // console.log("⏰ Auto-refresh: Executing scheduled token refresh");
      isRefreshScheduledRef.current = false;

      // Double-check token hasn't already been refreshed by comparing with current Redux state
      const currentToken = accessToken;
      if (lastTokenRef.current === currentToken) {
        try {
          const success = await refreshAccessToken();
          if (success) {
            // console.log("✅ Auto-refresh: Scheduled token refresh successful");
          } else {
            // console.log("❌ Auto-refresh: Scheduled token refresh failed");
          }
        } catch (error) {
          // console.error("❌ Auto-refresh: Scheduled refresh error:", error);
        }
      } else {
        // console.log(
        //   "ℹ️ Auto-refresh: Token already refreshed by another process"
        // );
      }
    }, timeUntilRefresh);

    // Cleanup function
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = undefined;
        isRefreshScheduledRef.current = false;
      }
    };
  }, [
    accessToken,
    refreshAccessToken,
    isAuthenticated,
    handleImmediateRefresh,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Return the immediate refresh function for external use
  return {
    refreshIfExpired: handleImmediateRefresh,
  };
};
