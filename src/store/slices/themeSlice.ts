
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
  isLoading: boolean;
}

const initialState: ThemeState = {
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
  isLoading: false,
};

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
  setThemeLoading 
} = themeSlice.actions;
export default themeSlice.reducer;
