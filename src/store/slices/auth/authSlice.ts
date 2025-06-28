import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAuthStorage } from "@/utils/storageUtils";

interface User {
  userId: string;
  role?: string; // Add role field for admin checks
  [key: string]: any; // Add other user properties as needed
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isLoading: boolean;
  isRefreshing: boolean;
  hasAttemptedRefresh: boolean;
  isInitialized: boolean; // New flag to track if auth has been initialized
  isAuthenticating: boolean; // New flag for login attempts
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoading: false,
  isRefreshing: false,
  hasAttemptedRefresh: false,
  isInitialized: false,
  isAuthenticating: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      // Store in localStorage when setting
      if (action.payload) {
        localStorage.setItem("access_token", action.payload);
        console.log("🔑 Access token stored in localStorage");
      } else {
        localStorage.removeItem("access_token");
        console.log("🗑️ Access token removed from localStorage");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      // Store in localStorage when setting
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
        console.log("👤 User data stored in localStorage");
      } else {
        localStorage.removeItem("user");
        console.log("🗑️ User data removed from localStorage");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
      console.log('🔄 AuthSlice: isRefreshing set to:', action.payload);
    },
    setHasAttemptedRefresh: (state, action: PayloadAction<boolean>) => {
      state.hasAttemptedRefresh = action.payload;
      console.log('🔄 AuthSlice: hasAttemptedRefresh set to:', action.payload);
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
      console.log('🏁 AuthSlice: isInitialized set to:', action.payload);
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    // Action to rehydrate from localStorage
    rehydrateAuth: (state) => {
      console.log("🔄 AuthSlice: Rehydrating auth state from localStorage");
      const storedAccessToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");
      const refreshToken = localStorage.getItem("refresh_token");

      if (storedAccessToken && storedUser) {
        try {
          state.accessToken = storedAccessToken;
          state.user = JSON.parse(storedUser);
          // Only set hasAttemptedRefresh to true if we have complete auth data
          state.hasAttemptedRefresh = true;
          console.log('✅ AuthSlice: Rehydrated with valid auth data, hasAttemptedRefresh = true');
        } catch (error) {
          console.error("❌ Error parsing stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          state.hasAttemptedRefresh = refreshToken ? false : true;
        }
      } else if (refreshToken) {
        // We have a refresh token but no access token - we should attempt refresh
        console.log('🔄 AuthSlice: Have refresh token but no access token, will attempt refresh');
        state.hasAttemptedRefresh = false;
      } else {
        // No tokens at all - mark as attempted so we don't try to refresh
        console.log('❌ AuthSlice: No tokens found, marking refresh as attempted');
        state.hasAttemptedRefresh = true;
      }
      
      state.isInitialized = true;
    },
    // Enhanced logout with comprehensive cleanup
    logout: (state) => {
      console.log("🚪 Starting logout process...");

      // Reset auth state to initial values
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
      state.isRefreshing = false;
      state.hasAttemptedRefresh = false;
      state.isInitialized = false;
      state.isAuthenticating = false;

      // Clear authentication storage
      clearAuthStorage();
      
      // Clear user session tracking and refresh attempt tracking
      localStorage.removeItem('current_user_session');
      localStorage.removeItem('last_user_session');
      localStorage.removeItem('last_refresh_attempt');

      console.log("✅ Logout completed - auth state and storage cleared");
    },
    // Action for clearing expired tokens without full logout
    clearExpiredTokens: (state) => {
      console.log("⏰ Clearing expired tokens...");

      state.accessToken = null;
      state.user = null;
      state.isRefreshing = false;
      // Don't reset hasAttemptedRefresh here - let the refresh logic handle it

      // Clear auth storage but keep refresh token for potential retry
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      console.log("✅ Expired tokens cleared, refresh token preserved");
    },
  },
});

export const {
  setAccessToken,
  setUser,
  setLoading,
  setIsRefreshing,
  setHasAttemptedRefresh,
  setIsInitialized,
  setIsAuthenticating,
  rehydrateAuth,
  logout,
  clearExpiredTokens,
} = authSlice.actions;

export default authSlice.reducer;
