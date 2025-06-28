
import { useEffect } from "react";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { setAuthHelpers } from "@/api/axiosInstance";

export const useAxiosAuth = () => {
  const { accessToken, logout, refreshAccessToken } = useAuthRedux();

  useEffect(() => {
    console.log('🔧 useAxiosAuth: Setting up auth helpers', { hasToken: !!accessToken });
    // Always set auth helpers, even if no current token
    // This ensures logout and refresh functions are always available
    setAuthHelpers(() => accessToken, logout, refreshAccessToken);
  }, [accessToken, logout, refreshAccessToken]);
};
