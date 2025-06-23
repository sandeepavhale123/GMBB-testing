
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBusinessInfo } from '../../api/businessApi';
import type { BusinessInfoData, BusinessInfoRequest } from '../../types/businessInfoTypes';

export interface BusinessInfoState {
  data: BusinessInfoData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const initialState: BusinessInfoState = {
  data: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const fetchBusinessInfo = createAsyncThunk(
  'businessInfo/fetch',
  async (request: BusinessInfoRequest) => {
    const response = await getBusinessInfo(request);
    return response.data;
  }
);

const businessInfoSlice = createSlice({
  name: 'businessInfo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearData: (state) => {
      state.data = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessInfo.fulfilled, (state, action: PayloadAction<BusinessInfoData>) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
        state.lastFetched = Date.now();
      })
      .addCase(fetchBusinessInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch business info';
      });
  },
});

export const { clearError, clearData } = businessInfoSlice.actions;
export default businessInfoSlice.reducer;
