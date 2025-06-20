import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUser,
  setLoading,
  setIsAuthenticating,
} from "./authSlice";
import { LoginCredentials, LoginResponse } from "./authTypes";

export const useLogin = () => {
  const dispatch: AppDispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(setIsAuthenticating(true));
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

      const data: LoginResponse = await response.json();
      console.log("Login response data:", data);

      // Dispatch actions to update Redux state (which also updates localStorage)
      dispatch(setAccessToken(data.data.jwtTokens.access_token));
      dispatch(setUser(data.data.profile));

      // Store additional items in localStorage
      localStorage.setItem("refresh_token", data.data.jwtTokens.refresh_token);
      localStorage.setItem("userId", data.data.profile.userId);
      localStorage.setItem("onboarding", data.data.isOnboarding);

      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticating(false));
    }
  };

  return { login };
};
