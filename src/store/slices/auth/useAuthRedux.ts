
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { useLogin } from "./useLogin";
import { useTokenRefresh } from "./useTokenRefresh";
import { useLogout } from "./useLogout";
import { useEffect } from "react";
import { setIsInitialized } from "./authSlice";

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

  console.log("useAuthRedux state:", {
    accessToken: !!accessToken,
    user: !!user,
    isLoading,
    isRefreshing,
    hasAttemptedRefresh,
    isInitialized,
    hasRefreshToken: !!localStorage.getItem("refresh_token")
  });

  const dispatch: AppDispatch = useDispatch();

  // Set initialized flag on mount
  useEffect(() => {
    if (!isInitialized) {
      console.log("useAuthRedux - Setting initialized to true");
      dispatch(setIsInitialized(true));
    }
  }, [dispatch, isInitialized]);

  const { login } = useLogin();
  const { refreshAccessToken } = useTokenRefresh(
    accessToken,
    user,
    isRefreshing
  );
  const { logout } = useLogout();

  // Computed values for better readability
  const isAuthenticated = !!(accessToken && user);
  const isAuthLoading = isLoading || isRefreshing || isAuthenticating;
  
  // Only wait for auth if we have a refresh token and haven't attempted refresh yet
  const hasRefreshToken = !!localStorage.getItem("refresh_token");
  const shouldWaitForAuth = !isInitialized || (!hasAttemptedRefresh && hasRefreshToken);

  console.log("useAuthRedux computed values:", {
    isAuthenticated,
    isAuthLoading,
    shouldWaitForAuth,
    hasRefreshToken
  });

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
  };
};
