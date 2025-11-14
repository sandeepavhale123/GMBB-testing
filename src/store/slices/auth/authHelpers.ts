export const saveNavigationState = (currentPath: string) => {
  const shouldSavePath =
    !currentPath.startsWith("/login") &&
    !currentPath.startsWith("/onboarding") &&
    currentPath !== "/";

  if (shouldSavePath) {
    sessionStorage.setItem("post_refresh_path", currentPath);
    sessionStorage.setItem("scrollY", window.scrollY.toString());
    // Also save timestamp to track when this was saved
    sessionStorage.setItem("navigation_saved_at", Date.now().toString());
  } else {
    sessionStorage.removeItem("post_refresh_path");
    sessionStorage.removeItem("scrollY");
    sessionStorage.removeItem("navigation_saved_at");
  }
};

export const restoreNavigationState = (
  navigate: (path: string, options?: any) => void
) => {
  const pathToRedirect = sessionStorage.getItem("post_refresh_path");
  const scrollY = sessionStorage.getItem("scrollY");
  const savedAt = sessionStorage.getItem("navigation_saved_at");

  if (pathToRedirect) {
    // Check if the saved navigation state is not too old (within 5 minutes)
    const savedTimestamp = savedAt ? parseInt(savedAt, 10) : 0;
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;

    if (savedTimestamp > fiveMinutesAgo) {
      // Clear the stored path immediately to prevent loops
      sessionStorage.removeItem("post_refresh_path");
      sessionStorage.removeItem("navigation_saved_at");

      // Navigate with replace to avoid adding to history
      navigate(pathToRedirect, { replace: true });

      // Restore scroll position after navigation
      if (scrollY) {
        sessionStorage.removeItem("scrollY");
        setTimeout(() => {
          window.scrollTo(0, parseInt(scrollY, 10));
        }, 100);
      }

      return true; // Indicate that navigation was restored
    } else {
      sessionStorage.removeItem("post_refresh_path");
      sessionStorage.removeItem("scrollY");
      sessionStorage.removeItem("navigation_saved_at");
    }
  }

  return false; // Indicate that no navigation was restored
};

export const getStoredTokenData = () => {
  const refreshToken = localStorage.getItem("refresh_token");
  const userId = localStorage.getItem("userId");
  return { refreshToken, userId };
};

// Helper to check if we have valid stored auth data
export const hasValidStoredAuth = () => {
  const accessToken = localStorage.getItem("access_token");
  const user = localStorage.getItem("user");
  const refreshToken = localStorage.getItem("refresh_token");

  return !!(accessToken && user && refreshToken);
};

// Helper to save current route for post-refresh navigation
export const saveCurrentRouteForRefresh = () => {
  const currentPath = window.location.pathname + window.location.search;
  saveNavigationState(currentPath);
};
