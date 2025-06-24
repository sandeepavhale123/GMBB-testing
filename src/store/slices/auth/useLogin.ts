
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUser,
  setLoading,
  setIsAuthenticating,
} from "./authSlice";
import { clearUserListings } from "../businessListingsSlice";
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

      // Clear any existing business listings data before setting new user
      dispatch(clearUserListings());
      console.log("🧹 Cleared existing business listings data on login");

      // Dispatch actions to update Redux state (which also updates localStorage)
      dispatch(setAccessToken(data.data.jwtTokens.access_token));
      dispatch(setUser(data.data.profile));

      // Store additional items in localStorage
      localStorage.setItem("refresh_token", data.data.jwtTokens.refresh_token);
      localStorage.setItem("userId", data.data.profile.userId);
      localStorage.setItem("onboarding", String(data.data.isOnboarding || 0));
      
      // Store current user session for tracking user changes
      localStorage.setItem("current_user_session", data.data.profile.userId);
      console.log("💾 Stored user session ID:", data.data.profile.userId);

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
