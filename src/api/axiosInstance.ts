
import { store } from "./../store/store";
import axios from "axios";
import { RootState } from "@/store/store";
import { logout, setAccessToken } from "@/store/slices/auth/authSlice";

const BASE_URL = "https://member.gmbbriefcase.com/api";

const skipAuthRoutes = ["/v1/login", "/v1/refresh-access-token"];

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
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // withCredentials: true, // This ensures cookies are sent with requests
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

// Request interceptor to add access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken?.();
    const isAuthRoute = skipAuthRoutes.some((route) =>
      config.url?.includes(route)
    );

    if (token && !isAuthRoute) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for automatic token refresh
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
      console.log("Axios: 401 error detected, attempting token refresh");

      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        console.log("Axios: Token refresh in progress, queueing request");
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      try {
        if (!refreshToken) {
          throw new Error("No refresh function available");
        }

        const success = await refreshToken();
        if (success) {
          console.log(
            "Axios: Token refresh successful, retrying original request"
          );
          processQueue(null);

          // Get the new token and retry the original request
          const newToken = getAccessToken?.();
          if (newToken) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return axiosInstance(originalRequest);
        } else {
          throw new Error("Token refresh failed");
        }
      } catch (refreshError) {
        console.error("Axios: Token refresh failed, clearing state and redirecting");
        processQueue(refreshError, null);

        // Dispatch global store reset and logout
        store.dispatch({ type: 'RESET_STORE' });
        store.dispatch(logout());
        
        // Clear any remaining storage
        sessionStorage.clear();
        localStorage.removeItem('userBusinessListings');
        
        // Redirect to login
        window.location.href = "/login";
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
