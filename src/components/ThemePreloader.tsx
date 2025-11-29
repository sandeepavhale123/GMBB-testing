import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { applyStoredTheme } from "@/utils/themeUtils";
import { getThemeUnauthenticated } from "@/hooks/useThemeLoader";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";
import { AppDispatch } from "@/store/store";

// Session-level cache to prevent duplicate API calls
let themeLoadedInSession = false;

interface ThemePreloaderProps {
  children: React.ReactNode;
  loadFromAPI?: boolean;
}

export const ThemePreloader = ({
  children,
  loadFromAPI = false,
}: ThemePreloaderProps) => {
  const [themeLoaded, setThemeLoaded] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Apply stored theme from localStorage first
        applyStoredTheme();

        // If loadFromAPI is true and we haven't loaded in this session yet
        if (loadFromAPI && !themeLoadedInSession) {
          // Set flag immediately to prevent duplicate calls
          themeLoadedInSession = true;
          
          const themeResponse = await getThemeUnauthenticated();

          if (themeResponse.code === 200) {
            dispatch(loadThemeFromAPI(themeResponse.data));
          } else {
            console.warn(
              "Theme API returned non-200 status, using stored theme"
            );
          }
        }
      } catch (error) {
        // console.warn("Failed to load theme:", error);
        // Fallback to stored theme
        applyStoredTheme();
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, [loadFromAPI, dispatch]);

  // Show loading state while theme is being applied
  if (!themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
