import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useThemeLogo = () => {
  const [logoUrls, setLogoUrls] = useState<{
    darkLogo: string;
    lightLogo: string;
    hasCustomLogo: boolean;
  }>({
    darkLogo: "https://old.gmbbriefcase.com/content/dist/assets/images/dark-logo.png",
    lightLogo: "https://old.gmbbriefcase.com/content/dist/assets/images/dark-logo.png", 
    hasCustomLogo: false
  });

  const themeState = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const getLogoFromStorage = () => {
      try {
        const defaultLogo = "https://old.gmbbriefcase.com/content/dist/assets/images/dark-logo.png";
        
        // Check localStorage first
        const storedTheme = localStorage.getItem('theme_customization');
        let darkLogo = themeState.dark_logo_url;
        let lightLogo = themeState.light_logo_url;
        
        if (storedTheme) {
          const themeData = JSON.parse(storedTheme);
          // Prefer stored theme data, then Redux state, then default
          darkLogo = themeData.dark_logo || themeState.dark_logo_url;
          lightLogo = themeData.light_logo || themeState.light_logo_url;
        }
        
        setLogoUrls({
          darkLogo: darkLogo || defaultLogo,
          lightLogo: lightLogo || defaultLogo,
          hasCustomLogo: !!(darkLogo || lightLogo)
        });
      } catch (error) {
        console.error('Error reading theme customization from localStorage:', error);
        // Fallback to Redux state only
        const defaultLogo = "https://old.gmbbriefcase.com/content/dist/assets/images/dark-logo.png";
        setLogoUrls({
          darkLogo: themeState.dark_logo_url || defaultLogo,
          lightLogo: themeState.light_logo_url || defaultLogo,
          hasCustomLogo: !!(themeState.dark_logo_url || themeState.light_logo_url)
        });
      }
    };

    getLogoFromStorage();
  }, [themeState.dark_logo_url, themeState.light_logo_url]);

  return logoUrls;
};