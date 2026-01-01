import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface SupabaseSessionState {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  profileId: string | null;
}

/**
 * Hook to manage Supabase session initialization
 * Checks for existing tokens and exchanges GMBBriefcase token if needed
 */
export const useSupabaseSession = () => {
  const [state, setState] = useState<SupabaseSessionState>({
    isInitialized: false,
    isLoading: true,
    error: null,
    profileId: null,
  });

  const initializingRef = useRef(false);

  // Get GMBBriefcase auth from Redux store
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const user = useSelector((state: RootState) => state.auth.user);

  const initializeSession = useCallback(async () => {
    // Prevent concurrent initialization
    if (initializingRef.current) {
      return;
    }

    // Don't proceed if no GMBBriefcase auth
    if (!accessToken || !user) {
      setState({
        isInitialized: false,
        isLoading: false,
        error: null,
        profileId: null,
      });
      return;
    }

    initializingRef.current = true;

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Check if we already have valid Supabase tokens
      const existingAccessToken = localStorage.getItem("supabase_access_token");
      const existingRefreshToken = localStorage.getItem("supabase_refresh_token");
      const existingProfileId = localStorage.getItem("supabase_profile_id");

      if (existingAccessToken && existingRefreshToken && existingProfileId) {
        // Try to use existing tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: existingAccessToken,
          refresh_token: existingRefreshToken,
        });

        if (!sessionError) {
          // Existing session is valid
          setState({
            isInitialized: true,
            isLoading: false,
            error: null,
            profileId: existingProfileId,
          });
          initializingRef.current = false;
          return;
        }

        // Session invalid, clear tokens and get new ones
        console.log("Existing Supabase session invalid, refreshing...");
        clearSupabaseTokens();
      }

      // No valid tokens, call exchange-token to get new ones
      console.log("Calling exchange-token edge function...");
      const { data, error } = await supabase.functions.invoke("exchange-token", {
        body: {
          access_token: accessToken,
          profile_data: {
            fullName: user.fullName,
            email: user.username,
            avatarUrl: user.profilePic || undefined,
          },
        },
      });

      if (error) {
        console.error("Exchange token error:", error);
        setState({
          isInitialized: false,
          isLoading: false,
          error: error.message || "Failed to establish Supabase session",
          profileId: null,
        });
        initializingRef.current = false;
        return;
      }

      if (!data) {
        setState({
          isInitialized: false,
          isLoading: false,
          error: "No data returned from exchange-token",
          profileId: null,
        });
        initializingRef.current = false;
        return;
      }

      // Set the Supabase session with the returned tokens
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });

      if (sessionError) {
        console.error("Error setting Supabase session:", sessionError);
      }

      // Store tokens for future use
      localStorage.setItem("supabase_access_token", data.access_token);
      localStorage.setItem("supabase_refresh_token", data.refresh_token);
      localStorage.setItem("supabase_profile_id", data.profile_id);

      setState({
        isInitialized: true,
        isLoading: false,
        error: null,
        profileId: data.profile_id,
      });

      console.log("Supabase session established for profile:", data.profile_id);
    } catch (error) {
      console.error("Error initializing Supabase session:", error);
      setState({
        isInitialized: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error",
        profileId: null,
      });
    } finally {
      initializingRef.current = false;
    }
  }, [accessToken, user]);

  // Refresh session using Supabase refresh token
  const refreshSession = useCallback(async (): Promise<boolean> => {
    const existingRefreshToken = localStorage.getItem("supabase_refresh_token");
    
    if (!existingRefreshToken) {
      return false;
    }

    try {
      // Try to refresh using Supabase's built-in refresh
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error || !data.session) {
        // Supabase refresh failed, try to get new tokens via exchange-token
        if (accessToken && user) {
          console.log("Supabase refresh failed, re-exchanging token...");
          clearSupabaseTokens();
          await initializeSession();
          return state.isInitialized;
        }
        return false;
      }

      // Update stored tokens
      localStorage.setItem("supabase_access_token", data.session.access_token);
      localStorage.setItem("supabase_refresh_token", data.session.refresh_token);

      return true;
    } catch (error) {
      console.error("Error refreshing Supabase session:", error);
      return false;
    }
  }, [accessToken, user, initializeSession, state.isInitialized]);

  useEffect(() => {
    // Only initialize if we have GMBBriefcase auth
    if (accessToken && user) {
      initializeSession();
    } else {
      // Clear Supabase session if no GMBBriefcase auth
      setState({
        isInitialized: false,
        isLoading: false,
        error: null,
        profileId: null,
      });
    }
  }, [accessToken, user, initializeSession]);

  // Listen for Supabase auth state changes for silent token refresh
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "TOKEN_REFRESHED" && session) {
          localStorage.setItem("supabase_access_token", session.access_token);
          localStorage.setItem("supabase_refresh_token", session.refresh_token);
        } else if (event === "SIGNED_OUT") {
          clearSupabaseTokens();
          setState({
            isInitialized: false,
            isLoading: false,
            error: null,
            profileId: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    ...state,
    retry: initializeSession,
    refreshSession,
  };
};

/**
 * Clear all Supabase tokens from localStorage
 */
export const clearSupabaseTokens = (): void => {
  localStorage.removeItem("supabase_access_token");
  localStorage.removeItem("supabase_refresh_token");
  localStorage.removeItem("supabase_profile_id");
};

/**
 * Get the stored Supabase profile ID
 */
export const getSupabaseProfileId = (): string | null => {
  return localStorage.getItem("supabase_profile_id");
};
