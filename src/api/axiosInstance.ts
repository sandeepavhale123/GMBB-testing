import { store } from "./../store/store";
import axios from "axios";
import { RootState } from "@/store/store";
import { clearExpiredTokens, clearExpiredTokensAndRefresh, logout } from "@/store/slices/auth/authSlice";
import { resetStore } from "@/store/actions/globalActions";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const skipAuthRoutes = ["/login", "/refresh-access-token", "/verify-signup"];

// Auth helper functions - will be injected by useAxiosAuth hook
let getAccessToken: (() => string | null) | null = null;
let refreshToken: (() => Promise<boolean>) | null = null;
let handleLogout: (() => void) | null = null;

export const setAuthHelpers = (getToken: () => string | null, logout: () => void, refresh: () => Promise<boolean>) => {
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
const handleAuthFailure = async (shouldForceLogout: boolean = false) => {
  // console.log("🔒 Handling auth failure, force logout:", shouldForceLogout);

  if (shouldForceLogout) {
    // // Clear expired tokens from store
    // store.dispatch(clearExpiredTokens());

    // If we have a logout handler, use it for complete cleanup
    if (handleLogout) {
      // console.log("🚪 Performing complete logout");
      handleLogout();
    } else {
      // Fallback: reset store and redirect
      store.dispatch(logout());
      store.dispatch(resetStore());
      window.location.href = "/login";
    }
  } else {
    // Clear expired tokens and immediately attempt refresh
    // console.log("🔄 Clearing expired tokens and attempting immediate refresh");
    try {
      const result = await store.dispatch(clearExpiredTokensAndRefresh());

      if (clearExpiredTokensAndRefresh.fulfilled.match(result)) {
        // console.log("✅ Auto-refresh successful after token expiry");
        return true;
      } else {
        // console.log("❌ Auto-refresh failed, will redirect to login");
        store.dispatch(logout());
        window.location.href = "/login";
        return false;
      }
    } catch (error) {
      // console.error("❌ Error during auto-refresh:", error);
      store.dispatch(logout());
      window.location.href = "/login";
      return false;
    }
  }
};

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.();
    const isAuthRoute = skipAuthRoutes.some((route) => config.url?.includes(route));

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log(
      //   `🔑 Added token to ${config.method?.toUpperCase()} request to ${
      //     config.url
      //   }`
      // );
    } else if (!isAuthRoute) {
      // console.log(
      //   `⚠️ No token available for ${config.method?.toUpperCase()} request to ${
      //     config.url
      //   }`
      // );
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Enhanced response interceptor with better token refresh handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthRoute = skipAuthRoutes.some((route) => originalRequest.url?.includes(route));

    // Only handle 401 errors on non-auth routes
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthRoute) {
      // console.log("❌ 401 error detected for:", originalRequest.url);
      const errorMessage = error.response?.data?.message;
      // Only perform token refresh/logout for "Invalid token." message
      if (errorMessage === "Invalid token.") {
        // console.log("🔒 Invalid token detected, attempting refresh");

        if (isRefreshing) {
          // If refresh is already in progress, queue this request
          // console.log("⏳ Token refresh in progress, queueing request");
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => {
              // console.log("🔄 Retrying queued request after refresh");
              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // console.log("🔄 Attempting auto-refresh for expired token");

          // Use the new auto-refresh logic
          const refreshSuccess = await handleAuthFailure(false);

          if (refreshSuccess) {
            // console.log(
            //   "✅ Auto-refresh successful, retrying original request"
            // );
            processQueue(null);

            // Get the new token and retry the original request
            const newToken = getAccessToken?.();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              // console.log("🔄 Retrying original request with new token");
              return axiosInstance(originalRequest);
            } else {
              // console.log("❌ No new token available after auto-refresh");
              throw new Error("No token available after refresh");
            }
          } else {
            // console.log("❌ Auto-refresh failed, not retrying request");
            throw new Error("Auto-refresh failed");
          }
        } catch (refreshError) {
          // console.error("❌ Auto-refresh failed:", refreshError);
          processQueue(refreshError, null);

          // Check if we've already attempted refresh recently to prevent loops
          const lastRefreshAttempt = localStorage.getItem("last_refresh_attempt");
          const now = Date.now();
          const fiveMinutesAgo = now - 5 * 60 * 1000;

          if (lastRefreshAttempt && parseInt(lastRefreshAttempt) > fiveMinutesAgo) {
            // console.log("🔒 Recent refresh attempts failed, forcing logout");
            await handleAuthFailure(true);
          } else {
            // console.log("🔒 First recent refresh failure, noting attempt");
            localStorage.setItem("last_refresh_attempt", now.toString());
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // For other 401 errors, show specific toast messages based on the error
        // console.log("⚠️ 401 error with message:", errorMessage);
        // const { t } = useI18nNamespace("api/axiosInstance");
        // Skip toast for specific "no listings found" error as it's handled in components
        if (errorMessage === "No listings found for this history ID.") {
          return Promise.reject(error);
        }

        // Check if this request should skip global error toasts
        const skipGlobalToast = originalRequest.skipGlobalErrorToast;

        // Skip authentication toasts for notification endpoints as they handle 401s gracefully
        const isNotificationEndpoint = originalRequest.url?.includes("/get-beamer-notification");
        if (isNotificationEndpoint) {
          return Promise.reject(error);
        }

        let title = "Access Denied";
        let description = "You don't have permission to perform this action";

        // Special handling for file upload validation errors
        if (originalRequest.url?.includes("/upload-bulk-sheet")) {
          // Check if it's a file validation error (not an auth error)
          if (
            errorMessage?.toLowerCase().includes("invalid file") ||
            errorMessage?.toLowerCase().includes("upload a valid csv") ||
            errorMessage?.toLowerCase().includes("file parameters")
          ) {
            title = "Invalid File";
            description = errorMessage || "Please upload a valid CSV file.";

            // If skipGlobalToast is true, don't show toast here - let component handle it
            if (skipGlobalToast) {
              return Promise.reject(error);
            }
          }
        }
        // Customize message based on specific error types
        else if (errorMessage?.toLowerCase().includes("expired")) {
          title = "Session Expired";
          description = "Your session has expired. Please log in again.";
        } else if (errorMessage?.toLowerCase().includes("insufficient")) {
          title = "Insufficient Permissions";
          description = "You don't have the required permissions for this action.";
        } else if (errorMessage?.toLowerCase().includes("token")) {
          title = "Authentication Error";
          description = "There was an issue with your authentication. Please try logging in again.";
        } else if (errorMessage) {
          description = errorMessage;
        }

        toast({
          title,
          description,
          variant: "destructive",
        });
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
