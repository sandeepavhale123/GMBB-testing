import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { loadThemeFromAPI } from "@/store/slices/themeSlice";

export const getThemeUnauthenticated = async () => {
  const domain = window.location.hostname;

  const response = await fetch(`${import.meta.env.VITE_BASE_URL}/get-theme`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ domain }),
  });

  const result = await response.json();

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
        const themeResponse = await getThemeUnauthenticated();

        if (themeResponse.code === 200) {
          dispatch(loadThemeFromAPI(themeResponse.data));
        }
      } catch (error) {
        // console.warn("Failed to load theme on login page:", error);
        // Graceful fallback - continue without custom theme
      }
    };

    loadTheme();
  }, [dispatch]);
};
