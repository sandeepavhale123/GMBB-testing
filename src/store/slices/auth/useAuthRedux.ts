import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useLogin } from "./useLogin";
import { useTokenRefresh } from "./useTokenRefresh";
import { useLogout } from "./useLogout";
import { useEffect } from "react";
import { setIsInitialized } from "./authSlice";
import { useAutoTokenRefresh } from "./useAutoTokenRefresh";

export const useAuthRedux = () => {
  const {
    accessToken,
    user,
    isLoading,
    isRefreshing,
    hasAttemptedRefresh,
    isInitialized,
    isAuthenticating,
  } = useSelector((state: RootState) => state.auth);

  const dispatch: AppDispatch = useDispatch();

  const { login } = useLogin();
  const { refreshAccessToken } = useTokenRefresh(
    accessToken,
    user,
    isRefreshing
  );
  const { logout } = useLogout();

  // Initialize auto token refresh and get the refresh function
  const { refreshIfExpired } = useAutoTokenRefresh();

  // Computed values for better readability
  const isAuthenticated = !!(accessToken && user);
  const isAuthLoading = isLoading || isRefreshing || isAuthenticating;

  // Only wait for auth if we have a refresh token and haven't attempted refresh yet
  const hasRefreshToken = !!localStorage.getItem("refresh_token");
  const shouldWaitForAuth =
    !isInitialized || (!hasAttemptedRefresh && hasRefreshToken);

  // Set initialized flag on mount
  useEffect(() => {
    if (!isInitialized) {
      dispatch(setIsInitialized(true));
    }
  }, [dispatch, isInitialized]);

  // Trigger refresh only once during auth bootstrap
  useEffect(() => {
    const shouldRefresh =
      isInitialized &&
      !hasAttemptedRefresh &&
      !accessToken &&
      localStorage.getItem("refresh_token");

    if (shouldRefresh) {
      refreshAccessToken(); // now globally guarded in useTokenRefresh
    }
  }, [isInitialized, hasAttemptedRefresh, accessToken, refreshAccessToken]);

  return {
    accessToken,
    user,
    isLoading,
    isRefreshing,
    hasAttemptedRefresh,
    isInitialized,
    isAuthenticating,
    isAuthenticated,
    isAuthLoading,
    shouldWaitForAuth,
    login,
    logout,
    refreshAccessToken,
    refreshIfExpired, // Export the immediate refresh function
  };
};
