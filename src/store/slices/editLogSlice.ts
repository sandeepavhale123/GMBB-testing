import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getEditLogs } from '../../api/businessApi';
import type { EditLogData, EditLogRequest } from '../../types/editLogTypes';

export interface EditLogState {
  data: EditLogData | null;
  isLoading: boolean;
  error: string | null;
  currentListingId: number | null;
  currentPage: number;
  currentSearch: string;
  limit: number;
}

const initialState: EditLogState = {
  data: null,
  isLoading: false,
  error: null,
  currentListingId: null,
  currentPage: 1,
  currentSearch: '',
  limit: 10,
};

export const fetchEditLogs = createAsyncThunk(
  'editLog/fetch',
  async (request: EditLogRequest) => {
    const response = await getEditLogs(request);
    return { data: response.data, request };
  }
);

const editLogSlice = createSlice({
  name: 'editLog',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setCurrentSearch: (state, action: PayloadAction<string>) => {
      state.currentSearch = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    clearEditLogs: (state) => {
      state.data = null;
      state.currentListingId = null;
      state.currentPage = 1;
      state.currentSearch = '';
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditLogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEditLogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data;
        state.currentListingId = action.payload.request.listingId;
        state.currentPage = action.payload.request.page;
        state.currentSearch = action.payload.request.search;
        state.error = null;
      })
      .addCase(fetchEditLogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch edit logs';
      });
  },
});

export const { setCurrentPage, setCurrentSearch, clearEditLogs, clearError } = editLogSlice.actions;
export default editLogSlice.reducer;