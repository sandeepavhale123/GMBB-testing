import { store } from "./../store/store";
import axios from "axios";
import { RootState } from "@/store/store";
import { clearExpiredTokens, logout } from "@/store/slices/auth/authSlice";
import { resetStore } from "@/store/actions/globalActions";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const skipAuthRoutes = ["/login", "/refresh-access-token", "/verify-signup"];

// Auth helper functions - will be injected by useAxiosAuth hook
let getAccessToken: (() => string | null) | null = null;
let refreshToken: (() => Promise<boolean>) | null = null;
let handleLogout: (() => void) | null = null;

export const setAuthHelpers = (
  getToken: () => string | null,
  logout: () => void,
  refresh: () => Promise<boolean>
) => {
  getAccessToken = getToken;
  handleLogout = logout;
  refreshToken = refresh;
  // console.log("🔧 Auth helpers updated in axios instance");
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track ongoing refresh attempts to prevent multiple simultaneous refreshes
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Enhanced function to handle token expiry with more nuanced logic
const handleAuthFailure = (shouldForceLogout: boolean = false) => {
  console.log("🔒 Handling auth failure, force logout:", shouldForceLogout);

  if (shouldForceLogout) {
    // Clear expired tokens from store
    store.dispatch(clearExpiredTokens());

    // If we have a logout handler, use it for complete cleanup
    if (handleLogout) {
      console.log("🚪 Performing complete logout");
      handleLogout();
    } else {
      // Fallback: reset store and redirect
      store.dispatch(resetStore());
      window.location.href = "/login";
    }
  } else {
    // Just clear tokens but don't force logout yet
    console.log("🔒 Clearing expired tokens without logout");
    // store.dispatch(clearExpiredTokens());
  }
};

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.();
    const isAuthRoute = skipAuthRoutes.some((route) =>
      config.url?.includes(route)
    );

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        `🔑 Added token to ${config.method?.toUpperCase()} request to ${
          config.url
        }`
      );
    } else if (!isAuthRoute) {
      console.log(
        `⚠️ No token available for ${config.method?.toUpperCase()} request to ${
          config.url
        }`
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Enhanced response interceptor with better token refresh handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = skipAuthRoutes.some((route) =>
      originalRequest.url?.includes(route)
    );

    // Only handle 401 errors on non-auth routes
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthRoute
    ) {
      console.log("❌ 401 error detected for:", originalRequest.url);

      // Check if we have refresh capability
      if (!refreshToken) {
        console.log("❌ No refresh function available, cannot retry");
        handleAuthFailure(true);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        console.log("⏳ Token refresh in progress, queueing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            console.log("🔄 Retrying queued request after refresh");
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄 Attempting token refresh for failed request");
        const success = await refreshToken();

        if (success) {
          console.log("✅ Token refresh successful, retrying original request");
          processQueue(null);

          // Get the new token and retry the original request
          const newToken = getAccessToken?.();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log("🔄 Retrying original request with new token");
            return axiosInstance(originalRequest);
          } else {
            console.log("❌ No new token available after refresh");
            throw new Error("No token available after refresh");
          }
        } else {
          console.log("❌ Token refresh failed, not retrying request");
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        console.error("❌ Token refresh failed:", refreshError);
        processQueue(refreshError, null);

        // Only force logout if refresh explicitly failed multiple times
        // Check if we've already attempted refresh recently
        const lastRefreshAttempt = localStorage.getItem("last_refresh_attempt");
        const now = Date.now();
        const fiveMinutesAgo = now - 5 * 60 * 1000;

        if (
          lastRefreshAttempt &&
          parseInt(lastRefreshAttempt) > fiveMinutesAgo
        ) {
          console.log("🔒 Recent refresh attempts failed, forcing logout");
          handleAuthFailure(true);
        } else {
          console.log(
            "🔒 First recent refresh failure, not forcing logout yet"
          );
          localStorage.setItem("last_refresh_attempt", now.toString());
          handleAuthFailure(false);
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other auth errors more gracefully
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isAuthRoute
    ) {
      console.log("🔒 Auth error detected, but not forcing immediate logout");
      handleAuthFailure(false);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
