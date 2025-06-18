import { configureStore } from "@reduxjs/toolkit";
import dashboardSlice from "./slices/dashboardSlice";
import postsSlice from "./slices/postsSlice";
import reviewsSlice from "./slices/reviewsSlice";
import mediaSlice from "./slices/mediaSlice";
import themeSlice from "./slices/themeSlice";
import authReducer from "./slices/auth/authSlice";
import businessListingsReducer from "./slices/businessListingsSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  reducer: {
    dashboard: dashboardSlice,
    posts: postsSlice,
    reviews: reviewsSlice,
    media: mediaSlice,
    theme: themeSlice,
    auth: authReducer,
    businessListings: businessListingsReducer,
    profile: profileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
