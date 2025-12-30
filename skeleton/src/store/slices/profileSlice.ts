import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService, ProfileData, UpdateProfileData, TimezoneOption } from '../../services/profileService';

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async () => {
    return await profileService.getUserProfile();
  }
);

export const fetchTimezones = createAsyncThunk(
  'profile/fetchTimezones',
  async () => {
    return await profileService.getTimezones();
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: UpdateProfileData) => {
    await profileService.updateProfile(profileData);
    return profileData;
  }
);

interface ProfileState {
  data: ProfileData | null;
  timezones: TimezoneOption | null;
  isLoading: boolean;
  isUpdating: boolean;
  isLoadingTimezones: boolean;
  error: string | null;
  updateError: string | null;
}

const initialState: ProfileState = {
  data: null,
  timezones: null,
  isLoading: false,
  isUpdating: false,
  isLoadingTimezones: false,
  error: null,
  updateError: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      // Fetch timezones
      .addCase(fetchTimezones.pending, (state) => {
        state.isLoadingTimezones = true;
      })
      .addCase(fetchTimezones.fulfilled, (state, action) => {
        state.isLoadingTimezones = false;
        state.timezones = action.payload;
      })
      .addCase(fetchTimezones.rejected, (state, action) => {
        state.isLoadingTimezones = false;
        state.error = action.error.message || 'Failed to fetch timezones';
      })
      // Update profile - enhanced to handle password updates
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        // Update local state with new data
        if (state.data) {
          state.data.first_name = action.payload.first_name;
          state.data.last_name = action.payload.last_name;
          state.data.timezone = action.payload.timezone;
          state.data.username = action.payload.username;
          state.data.language = action.payload.language;
          state.data.profilePic = action.payload.profilePic;
          state.data.dashboardType = action.payload.dashboardType;
          // Update password in state if it was changed
          if (action.payload.password) {
            state.data.password = action.payload.password;
          }
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.error.message || 'Failed to update profile';
      });
  },
});

export const { clearErrors } = profileSlice.actions;
export default profileSlice.reducer;
