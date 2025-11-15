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
      //
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
      return;
    }

    try {
      const success = await refreshAccessToken();
      if (success) {
        //
      } else {
        //
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
      lastTokenRef.current = null;
      return;
    }

    // Check if this is a new token or token has changed
    const tokenChanged = lastTokenRef.current !== accessToken;
    if (tokenChanged) {
      lastTokenRef.current = accessToken;
    }

    // First, check if token is already expired
    if (isTokenExpired(accessToken)) {
      handleImmediateRefresh();
      return;
    }

    // Prevent multiple scheduled refreshes for the same token
    if (isRefreshScheduledRef.current && !tokenChanged) {
      return;
    }

    const timeUntilExpiry = getTimeUntilExpiry(accessToken);

    if (timeUntilExpiry <= 0) {
      handleImmediateRefresh();
      return;
    }

    // Schedule refresh 1 minute before expiry
    const refreshBuffer = 1 * 60 * 1000; // 1 minute in milliseconds
    const timeUntilRefresh = Math.max(0, timeUntilExpiry - refreshBuffer);

    // If the buffer time is greater than the time until expiry, refresh immediately
    if (timeUntilRefresh === 0) {
      handleImmediateRefresh();
      return;
    }

    isRefreshScheduledRef.current = true;
    refreshTimeoutRef.current = setTimeout(async () => {
      isRefreshScheduledRef.current = false;

      // Double-check token hasn't already been refreshed by comparing with current Redux state
      const currentToken = accessToken;
      if (lastTokenRef.current === currentToken) {
        try {
          const success = await refreshAccessToken();
          if (success) {
            //
          } else {
            //
          }
        } catch (error) {
          // console.error("❌ Auto-refresh: Scheduled refresh error:", error);
        }
      } else {
        //
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
