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
  });

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setIsInitialized(true));
  }, []);

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
  const shouldWaitForAuth =
    !isInitialized ||
    (isInitialized &&
      !hasAttemptedRefresh &&
      localStorage.getItem("refresh_token"));

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
