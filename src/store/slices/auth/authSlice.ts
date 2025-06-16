import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  userId: string;
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
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.isLoading = false;
      state.isRefreshing = false;
      state.hasAttemptedRefresh = false;
      state.isInitialized = false;

      // Clear sessionStorage
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("refresh_token");
      sessionStorage.removeItem("userId");
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
  rehydrateAuth,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
