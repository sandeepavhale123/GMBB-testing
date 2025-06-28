
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { rehydrateAuth } from "./authSlice";
import { useAuthRedux } from "./useAuthRedux";
import { saveNavigationState } from "./authHelpers";

export const AuthInitializer = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    accessToken,
    user,
    hasAttemptedRefresh,
    isInitialized,
    isRefreshing,
    refreshAccessToken,
  } = useAuthRedux();

  // Save current route when component mounts (for page refresh scenarios)
  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search;
    console.log("🔧 AuthInitializer mounted on path:", currentPath);

    // Only save the route if we have stored auth data and are on a valid route
    const hasStoredTokens = localStorage.getItem("refresh_token");
    if (hasStoredTokens) {
      saveNavigationState(currentPath);
    }
  }, []);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    console.log("🔄 AuthInitializer: Rehydrating auth state...");
    dispatch(rehydrateAuth());
  }, [dispatch]);

  // Attempt token refresh if we have a refresh token but no access token
  useEffect(() => {
    const attemptRefresh = async () => {
      const hasRefreshToken = localStorage.getItem("refresh_token");
      
      console.log("🔄 AuthInitializer: Checking if refresh needed", {
        isInitialized,
        hasAttemptedRefresh,
        hasAccessToken: !!accessToken,
        hasUser: !!user,
        hasRefreshToken: !!hasRefreshToken,
        isRefreshing
      });

      if (
        isInitialized &&
        !hasAttemptedRefresh &&
        !accessToken &&
        !user &&
        hasRefreshToken &&
        !isRefreshing
      ) {
        console.log("🔄 AuthInitializer: Attempting token refresh...");
        await refreshAccessToken();
      }
    };

    attemptRefresh();
  }, [isInitialized, hasAttemptedRefresh, accessToken, user, isRefreshing, refreshAccessToken]);

  return null;
};
