
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import dashboardSlice from "./slices/dashboardSlice";
import postsSlice from "./slices/postsSlice";
import { reviewsReducer } from "./slices/reviews";
import mediaSlice from "./slices/mediaSlice";
import themeSlice from "./slices/themeSlice";
import authReducer from "./slices/auth/authSlice";
import businessListingsReducer from "./slices/businessListingsSlice";
import profileReducer from "./slices/profileSlice";
import insightsReducer from "./slices/insightsSlice";
import qaReducer from "./slices/qaSlice";
import businessInfoReducer from "./slices/businessInfoSlice";
import teamReducer from "./slices/teamSlice";
import { RESET_STORE } from "./actions/globalActions";
import onboardingReducer from "./slices/onboarding/onboardingSlice";
import { timeZoneApi } from "@/api/timeZoneApi";
import { qaApi } from "@/api/qaApi";

// Combine all reducers
const appReducer = combineReducers({
  dashboard: dashboardSlice,
  posts: postsSlice,
  reviews: reviewsReducer,
  media: mediaSlice,
  theme: themeSlice,
  auth: authReducer,
  businessListings: businessListingsReducer,
  profile: profileReducer,
  insights: insightsReducer,
  qa: qaReducer,
  businessInfo: businessInfoReducer,
  team: teamReducer,
  onboarding: onboardingReducer,
  [timeZoneApi.reducerPath]: timeZoneApi.reducer,
  [qaApi.reducerPath]: qaApi.reducer,
});

// Root reducer that handles global store reset
const rootReducer = (state: any, action: any) => {
  // Reset store to initial state when RESET_STORE action is dispatched
  if (action.type === RESET_STORE) {
    console.log("🔄 Global store reset triggered");
    // Clear all storage
    sessionStorage.clear();
    localStorage.clear();
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
    }).concat(timeZoneApi.middleware, qaApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
