import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { rehydrateAuth } from "./authSlice";
import { useAuthRedux } from "./useAuthRedux";

export const AuthInitializer = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    accessToken,
    user,
    refreshAccessToken,
    hasAttemptedRefresh,
    isInitialized,
    isRefreshing,
  } = useAuthRedux();

  // Rehydrate from sessionStorage on first mount
  useEffect(() => {
    console.log("AuthInitializer: Rehydrating auth state...");
    dispatch(rehydrateAuth());
  }, [dispatch]);

  // Attempt token refresh if needed
  useEffect(() => {
    const storedRefreshToken = sessionStorage.getItem("refresh_token");

    // Only attempt refresh if:
    // 1. Auth has been initialized (rehydrated)
    // 2. We haven't attempted refresh yet
    // 3. We don't have valid auth data
    // 4. We have a refresh token
    // 5. We're not currently refreshing
    if (
      isInitialized &&
      !hasAttemptedRefresh &&
      (!accessToken || !user) &&
      storedRefreshToken &&
      !isRefreshing
    ) {
      console.log("AuthInitializer: Attempting token refresh...");

      // Save current path for post-refresh navigation
      const currentPath = window.location.pathname + window.location.search;
      sessionStorage.setItem("post_refresh_path", currentPath);
      sessionStorage.setItem("scrollY", window.scrollY.toString());

      refreshAccessToken();
    }
  }, [
    isInitialized,
    hasAttemptedRefresh,
    accessToken,
    user,
    refreshAccessToken,
    isRefreshing,
  ]);

  return null;
};
