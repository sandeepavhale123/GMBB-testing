import axios from 'axios';
import { store } from '../store/store';
import { setAccessToken, setIsRefreshing, setHasAttemptedRefresh } from '../store/slices/auth/authSlice';
import { clearUserListings } from '../store/slices/businessListingsSlice';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const state = store.getState();
      const isRefreshing = state.auth.isRefreshing;
      
      if (isRefreshing) {
        // Wait for the refresh to complete
        return new Promise((resolve) => {
          const checkAuth = () => {
            const currentState = store.getState();
            if (!currentState.auth.isRefreshing) {
              const newToken = currentState.auth.accessToken;
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                resolve(axiosInstance(originalRequest));
              } else {
                resolve(Promise.reject(error));
              }
            } else {
              setTimeout(checkAuth, 100);
            }
          };
          checkAuth();
        });
      }
      
      store.dispatch(setIsRefreshing(true));
      
      try {
        const refreshToken = sessionStorage.getItem('refresh_token');
        const userId = sessionStorage.getItem('userId');
        
        if (!refreshToken || !userId) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/refresh-token`, {
          refresh_token: refreshToken,
          userId: userId,
        });
        
        const { access_token } = response.data.data;
        
        store.dispatch(setAccessToken(access_token));
        store.dispatch(setIsRefreshing(false));
        store.dispatch(setHasAttemptedRefresh(true));
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        store.dispatch(setIsRefreshing(false));
        store.dispatch(setHasAttemptedRefresh(true));
        
        // Clear all auth data and business listings
        store.dispatch(setAccessToken(null));
        store.dispatch(clearUserListings());
        
        // Dispatch global store reset
        store.dispatch({ type: 'RESET_STORE' });
        
        // Clear all storage
        sessionStorage.clear();
        localStorage.removeItem('businessListings');
        localStorage.removeItem('selectedBusinessId');
        
        // Redirect to login
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
