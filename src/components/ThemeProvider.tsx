
import React, { createContext, useContext, useEffect } from 'react';
import { useAppSelector } from '../hooks/useRedux';

const ThemeContext = createContext<{}>({});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDark, accentColor, accent_color } = useAppSelector((state) => state.theme);

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
    
    // Set gradient variables for dashboard and login components
    root.style.setProperty('--primary-gradient-from', colors.primary);
    root.style.setProperty('--primary-gradient-via', colors.primary);
    
    // If we have a custom hex color from API, convert it to HSL and use it
    if (accent_color && accent_color !== accentColors[accentColor]?.primary) {
      try {
        // Convert hex to RGB first
        const hex = accent_color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Convert RGB to HSL
        const rNorm = r / 255;
        const gNorm = g / 255;
        const bNorm = b / 255;
        
        const max = Math.max(rNorm, gNorm, bNorm);
        const min = Math.min(rNorm, gNorm, bNorm);
        const diff = max - min;
        
        let h = 0;
        if (diff !== 0) {
          if (max === rNorm) h = ((gNorm - bNorm) / diff) % 6;
          else if (max === gNorm) h = (bNorm - rNorm) / diff + 2;
          else h = (rNorm - gNorm) / diff + 4;
        }
        h = Math.round(h * 60);
        if (h < 0) h += 360;
        
        const l = (max + min) / 2;
        const s = diff === 0 ? 0 : diff / (1 - Math.abs(2 * l - 1));
        
        const hslColor = `${h} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
        
        // Use custom color for primary variables
        root.style.setProperty('--primary', hslColor);
        root.style.setProperty('--ring', hslColor);
        root.style.setProperty('--sidebar-ring', hslColor);
        root.style.setProperty('--accent-primary', hslColor);
        root.style.setProperty('--primary-gradient-from', hslColor);
        root.style.setProperty('--primary-gradient-via', hslColor);
      } catch (error) {
        // console.warn('Error converting hex color to HSL:', error);
      }
    }
  }, [isDark, accentColor, accent_color]);

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
};
