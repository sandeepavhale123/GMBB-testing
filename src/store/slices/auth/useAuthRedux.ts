
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { setAccessToken, setUser, setLoading, logout as logoutAction } from './authSlice';
import { clearUserListings } from '../businessListingsSlice';
import axiosInstance from '../../api/axiosInstance';

export const useAuthRedux = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { accessToken, user, isLoading } = useAppSelector((state) => state.auth);

  const login = useCallback(async (email: string, password: string) => {
    dispatch(setLoading(true));
    
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      
      const { access_token, refresh_token, user: userData } = response.data.data;
      
      dispatch(setAccessToken(access_token));
      dispatch(setUser(userData));
      
      sessionStorage.setItem('refresh_token', refresh_token);
      sessionStorage.setItem('userId', userData.userId);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');
    const userId = sessionStorage.getItem('userId');
    
    if (!refreshToken || !userId) {
      console.log('No refresh token or userId found');
      return false;
    }

    try {
      const response = await axiosInstance.post('/auth/refresh-token', {
        refresh_token: refreshToken,
        userId: userId,
      });

      const { access_token, user: userData } = response.data.data;
      
      dispatch(setAccessToken(access_token));
      dispatch(setUser(userData));
      
      return true;
    } catch (error: any) {
      console.error('Token refresh failed:', error);
      
      // Check if refresh token is expired (401/403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Refresh token expired, logging out and redirecting to login');
        await logout();
        navigate('/login');
      }
      
      return false;
    }
  }, [dispatch, navigate]);

  const logout = useCallback(async () => {
    try {
      // Clear business listings from localStorage
      await dispatch(clearUserListings());
      
      // Clear auth state and storage
      dispatch(logoutAction());
      
      // Dispatch global store reset
      dispatch({ type: 'RESET_STORE' });
      
      console.log('User logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if API call fails
      dispatch(logoutAction());
      dispatch({ type: 'RESET_STORE' });
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return {
    login,
    logout,
    refreshAccessToken,
    accessToken,
    user,
    isLoading,
    isAuthenticated: !!accessToken && !!user,
  };
};
