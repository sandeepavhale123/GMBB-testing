
import { createSlice } from '@reduxjs/toolkit';

interface ThemeState {
  isDark: boolean;
  accentColor: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'cyan' | 'emerald';
}

const initialState: ThemeState = {
  isDark: false,
  accentColor: 'blue',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDark = !state.isDark;
    },
    setAccentColor: (state, action) => {
      state.accentColor = action.payload;
    },
  },
});

export const { toggleTheme, setAccentColor } = themeSlice.actions;
export default themeSlice.reducer;
