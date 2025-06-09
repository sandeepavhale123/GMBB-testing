
import React, { createContext, useContext, useEffect } from 'react';
import { useAppSelector } from '../hooks/useRedux';

const ThemeContext = createContext<{}>({});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDark, accentColor } = useAppSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set accent color CSS variables
    const accentColors = {
      blue: { primary: '217 91% 60%', secondary: '217 91% 95%' },
      green: { primary: '142 76% 36%', secondary: '142 76% 95%' },
      purple: { primary: '262 83% 58%', secondary: '262 83% 95%' },
      orange: { primary: '25 95% 53%', secondary: '25 95% 95%' },
    };

    const colors = accentColors[accentColor];
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty('--accent-secondary', colors.secondary);
  }, [isDark, accentColor]);

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
};
