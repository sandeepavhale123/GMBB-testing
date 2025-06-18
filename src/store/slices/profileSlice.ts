
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService, ProfileData, UpdateProfileData } from '../../services/profileService';

interface ProfileState {
  data: ProfileData | null;
  timezones: any[] | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  updateError: string | null;
  isLoadingTimezones: boolean;
}

const initialState: ProfileState = {
  data: null,
  timezones: null,
  isLoading: false,
  error: null,
  isUpdating: false,
  updateError: null,
  isLoadingTimezones: false,
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async () => {
    const response = await profileService.getUserProfile();
    return response;
  }
);

export const fetchTimezones = createAsyncThunk(
  'profile/fetchTimezones',
  async () => {
    const response = await profileService.getTimezones();
    return response;
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: UpdateProfileData) => {
    const response = await profileService.updateProfile(profileData);
    return response;
  }
);

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
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdating = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdating = false;
        state.data = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdating = false;
        state.updateError = action.error.message || 'Failed to update profile';
      })
      .addCase('RESET_STORE', () => {
        return initialState;
      });
  },
});

export const { clearErrors } = profileSlice.actions;
export default profileSlice.reducer;
