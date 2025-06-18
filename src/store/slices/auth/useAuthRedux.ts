
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useNavigate } from "react-router-dom";
import {
  setAccessToken,
  setUser,
  logout as logoutAction,
  setLoading,
  setIsRefreshing,
  setHasAttemptedRefresh,
} from "./authSlice";

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
        // Check if it's a 401/403 indicating expired refresh token
        if (response.status === 401 || response.status === 403) {
          console.log("Refresh token expired, triggering logout");
          logout();
          return false;
        }
        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Token refresh successful");

      // Update Redux state (which also updates sessionStorage)
      dispatch(setAccessToken(data.accessToken));
      dispatch(setUser(data.user));

      // Update refresh token in sessionStorage
      sessionStorage.setItem("refresh_token", data.refresh_token);

      // Restore navigation state if needed
      const pathToRedirect = sessionStorage.getItem("post_refresh_path");
      const scrollY = sessionStorage.getItem("scrollY");

      if (pathToRedirect) {
        sessionStorage.removeItem("post_refresh_path");
        window.history.replaceState(null, "", pathToRedirect);
      }

      if (scrollY) {
        sessionStorage.removeItem("scrollY");
        setTimeout(() => window.scrollTo(0, parseInt(scrollY, 10)), 50);
      }

      return true;
    } catch (error) {
      console.error("Token refresh failed:", error);

      // Clear invalid tokens and trigger complete logout
      logout();
      return false;
    } finally {
      dispatch(setIsRefreshing(false));
    }
  };

  const logout = () => {
    console.log("Logout triggered - clearing all state and redirecting");
    
    // Dispatch auth logout action
    dispatch(logoutAction({ meta: { resetStore: false } }));
    
    // Dispatch global store reset
    dispatch({ type: 'RESET_STORE' });
    
    // Redirect to login
    window.location.href = "/login";
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
