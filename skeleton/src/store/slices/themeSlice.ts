
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
  accentColor: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'cyan' | 'emerald';
  accent_color: string;
  selected_theme: string;
  bg_color: string;
  label_color: string;
  active_menu_bg_color: string;
  active_menu_label_color: string;
  sidebar_border_color?: string;
  sidebar_hover_text_color?: string;
  light_logo?: File | null;
  dark_logo?: File | null;
  favicon?: File | null;
  light_logo_url?: string;
  dark_logo_url?: string;
  favicon_url?: string;
  companyName?: string;
  isLoading: boolean;
}

// Helper function to convert hex color to color name
const getColorNameFromHex = (hexColor: string): 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'cyan' | 'emerald' => {
  const colorMap: Record<string, 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'cyan' | 'emerald'> = {
    '#3B82F6': 'blue',
    '#22C55E': 'green', 
    '#14B8A6': 'teal',
    '#8B5CF6': 'purple',
    '#06B6D4': 'cyan',
    '#10B981': 'emerald',
    '#F97316': 'orange',
  };
  return colorMap[hexColor] || 'blue';
};

// Helper function to convert hex to HSL format
const getHSLFromHex = (hex: string): string => {
  // Convert hex to rgb first
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }
  
  // Convert rgb to hsl
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  // Convert to HSL format for CSS
  const hsl = `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  return hsl;
};

const getInitialState = (): ThemeState => {
  // Load theme from localStorage if available
  const storedTheme = localStorage.getItem('theme_customization');
  if (storedTheme) {
    try {
      const themeData = JSON.parse(storedTheme);
      const accentColorHex = themeData.accent_color || '#3B82F6';
      
      return {
        isDark: false,
        accentColor: getColorNameFromHex(accentColorHex),
        accent_color: accentColorHex,
        selected_theme: themeData.selected_theme || 'custom',
        bg_color: themeData.bg_color || '#1E40AF',
        label_color: themeData.label_color || '#FFFFFF',
        active_menu_bg_color: themeData.active_menu_bg_color || '#1D4ED8',
        active_menu_label_color: themeData.active_menu_label_color || '#FFFFFF',
        sidebar_border_color: themeData.sidebar_border_color,
        sidebar_hover_text_color: themeData.sidebar_hover_text_color,
        light_logo: null,
        dark_logo: null,
        favicon: null,
        light_logo_url: themeData.light_logo,
        dark_logo_url: themeData.dark_logo,
        favicon_url: themeData.favicon,
        companyName: themeData.companyName,
        isLoading: false,
      };
    } catch (error) {
      console.error('Error parsing stored theme:', error);
    }
  }

  return {
    isDark: false,
    accentColor: 'blue',
    accent_color: '#3B82F6',
    selected_theme: 'custom',
    bg_color: '#1E40AF',
    label_color: '#FFFFFF',
    active_menu_bg_color: '#1D4ED8',
    active_menu_label_color: '#FFFFFF',
    sidebar_border_color: undefined,
    sidebar_hover_text_color: undefined,
    light_logo: null,
    dark_logo: null,
    favicon: null,
    light_logo_url: undefined,
    dark_logo_url: undefined,
    favicon_url: undefined,
    companyName: undefined,
    isLoading: false,
  };
};

const initialState: ThemeState = getInitialState();

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setAccentColor: (state, action: PayloadAction<'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'cyan' | 'emerald'>) => {
      state.accentColor = action.payload;
      // Map accent color to hex value
      const colorMap: Record<string, string> = {
        blue: '#3B82F6',
        green: '#22C55E',
        teal: '#14B8A6',
        purple: '#8B5CF6',
        cyan: '#06B6D4',
        emerald: '#10B981',
        orange: '#F97316',
      };
      state.accent_color = colorMap[action.payload] || '#3B82F6';
    },
    setThemeColors: (state, action: PayloadAction<{
      bg_color?: string;
      label_color?: string;
      active_menu_bg_color?: string;
      active_menu_label_color?: string;
    }>) => {
      Object.assign(state, action.payload);
    },
    setSelectedTheme: (state, action: PayloadAction<string>) => {
      state.selected_theme = action.payload;
    },
    setLightLogo: (state, action: PayloadAction<File | null>) => {
      state.light_logo = action.payload;
    },
    setDarkLogo: (state, action: PayloadAction<File | null>) => {
      state.dark_logo = action.payload;
    },
    setFavicon: (state, action: PayloadAction<File | null>) => {
      state.favicon = action.payload;
    },
    setThemeLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    loadThemeFromAPI: (state, action: PayloadAction<{
      accent_color: string;
      selected_theme: string;
      bg_color: string;
      label_color: string;
      active_menu_bg_color: string;
      active_menu_label_color: string;
      sidebar_border_color?: string;
      sidebar_hover_text_color?: string;
      light_logo: string;
      dark_logo: string;
      favicon: string;
      companyName?: string;
    }>) => {
      const themeData = action.payload;
      const accentColorHex = themeData.accent_color.trim();
      
      state.accent_color = accentColorHex;
      state.accentColor = getColorNameFromHex(accentColorHex);
      state.selected_theme = themeData.selected_theme;
      state.bg_color = themeData.bg_color;
      state.label_color = themeData.label_color;
      state.active_menu_bg_color = themeData.active_menu_bg_color;
      state.active_menu_label_color = themeData.active_menu_label_color;
      state.sidebar_border_color = themeData.sidebar_border_color;
      state.sidebar_hover_text_color = themeData.sidebar_hover_text_color;
      state.light_logo_url = themeData.light_logo;
      state.dark_logo_url = themeData.dark_logo;
      state.favicon_url = themeData.favicon;
      state.companyName = themeData.companyName;
      
      // Clear any uploaded file objects when loading from API
      state.light_logo = null;
      state.dark_logo = null;
      state.favicon = null;
      
      // Store in localStorage with proper structure for useThemeLogo hook
      const themeCustomization = {
        ...themeData,
        light_logo: themeData.light_logo,
        dark_logo: themeData.dark_logo,
        favicon: themeData.favicon
      };
      localStorage.setItem('theme_customization', JSON.stringify(themeCustomization));
      
      // Apply theme immediately
      document.documentElement.style.setProperty('--sidebar-bg', themeData.bg_color);
      document.documentElement.style.setProperty('--sidebar-text', themeData.label_color);
      document.documentElement.style.setProperty('--sidebar-active-bg', themeData.active_menu_bg_color);
      document.documentElement.style.setProperty('--sidebar-active-text', themeData.active_menu_label_color);
      
      // Apply accent color globally
      const primaryHsl = getHSLFromHex(themeData.accent_color);
      document.documentElement.style.setProperty('--primary', primaryHsl);
      document.documentElement.style.setProperty('--ring', primaryHsl);
      document.documentElement.style.setProperty('--sidebar-ring', primaryHsl);
      document.documentElement.style.setProperty('--accent-primary', primaryHsl);
      
      // Apply sidebar border and hover text colors if provided
      if (themeData.sidebar_border_color) {
        document.documentElement.style.setProperty('--sidebar-border', themeData.sidebar_border_color);
      }
      if (themeData.sidebar_hover_text_color) {
        document.documentElement.style.setProperty('--sidebar-hover-text', themeData.sidebar_hover_text_color);
      }
      
      // Update favicon if provided
      if (themeData.favicon) {
        const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (faviconLink) {
          faviconLink.href = themeData.favicon;
        } else {
          // Create favicon link if it doesn't exist
          const newFaviconLink = document.createElement('link');
          newFaviconLink.rel = 'icon';
          newFaviconLink.href = themeData.favicon;
          document.head.appendChild(newFaviconLink);
        }
      }
    },
  },
});

export const { 
  toggleTheme, 
  setAccentColor, 
  setThemeColors, 
  setSelectedTheme, 
  setLightLogo, 
  setDarkLogo, 
  setFavicon, 
  setThemeLoading,
  loadThemeFromAPI 
} = themeSlice.actions;
export default themeSlice.reducer;
