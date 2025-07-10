import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export const useThemeLogo = () => {
  const [logoUrls, setLogoUrls] = useState<{
    darkLogo: string;
    lightLogo: string;
    hasCustomLogo: boolean;
  }>({
    darkLogo: "https://member.gmbbriefcase.com/content/dist/assets/images/logo.png",
    lightLogo: "https://member.gmbbriefcase.com/content/dist/assets/images/logo.png", 
    hasCustomLogo: false
  });

  const themeState = useSelector((state: RootState) => state.theme);

  useEffect(() => {
    const getLogoFromStorage = () => {
      try {
        const storedTheme = localStorage.getItem('theme_customization');
        if (storedTheme) {
          const themeData = JSON.parse(storedTheme);
          const darkLogo = themeData.dark_logo || themeState.dark_logo_url;
          const lightLogo = themeData.light_logo || themeState.light_logo_url;
          
          const defaultLogo = "https://member.gmbbriefcase.com/content/dist/assets/images/logo.png";
          
          setLogoUrls({
            darkLogo: darkLogo || defaultLogo,
            lightLogo: lightLogo || defaultLogo,
            hasCustomLogo: !!(darkLogo || lightLogo)
          });
        }
      } catch (error) {
        console.error('Error reading theme customization from localStorage:', error);
      }
    };

    getLogoFromStorage();
  }, [themeState.dark_logo_url, themeState.light_logo_url]);

  return logoUrls;
};