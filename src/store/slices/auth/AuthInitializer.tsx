import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { rehydrateAuth, setHasAttemptedRefresh } from "./authSlice";
import { useAuthRedux } from "./useAuthRedux";
import { saveNavigationState } from "./authHelpers";

export const AuthInitializer = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    accessToken,
    user,
    hasAttemptedRefresh,
    isInitialized,
    isRefreshing,
  } = useAuthRedux();

  const timeoutRef = useRef<NodeJS.Timeout>();

  // Save current route when component mounts (for page refresh scenarios)
  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search;
    // console.log("AuthInitializer mounted on path:", currentPath);

    // Only save the route if we have stored auth data and are on a valid route
    const hasStoredTokens = localStorage.getItem("refresh_token");
    if (hasStoredTokens) {
      saveNavigationState(currentPath);
    }
  }, []);

  // Rehydrate from localStorage on first mount
  useEffect(() => {
    // console.log("AuthInitializer: Rehydrating auth state...");
    dispatch(rehydrateAuth());
  }, [dispatch]);

  // Add timeout to prevent infinite loading
  useEffect(() => {
    if (isInitialized && !hasAttemptedRefresh && !isRefreshing) {
      // console.log("AuthInitializer: Setting timeout for refresh attempt");
      timeoutRef.current = setTimeout(() => {
        // console.log("AuthInitializer: Timeout reached, marking refresh as attempted");
        dispatch(setHasAttemptedRefresh(true));
      }, 5000); // 5 second timeout
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [dispatch, isInitialized, hasAttemptedRefresh, isRefreshing]);

  // Clear timeout if refresh is attempted or completed
  useEffect(() => {
    if (hasAttemptedRefresh || isRefreshing) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = undefined;
      }
    }
  }, [hasAttemptedRefresh, isRefreshing]);

  return null;
};
