import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUser,
  setIsRefreshing,
  setHasAttemptedRefresh,
  clearExpiredTokens,
  logout,
} from "./authSlice";
import { TokenRefreshPayload, TokenRefreshResponse } from "./authTypes";
import { getStoredTokenData, restoreNavigationState } from "./authHelpers";
import { jwtDecode } from "jwt-decode";

// Global flag to prevent concurrent refresh attempts
let isRefreshingGlobally = false;

// Helper to check token expiry with buffer
const isTokenExpiredOrNearExpiry = (
  token: string,
  bufferMinutes: number = 1
): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (!decoded?.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferTime = bufferMinutes * 60; // Convert minutes to seconds
    const isExpiredOrNearExpiry = decoded.exp <= currentTime + bufferTime;

    return isExpiredOrNearExpiry;
  } catch (error) {
    console.error("❌ Error decoding token:", error);
    return true; // Consider invalid tokens as expired
  }
};

// Helper to clear all token storage
const clearAllTokenStorage = (dispatch: AppDispatch) => {
  // Clear from localStorage
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
  localStorage.removeItem("userId");

  // Clear from sessionStorage
  sessionStorage.removeItem("post_refresh_path");
  sessionStorage.removeItem("scrollY");
  sessionStorage.removeItem("navigation_saved_at");

  // Clear Redux state
  dispatch(clearExpiredTokens());
};

export const useTokenRefresh = (
  accessToken: string | null,
  user: any,
  isRefreshing: boolean
) => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const refreshAccessToken = async (): Promise<boolean> => {
    // Check if we should skip refresh based on token validity
    if (accessToken && user) {
      // If we have both token and user, check if token is still valid
      if (!isTokenExpiredOrNearExpiry(accessToken, 1)) {
        dispatch(setHasAttemptedRefresh(true));
        return true;
      } else {
        //
      }
    } else if (accessToken && !user) {
      if (isTokenExpiredOrNearExpiry(accessToken, 0)) {
        clearAllTokenStorage(dispatch);
      }
    } else {
      //
    }

    // Prevent concurrent refresh attempts
    if (isRefreshing || isRefreshingGlobally) {
      return false;
    }

    // Get refresh token for API call
    const { refreshToken, userId } = getStoredTokenData();

    if (!refreshToken) {
      dispatch(setHasAttemptedRefresh(true));
      return false;
    }

    // Start refresh process
    isRefreshingGlobally = true;
    dispatch(setIsRefreshing(true));

    try {
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
        const errorText = await response.text();
        console.error(
          `❌ Refresh API failed with status: ${response.status}, response: ${errorText}`
        );

        // Handle different error scenarios
        if (response.status === 401 || response.status === 403) {
          clearAllTokenStorage(dispatch);
          navigate("/login", { replace: true });
          return false;
        }

        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data: TokenRefreshResponse = await response.json();

      // Update Redux state with new tokens
      dispatch(setAccessToken(data.data.access_token));

      // Update user data - either from API response or existing localStorage
      if (data.data.user) {
        dispatch(setUser(data.data.user));
      } else {
        const userData = localStorage.getItem("user");
        if (userData) {
          try {
            dispatch(setUser(JSON.parse(userData)));
          } catch (parseError) {
            console.error("❌ Error parsing stored user data:", parseError);
            localStorage.removeItem("user");
          }
        }
      }

      // Store new refresh token
      if (data.data.refresh_token) {
        localStorage.setItem("refresh_token", data.data.refresh_token);
      }

      // Attempt to restore navigation state
      const navigationRestored = restoreNavigationState(navigate);
      if (!navigationRestored) {
        //
      }

      return true;
    } catch (error) {
      console.error("❌ Token refresh failed with error:", error);

      // On any refresh failure, clear expired tokens and redirect to login
      clearAllTokenStorage(dispatch);
      navigate("/login", { replace: true });
      return false;
    } finally {
      // Always clean up refresh state
      dispatch(setIsRefreshing(false));
      dispatch(setHasAttemptedRefresh(true));
      isRefreshingGlobally = false;
    }
  };

  return { refreshAccessToken };
};
