
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
import { RESET_STORE } from "./actions/globalActions";

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
});

// Root reducer that handles global store reset
const rootReducer = (state: any, action: any) => {
  // Reset store to initial state when RESET_STORE action is dispatched
  if (action.type === RESET_STORE) {
    console.log('🔄 Global store reset triggered');
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
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
