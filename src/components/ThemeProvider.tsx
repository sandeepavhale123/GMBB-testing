
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

    // Set accent color CSS variables - map to primary theme variables
    const accentColors = {
      blue: { primary: '217 91% 60%', secondary: '217 91% 95%' },
      green: { primary: '142 76% 36%', secondary: '142 76% 95%' },
      purple: { primary: '262 83% 58%', secondary: '262 83% 95%' },
      orange: { primary: '25 95% 53%', secondary: '25 95% 95%' },
      teal: { primary: '173 80% 40%', secondary: '173 80% 95%' },
      cyan: { primary: '188 78% 41%', secondary: '188 78% 95%' },
      emerald: { primary: '160 84% 39%', secondary: '160 84% 95%' },
    };

    const colors = accentColors[accentColor];
    // Update main theme variables
    root.style.setProperty('--primary', colors.primary);
    root.style.setProperty('--ring', colors.primary);
    root.style.setProperty('--sidebar-ring', colors.primary);
    // Keep accent variables for backwards compatibility
    root.style.setProperty('--accent-primary', colors.primary);
    root.style.setProperty('--accent-secondary', colors.secondary);
  }, [isDark, accentColor]);

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
};
