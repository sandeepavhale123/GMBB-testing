
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getBusinessInfo, refreshBusinessInfo } from '../../api/businessApi';
import type { BusinessInfoData, BusinessInfoRequest, RefreshBusinessInfoRequest, RefreshBusinessInfoResponse } from '../../types/businessInfoTypes';

export interface BusinessInfoState {
  data: BusinessInfoData | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  isRefreshing: boolean;
  refreshError: string | null;
}

const initialState: BusinessInfoState = {
  data: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  isRefreshing: false,
  refreshError: null,
};

export const fetchBusinessInfo = createAsyncThunk(
  'businessInfo/fetch',
  async (request: BusinessInfoRequest) => {
    const response = await getBusinessInfo(request);
    return response.data;
  }
);

export const refreshAndFetchBusinessInfo = createAsyncThunk(
  'businessInfo/refreshAndFetch',
  async (request: RefreshBusinessInfoRequest, { dispatch }) => {
    // First refresh the business info
    const refreshResponse = await refreshBusinessInfo(request);
    
    // Then fetch the updated data
    const fetchResponse = await getBusinessInfo({ listingId: request.listingId });
    
    return {
      refreshResponse: refreshResponse,
      updatedData: fetchResponse.data
    };
  }
);

const businessInfoSlice = createSlice({
  name: 'businessInfo',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRefreshError: (state) => {
      state.refreshError = null;
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
      })
      .addCase(refreshAndFetchBusinessInfo.pending, (state) => {
        state.isRefreshing = true;
        state.refreshError = null;
      })
      .addCase(refreshAndFetchBusinessInfo.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.data = action.payload.updatedData;
        state.refreshError = null;
        state.lastFetched = Date.now();
      })
      .addCase(refreshAndFetchBusinessInfo.rejected, (state, action) => {
        state.isRefreshing = false;
        state.refreshError = action.error.message || 'Failed to refresh business info';
      });
  },
});

export const { clearError, clearRefreshError, clearData } = businessInfoSlice.actions;
export default businessInfoSlice.reducer;
