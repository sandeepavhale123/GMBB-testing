
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUser,
  setIsRefreshing,
  setHasAttemptedRefresh,
  clearExpiredTokens,
} from "./authSlice";
import { TokenRefreshPayload, TokenRefreshResponse } from "./authTypes";
import { getStoredTokenData, restoreNavigationState } from "./authHelpers";

export const useTokenRefresh = (
  accessToken: string | null,
  user: any,
  isRefreshing: boolean
) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const refreshAccessToken = async (): Promise<boolean> => {
    console.log("🔄 Starting token refresh...", { 
      hasCurrentToken: !!accessToken, 
      hasUser: !!user, 
      isRefreshing 
    });

    // If already authenticated, no need to refresh
    if (accessToken && user) {
      console.log("✅ Already authenticated, skipping refresh");
      dispatch(setHasAttemptedRefresh(true));
      return true;
    }

    // If already refreshing, wait for it to complete
    if (isRefreshing) {
      console.log("⏳ Refresh already in progress");
      return false;
    }

    dispatch(setIsRefreshing(true));

    const { refreshToken, userId } = getStoredTokenData();

    if (!refreshToken) {
      console.log("❌ No refresh token found");
      dispatch(setIsRefreshing(false));
      dispatch(setHasAttemptedRefresh(true));
      return false;
    }

    try {
      console.log("🔄 Attempting token refresh with refresh token...");

      const payload: TokenRefreshPayload = {
        refresh_token: refreshToken,
        userId: userId || "",
      };

      const response = await fetch(`${BASE_URL}/refresh-access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data: TokenRefreshResponse = await response.json();
      console.log("✅ Token refresh successful, updating auth state");

      // Update Redux state (which also updates sessionStorage)
      dispatch(setAccessToken(data.accessToken));
      dispatch(setUser(data.user));

      // Update refresh token in localStorage
      localStorage.setItem("refresh_token", data.refresh_token);

      console.log("🔄 Auth state updated, new token available:", !!data.accessToken);

      // Attempt to restore navigation state
      const navigationRestored = restoreNavigationState(navigate);

      if (!navigationRestored) {
        console.log("ℹ️ No saved navigation state to restore");
      }

      return true;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);

      // Handle expired or invalid refresh token
      dispatch(clearExpiredTokens());

      return false;
    } finally {
      dispatch(setIsRefreshing(false));
      dispatch(setHasAttemptedRefresh(true));
    }
  };

  return { refreshAccessToken };
};
