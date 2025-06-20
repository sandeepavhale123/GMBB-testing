import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearAllStorage, clearAuthStorage } from "@/utils/storageUtils";

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
      // Store in loaclStorage when setting
      if (action.payload) {
        localStorage.setItem("access_token", action.payload);
      } else {
        localStorage.removeItem("access_token");
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
      // Store in localStorage when setting
      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setIsRefreshing: (state, action: PayloadAction<boolean>) => {
      state.isRefreshing = action.payload;
    },
    setHasAttemptedRefresh: (state, action: PayloadAction<boolean>) => {
      state.hasAttemptedRefresh = action.payload;
    },
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
    setIsAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticating = action.payload;
    },
    // Action to rehydrate from localStorage
    rehydrateAuth: (state) => {
      const storedAccessToken = localStorage.getItem("access_token");
      const storedUser = localStorage.getItem("user");

      if (storedAccessToken && storedUser) {
        try {
          state.accessToken = storedAccessToken;
          state.user = JSON.parse(storedUser);
          // Only set hasAttemptedRefresh to true if we have valid auth data
          state.hasAttemptedRefresh = true;
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
        }
      }
      state.isInitialized = true;
      // state.hasAttemptedRefresh = true;
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

      console.log("✅ Logout completed - auth state and storage cleared");
    },
    // Action for clearing expired tokens
    clearExpiredTokens: (state) => {
      console.log("⏰ Clearing expired tokens...");

      state.accessToken = null;
      state.user = null;
      state.isRefreshing = false;
      state.hasAttemptedRefresh = true;

      // Clear auth storage but keep other data
      clearAuthStorage();

      console.log("✅ Expired tokens cleared");
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
