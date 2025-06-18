import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileService, UserProfile, UpdateProfileRequest } from '../../services/profileService';

interface ProfileState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  updateError: string | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
  updateLoading: false,
  updateError: null,
};

export const fetchUserProfile = createAsyncThunk(
  'profile/fetchUserProfile',
  async () => {
    const response = await profileService.getUserProfile();
    return response.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'profile/updateUserProfile',
  async (profileData: UpdateProfileRequest) => {
    const response = await profileService.updateUserProfile(profileData);
    return response.data;
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
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.error.message || 'Failed to update profile';
      })
      .addCase('RESET_STORE', () => {
        return initialState;
      });
  },
});

export const { clearErrors } = profileSlice.actions;
export default profileSlice.reducer;
