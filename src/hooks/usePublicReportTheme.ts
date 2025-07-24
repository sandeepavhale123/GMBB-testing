import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";
import { getThemeUnauthenticated } from "./useThemeLoader";

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
        }
      } catch (error) {
        setThemeError("Failed to load theme");
        // Graceful fallback - continue without custom theme
        console.warn("Failed to load theme on public report page:", error);
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