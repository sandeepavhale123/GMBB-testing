
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
    console.log("🔄 Starting token refresh...");

    // If already authenticated with valid user, no need to refresh
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
      console.log("❌ No refresh token found, cannot refresh");
      dispatch(setIsRefreshing(false));
      dispatch(setHasAttemptedRefresh(true));
      return false;
    }

    try {
      console.log("🔄 Attempting token refresh with API...");

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
      console.log(payload);
      return
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Refresh failed with status: ${response.status}, response: ${errorText}`);
        
        // If refresh token is invalid/expired, clear it but don't force logout yet
        if (response.status === 401 || response.status === 403) {
          console.log("🔒 Refresh token appears to be invalid/expired");
          dispatch(clearExpiredTokens());
          return false;
        }
        
        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data: TokenRefreshResponse = await response.json();
      console.log("✅ Token refresh successful");

      // Update Redux state (which also updates localStorage)
      dispatch(setAccessToken(data.accessToken));
      dispatch(setUser(data.user));

      // Update refresh token in localStorage
      localStorage.setItem("refresh_token", data.refresh_token);

      // Attempt to restore navigation state
      const navigationRestored = restoreNavigationState(navigate);

      if (!navigationRestored) {
        console.log("ℹ️ No saved navigation state to restore");
      }

      return true;
    } catch (error) {
      console.error("❌ Token refresh failed:", error);

      // Only clear tokens if we're sure they're invalid
      // Don't force logout here - let the caller decide
      dispatch(clearExpiredTokens());
      return false;
    } finally {
      dispatch(setIsRefreshing(false));
      dispatch(setHasAttemptedRefresh(true));
    }
  };

  return { refreshAccessToken };
};
