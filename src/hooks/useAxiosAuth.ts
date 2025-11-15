import { useEffect } from "react";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { setAuthHelpers } from "@/api/axiosInstance";

export const useAxiosAuth = () => {
  const { accessToken, logout, refreshAccessToken } = useAuthRedux();

  useEffect(() => {
    // Always set auth helpers, even if no token initially
    // This ensures logout and refresh functions are always available
    setAuthHelpers(() => accessToken, logout, refreshAccessToken);
  }, [accessToken, logout, refreshAccessToken]);
};
