import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Only scroll to top on actual navigation, not on refresh
    // Check if this is a fresh navigation (not a refresh with saved scroll position)
    const savedPath = sessionStorage.getItem("post_refresh_path");
    const isRefreshScenario = savedPath && savedPath === pathname;
    
    if (!isRefreshScenario) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};