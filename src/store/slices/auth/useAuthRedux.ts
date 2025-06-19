import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import {
  setAccessToken,
  setUser,
  logout as logoutAction,
  clearExpiredTokens,
  setLoading,
  setIsRefreshing,
  setHasAttemptedRefresh,
} from "./authSlice";
import { resetStore } from "@/store/actions/globalActions";
import { clearUserListings } from "../businessListingsSlice";

export const useAuthRedux = () => {
  const dispatch: AppDispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const {
    accessToken,
    user,
    isLoading,
    isRefreshing,
    hasAttemptedRefresh,
    isInitialized,
  } = useSelector((state: RootState) => state.auth);

  console.log("useAuthRedux state:", {
    accessToken: !!accessToken,
    user: !!user,
    isLoading,
    isRefreshing,
    hasAttemptedRefresh,
    isInitialized,
  });

  const login = async (credentials: { username: string; password: string }) => {
    try {
      dispatch(setLoading(true));

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      console.log("Login response data:", data);

      // Dispatch actions to update Redux state (which also updates sessionStorage)
      dispatch(setAccessToken(data.data.jwtTokens.access_token));
      dispatch(setUser(data.data.profile));

      // Store additional items in sessionStorage
      sessionStorage.setItem(
        "refresh_token",
        data.data.jwtTokens.refresh_token
      );
      sessionStorage.setItem("userId", data.data.profile.userId);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    console.log("Starting token refresh...");

    // If already authenticated, no need to refresh
    if (accessToken && user) {
      console.log("Already authenticated, skipping refresh");
      dispatch(setHasAttemptedRefresh(true));
      return true;
    }

    // If already refreshing, wait for it to complete
    if (isRefreshing) {
      console.log("Refresh already in progress");
      return false;
    }

    dispatch(setIsRefreshing(true));
    dispatch(setHasAttemptedRefresh(true));

    const refreshToken = sessionStorage.getItem("refresh_token");
    const userId = sessionStorage.getItem("userId");

    if (!refreshToken) {
      console.log("No refresh token found");
      dispatch(setIsRefreshing(false));
      return false;
    }

    try {
      console.log("Attempting token refresh...");

      const response = await fetch(`${BASE_URL}/refresh-access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh_token: refreshToken,
          userId: userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Token refresh successful");

      // Update Redux state (which also updates sessionStorage)
      dispatch(setAccessToken(data.accessToken));
      dispatch(setUser(data.user));

      // Update refresh token in sessionStorage
      sessionStorage.setItem("refresh_token", data.refresh_token);

      // Restore navigation state if needed using React Router navigate
      const pathToRedirect = sessionStorage.getItem("post_refresh_path");
      const scrollY = sessionStorage.getItem("scrollY");

      if (pathToRedirect) {
        console.log("Navigating to saved path:", pathToRedirect);
        sessionStorage.removeItem("post_refresh_path");
        // Use React Router navigate instead of window.history.replaceState
        navigate(pathToRedirect, { replace: true });
      }

      if (scrollY) {
        sessionStorage.removeItem("scrollY");
        setTimeout(() => window.scrollTo(0, parseInt(scrollY, 10)), 50);
      }

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Handle expired or invalid refresh token
      dispatch(clearExpiredTokens());
      
      return false;
    } finally {
      dispatch(setIsRefreshing(false));
    }
  };

  const logout = async () => {
    console.log("🚪 Starting enhanced logout process...");
    
    try {
      // Clear business listings first
      dispatch(clearUserListings());
      
      // Clear auth state and storage
      dispatch(logoutAction());
      
      // Reset entire store to initial state
      dispatch(resetStore());
      
      console.log("✅ Enhanced logout completed successfully");
      
      // Navigate to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      
      // Fallback cleanup in case of errors
      dispatch(logoutAction());
      dispatch(resetStore());
      window.location.href = "/login";
    }
  };

  return {
    accessToken,
    user,
    isLoading,
    isRefreshing,
    hasAttemptedRefresh,
    isInitialized,
    login,
    logout,
    refreshAccessToken,
  };
};
