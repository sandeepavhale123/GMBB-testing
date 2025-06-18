
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setAccessToken,
  setUser,
  setLoading,
  rehydrateAuth,
  logout as logoutAction,
  setIsRefreshing,
  setHasAttemptedRefresh,
} from "./authSlice";
import { clearUserListings } from "../businessListingsSlice";
import type { RootState } from "../../store";
import axiosInstance from "../../../api/axiosInstance";

export const useAuthRedux = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { 
    accessToken, 
    user, 
    isLoading, 
    isRefreshing, 
    hasAttemptedRefresh, 
    isInitialized 
  } = useSelector((state: RootState) => state.auth);

  // Initialize auth state from sessionStorage on app start
  useEffect(() => {
    if (!isInitialized) {
      dispatch(rehydrateAuth());
    }
  }, [dispatch, isInitialized]);

  const login = async (email: string, password: string) => {
    dispatch(setLoading(true));
    try {
      const response = await axiosInstance.post("/v1/login", {
        email,
        password,
      });

      if (response.data.code === 200) {
        const { accessToken: token, refreshToken, userDetails } = response.data.data;
        
        // Store tokens
        dispatch(setAccessToken(token));
        dispatch(setUser(userDetails));
        sessionStorage.setItem("refresh_token", refreshToken);
        sessionStorage.setItem("userId", userDetails.userId);

        dispatch(setLoading(false));
        return { success: true };
      } else {
        dispatch(setLoading(false));
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      dispatch(setLoading(false));
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      // Dispatch global store reset to clear all data
      dispatch({ type: 'RESET_STORE' });
      
      // Clear business listings from localStorage
      dispatch(clearUserListings());
      
      // Clear auth state
      dispatch(logoutAction());
      
      // Navigate to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails, clear local state
      dispatch({ type: 'RESET_STORE' });
      dispatch(clearUserListings());
      dispatch(logoutAction());
      navigate("/login");
    }
  };

  const refreshAccessToken = async () => {
    const refreshToken = sessionStorage.getItem("refresh_token");
    
    if (!refreshToken) {
      console.log("No refresh token available");
      dispatch(setHasAttemptedRefresh(true));
      return false;
    }

    if (isRefreshing) {
      console.log("Already refreshing token");
      return false;
    }

    dispatch(setIsRefreshing(true));
    
    try {
      const response = await axiosInstance.post("/v1/refresh-token", {
        refreshToken,
      });

      if (response.data.code === 200) {
        const { accessToken: newAccessToken } = response.data.data;
        dispatch(setAccessToken(newAccessToken));
        dispatch(setHasAttemptedRefresh(true));
        dispatch(setIsRefreshing(false));
        return true;
      } else {
        console.error("Token refresh failed:", response.data.message);
        // Refresh token is invalid/expired - trigger complete logout
        dispatch({ type: 'RESET_STORE' });
        dispatch(clearUserListings());
        dispatch(logoutAction());
        dispatch(setIsRefreshing(false));
        navigate("/login");
        return false;
      }
    } catch (error: any) {
      console.error("Token refresh error:", error);
      
      // Check if the error is due to expired/invalid refresh token
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log("Refresh token expired, redirecting to login");
        // Trigger complete logout and store reset
        dispatch({ type: 'RESET_STORE' });
        dispatch(clearUserListings());
        dispatch(logoutAction());
        navigate("/login");
      }
      
      dispatch(setHasAttemptedRefresh(true));
      dispatch(setIsRefreshing(false));
      return false;
    }
  };

  const isAuthenticated = Boolean(accessToken && user);

  return {
    login,
    logout,
    refreshAccessToken,
    accessToken,
    user,
    isLoading,
    isRefreshing, // Add this missing property
    isAuthenticated,
  };
};
