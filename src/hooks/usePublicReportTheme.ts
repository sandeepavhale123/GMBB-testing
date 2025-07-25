import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";
import { getThemeUnauthenticated } from "./useThemeLoader";
import { applyStoredTheme } from "@/utils/themeUtils";

export const usePublicReportTheme = () => {
  const dispatch: AppDispatch = useDispatch();
  const [themeLoading, setThemeLoading] = useState(false);
  const [themeError, setThemeError] = useState<string | null>(null);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        setThemeLoading(true);
        setThemeError(null);
        
        const themeResponse = await getThemeUnauthenticated();

        if (themeResponse.code === 200) {
          dispatch(loadThemeFromAPI(themeResponse.data));
        } else if (themeResponse.code === 401) {
          // API requires authentication but this is a public report
          // Fall back to stored theme from localStorage
          console.warn("Theme API requires authentication for public report, using stored theme");
          applyStoredTheme();
        }
      } catch (error) {
        setThemeError("Failed to load theme");
        console.warn("Failed to load theme on public report page:", error);
        
        // Graceful fallback - try to apply stored theme from localStorage
        applyStoredTheme();
      } finally {
        setThemeLoading(false);
      }
    };

    loadTheme();
  }, [dispatch]);

  return {
    themeLoading,
    themeError,
  };
};