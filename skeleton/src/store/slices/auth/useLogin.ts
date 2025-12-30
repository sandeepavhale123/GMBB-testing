import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import {
  setAccessToken,
  setUser,
  setLoading,
  setIsAuthenticating,
  setHasAttemptedRefresh,
} from "./authSlice";
import { clearUserListings } from "../businessListingsSlice";
import { LoginCredentials, LoginResponse } from "./authTypes";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";
import { getTheme } from "@/api/themeApi";
import { loadThemeFromAPI } from "../themeSlice";
import { languageMap } from "@/lib/languageMap";
import i18n from "@/i18n";
import { useSupabaseProfileSync } from "@/hooks/useSupabaseProfileSync";

export const useLogin = () => {
  const dispatch: AppDispatch = useDispatch();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { syncSupabaseProfile } = useSupabaseProfileSync();

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch(setIsAuthenticating(true));
      dispatch(setLoading(true));

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        // credentials: "include", // 👈 This is critical!
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data: LoginResponse = await response.json();

      // set language as soon user login
      const lang = languageMap[data?.data?.profile.language];
      localStorage.setItem("i18nextLng", lang);
      i18n.changeLanguage(lang);
      // Check if subscription is expired based on planExpDate in profile
      const planExpDate = data.data.profile.planExpDate;
      const subscriptionExpired = isSubscriptionExpired(planExpDate);

      // Clear any existing business listings data before setting new user
      dispatch(clearUserListings());

      // Dispatch actions to update Redux state (which also updates localStorage)
      dispatch(setAccessToken(data.data.jwtTokens.access_token));
      dispatch(setUser(data.data.profile));

      // Set hasAttemptedRefresh to true since this is a fresh login with valid tokens
      dispatch(setHasAttemptedRefresh(true));

      // Store additional items in localStorage
      localStorage.setItem("refresh_token", data.data.jwtTokens.refresh_token);
      localStorage.setItem("userId", data.data.profile.userId);
      localStorage.setItem("onboarding", String(data.data.isOnboarding || 0));

      // Store current user session for tracking user changes
      localStorage.setItem("current_user_session", data.data.profile.userId);

      // Sync with Supabase profile (create if not exists, get ID if exists)
      try {
        await syncSupabaseProfile(data.data.jwtTokens.access_token, {
          fullName: data.data.profile.fullName,
          email: data.data.profile.username,
          avatarUrl: data.data.profile.profilePic || undefined,
        });
      } catch (error) {
        // Continue even if Supabase sync fails - non-blocking
        console.warn("Supabase profile sync failed:", error);
      }

      // Load theme after successful login
      try {
        const themeResponse = await getTheme();
        if (themeResponse.code === 200) {
          dispatch(loadThemeFromAPI(themeResponse.data));
        }
      } catch (error) {
        // console.warn("Failed to load theme after login:", error);
        // Graceful fallback - continue without custom theme
      }

      // Return the response with our added subscriptionExpired flag
      return { ...data, subscriptionExpired };
    } catch (error) {
      // console.error("Login error:", error);
      throw error;
    } finally {
      dispatch(setLoading(false));
      dispatch(setIsAuthenticating(false));
    }
  };

  return { login };
};
