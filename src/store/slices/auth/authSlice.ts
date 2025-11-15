import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { clearAuthStorage } from "@/utils/storageUtils";

interface User {
  userId: string;
  role?: string; // Add role field for admin checks
  [key: string]: any; // Add other user properties as needed
}

export interface TokenRefreshPayload {
  refresh_token: string;
  userId: string;
}

export interface TokenRefreshResponse {
  data: {
    access_token: string;
    refresh_token?: string;
    user?: User;
  };
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

// Async thunk for clearing expired tokens and immediately refreshing
export const clearExpiredTokensAndRefresh = createAsyncThunk(
  "auth/clearExpiredTokensAndRefresh",
  async (_, { dispatch, rejectWithValue }) => {
    // Clear expired tokens from state and localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    // Get refresh token for API call
    const refreshToken = localStorage.getItem("refresh_token");
    const userId = localStorage.getItem("userId");

    if (!refreshToken) {
      return rejectWithValue("No refresh token available");
    }

    try {
      const payload: TokenRefreshPayload = {
        refresh_token: refreshToken,
        userId: userId || "",
      };

      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await fetch(`${BASE_URL}/refresh-access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `❌ Refresh API failed with status: ${response.status}, response: ${errorText}`
        );
        throw new Error(`Refresh failed with status: ${response.status}`);
      }

      const data: TokenRefreshResponse = await response.json();

      // Store new tokens
      localStorage.setItem("access_token", data.data.access_token);
      if (data.data.refresh_token) {
        localStorage.setItem("refresh_token", data.data.refresh_token);
      }
      if (data.data.user) {
        localStorage.setItem("user", JSON.stringify(data.data.user));
      }

      return {
        accessToken: data.data.access_token,
        user:
          data.data.user || JSON.parse(localStorage.getItem("user") || "null"),
      };
    } catch (error) {
      console.error(
        "❌ Auto-refresh failed after clearing expired tokens:",
        error
      );

      // Clear all auth data on refresh failure
      clearAuthStorage();

      return rejectWithValue(
        error instanceof Error ? error.message : "Refresh failed"
      );
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
      // Store in localStorage when setting
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
      const refreshToken = localStorage.getItem("refresh_token");

      if (storedAccessToken && storedUser) {
        try {
          state.accessToken = storedAccessToken;
          state.user = JSON.parse(storedUser);
          // Only set hasAttemptedRefresh to true if we have complete auth data
          state.hasAttemptedRefresh = true;
        } catch (error) {
          console.error("❌ Error parsing stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          state.hasAttemptedRefresh = refreshToken ? false : true;
        }
      } else if (refreshToken) {
        // We have a refresh token but no access token - we should attempt refresh

        state.hasAttemptedRefresh = false;
      } else {
        // No tokens at all - mark as attempted so we don't try to refresh

        state.hasAttemptedRefresh = true;
      }

      state.isInitialized = true;
    },
    // Enhanced logout with comprehensive cleanup
    logout: (state) => {
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
      localStorage.removeItem("current_user_session");
      localStorage.removeItem("last_user_session");
      localStorage.removeItem("last_refresh_attempt");
    },
    // Action for clearing expired tokens without full logout
    clearExpiredTokens: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isRefreshing = false;
      // Don't reset hasAttemptedRefresh here - let the refresh logic handle it

      // Clear auth storage but keep refresh token for potential retry
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearExpiredTokensAndRefresh.pending, (state) => {
        state.isRefreshing = true;
        state.accessToken = null;
        state.user = null;
      })
      .addCase(clearExpiredTokensAndRefresh.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.hasAttemptedRefresh = true;
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      })
      .addCase(clearExpiredTokensAndRefresh.rejected, (state, action) => {
        state.isRefreshing = false;
        state.hasAttemptedRefresh = true;
        state.accessToken = null;
        state.user = null;
      });
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
