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
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isLoading: false,
  isRefreshing: false,
  hasAttemptedRefresh: false,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
      // Store in sessionStorage when setting
      if (action.payload) {
        sessionStorage.setItem("access_token", action.payload);
      } else {
        sessionStorage.removeItem("access_token");
      }
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      // Store in sessionStorage when setting
      if (action.payload) {
        sessionStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        sessionStorage.removeItem("user");
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
    // Action to rehydrate from sessionStorage
    rehydrateAuth: (state) => {
      const storedAccessToken = sessionStorage.getItem("access_token");
      const storedUser = sessionStorage.getItem("user");

      if (storedAccessToken && storedUser) {
        state.accessToken = storedAccessToken;
        state.user = JSON.parse(storedUser);
      }
      state.isInitialized = true;
      state.hasAttemptedRefresh = true;
    },
    // Enhanced logout with comprehensive cleanup
    logout: (state) => {
      console.log('🚪 Starting logout process...');
      
      // Reset auth state to initial values
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
      state.isRefreshing = false;
      state.hasAttemptedRefresh = false;
      state.isInitialized = false;

      // Clear authentication storage
      clearAuthStorage();
      
      console.log('✅ Logout completed - auth state and storage cleared');
    },
    // Action for clearing expired tokens
    clearExpiredTokens: (state) => {
      console.log('⏰ Clearing expired tokens...');
      
      state.accessToken = null;
      state.user = null;
      state.isRefreshing = false;
      state.hasAttemptedRefresh = true;
      
      // Clear auth storage but keep other data
      clearAuthStorage();
      
      console.log('✅ Expired tokens cleared');
    }
  },
});

export const {
  setAccessToken,
  setUser,
  setLoading,
  setIsRefreshing,
  setHasAttemptedRefresh,
  setIsInitialized,
  rehydrateAuth,
  logout,
  clearExpiredTokens,
} = authSlice.actions;

export default authSlice.reducer;
