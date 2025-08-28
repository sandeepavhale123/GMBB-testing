import { useEffect, useState } from "react";
import { applyStoredTheme } from "@/utils/themeUtils";

interface ThemePreloaderProps {
  children: React.ReactNode;
  loadFromAPI?: boolean;
}

export const ThemePreloader = ({ children, loadFromAPI = false }: ThemePreloaderProps) => {
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Apply stored theme from localStorage
        applyStoredTheme();
        
        // For public routes, we just use stored theme without API calls or Redux
        if (loadFromAPI) {
          console.log("Public route: using stored theme only");
        }
      } catch (error) {
        console.warn("Failed to load theme:", error);
        applyStoredTheme();
      } finally {
        setThemeLoaded(true);
      }
    };

    loadTheme();
  }, [loadFromAPI]);

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