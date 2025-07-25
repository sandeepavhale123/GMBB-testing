import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";

export const getThemeUnauthenticated = async () => {
  const domain = window.location.hostname;
  
  console.log("🎨 Requesting theme for domain:", domain);
  console.log("🔗 API URL:", `${import.meta.env.VITE_BASE_URL}/get-theme`);

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/get-theme`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain }),
  });

  const result = await response.json();
  console.log("🎨 Theme API response:", { status: response.status, result });

  if (!response.ok) {
    // Return the parsed result so we can check the code in the calling function
    return result;
  }

  return result;
};

export const useThemeLoader = () => {
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        // console.log('🎨 Loading theme on login page...');
        const themeResponse = await getThemeUnauthenticated();

        if (themeResponse.code === 200) {
          dispatch(loadThemeFromAPI(themeResponse.data));
          // console.log('🎨 Theme loaded successfully on login page');
        }
      } catch (error) {
        console.warn("Failed to load theme on login page:", error);
        // Graceful fallback - continue without custom theme
      }
    };

    loadTheme();
  }, [dispatch]);
};
