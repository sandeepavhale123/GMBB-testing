import { configureStore, combineReducers } from "@reduxjs/toolkit";
import themeSlice from "./slices/themeSlice";
import authReducer from "./slices/auth/authSlice";
import businessListingsReducer from "./slices/businessListingsSlice";
import profileReducer from "./slices/profileSlice";
import teamReducer from "./slices/teamSlice";
import { RESET_STORE } from "./actions/globalActions";
import { timeZoneApi } from "@/api/timeZoneApi";

// Combine all reducers
const appReducer = combineReducers({
  theme: themeSlice,
  auth: authReducer,
  businessListings: businessListingsReducer,
  profile: profileReducer,
  team: teamReducer,
  [timeZoneApi.reducerPath]: timeZoneApi.reducer,
});

// Root reducer that handles global store reset
const rootReducer = (state: any, action: any) => {
  // Reset store to initial state when RESET_STORE action is dispatched
  if (action.type === RESET_STORE) {
    // Preserve certain keys before clearing
    const preservedKeys = ["theme", "i18nextLng"];
    const preservedData: Record<string, string> = {};

    preservedKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        preservedData[key] = value;
      }
    });

    // Clear all storage
    sessionStorage.clear();
    localStorage.clear();

    // Restore preserved keys
    Object.entries(preservedData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Return undefined to reset to initial state
    state = undefined;
  }

  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(timeZoneApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
