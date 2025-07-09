
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
  light_logo?: File | null;
  dark_logo?: File | null;
  favicon?: File | null;
  light_logo_url?: string;
  dark_logo_url?: string;
  favicon_url?: string;
  isLoading: boolean;
}

const getInitialState = (): ThemeState => {
  // Load theme from localStorage if available
  const storedTheme = localStorage.getItem('theme_customization');
  if (storedTheme) {
    try {
      const themeData = JSON.parse(storedTheme);
      return {
        isDark: false,
        accentColor: 'blue',
        accent_color: themeData.accent_color || '#3B82F6',
        selected_theme: themeData.selected_theme || 'custom',
        bg_color: themeData.bg_color || '#1E40AF',
        label_color: themeData.label_color || '#FFFFFF',
        active_menu_bg_color: themeData.active_menu_bg_color || '#1D4ED8',
        active_menu_label_color: themeData.active_menu_label_color || '#FFFFFF',
        light_logo: null,
        dark_logo: null,
        favicon: null,
        light_logo_url: themeData.light_logo,
        dark_logo_url: themeData.dark_logo,
        favicon_url: themeData.favicon,
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
    light_logo: null,
    dark_logo: null,
    favicon: null,
    light_logo_url: undefined,
    dark_logo_url: undefined,
    favicon_url: undefined,
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
      light_logo: string;
      dark_logo: string;
      favicon: string;
    }>) => {
      const themeData = action.payload;
      state.accent_color = themeData.accent_color.trim();
      state.selected_theme = themeData.selected_theme;
      state.bg_color = themeData.bg_color;
      state.label_color = themeData.label_color;
      state.active_menu_bg_color = themeData.active_menu_bg_color;
      state.active_menu_label_color = themeData.active_menu_label_color;
      state.light_logo_url = themeData.light_logo;
      state.dark_logo_url = themeData.dark_logo;
      state.favicon_url = themeData.favicon;
      
      // Store in localStorage
      localStorage.setItem('theme_customization', JSON.stringify(themeData));
      
      // Apply theme immediately
      document.documentElement.style.setProperty('--sidebar-bg', themeData.bg_color);
      document.documentElement.style.setProperty('--sidebar-text', themeData.label_color);
      document.documentElement.style.setProperty('--sidebar-active-bg', themeData.active_menu_bg_color);
      document.documentElement.style.setProperty('--sidebar-active-text', themeData.active_menu_label_color);
      
      // Update favicon if provided
      if (themeData.favicon) {
        const faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (faviconLink) {
          faviconLink.href = themeData.favicon;
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
