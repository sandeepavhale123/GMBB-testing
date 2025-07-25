import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";
import { getThemeUnauthenticated } from "@/hooks/useThemeLoader";
import { applyStoredTheme } from "@/utils/themeUtils";

interface ThemePreloaderProps {
  children: React.ReactNode;
  loadFromAPI?: boolean;
}

export const ThemePreloader = ({ children, loadFromAPI = false }: ThemePreloaderProps) => {
  const dispatch: AppDispatch = useDispatch();
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // First, apply any stored theme immediately for instant styling
        applyStoredTheme();
        
        if (loadFromAPI) {
          // Then load fresh theme from API
          const themeResponse = await getThemeUnauthenticated();
          
          if (themeResponse.code === 200) {
            dispatch(loadThemeFromAPI(themeResponse.data));
          } else if (themeResponse.code === 401) {
            console.warn("Theme API requires authentication, using stored theme");
          }
        }
      } catch (error) {
        console.warn("Failed to load theme:", error);
        // Fallback to stored theme is already applied above
      } finally {
        // Allow rendering after theme application
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, [dispatch, loadFromAPI]);

  // Show loading state while theme is being applied
  if (!themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};