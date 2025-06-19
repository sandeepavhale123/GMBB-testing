
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useLogin } from "./useLogin";
import { useTokenRefresh } from "./useTokenRefresh";
import { useLogout } from "./useLogout";

export const useAuthRedux = () => {
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

  const { login } = useLogin();
  const { refreshAccessToken } = useTokenRefresh(accessToken, user, isRefreshing);
  const { logout } = useLogout();

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
