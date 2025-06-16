import { useEffect } from "react";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { setAuthHelpers } from "@/api/axiosInstance";

export const useAxiosAuth = () => {
  const { accessToken, logout, refreshAccessToken } = useAuthRedux();

  useEffect(() => {
    if (accessToken) {
      setAuthHelpers(() => accessToken, logout, refreshAccessToken);
    }
  }, [accessToken, logout, refreshAccessToken]);
};
