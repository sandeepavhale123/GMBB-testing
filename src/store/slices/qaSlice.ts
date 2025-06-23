
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QAFilters, QAPagination, QASorting, QASummary } from '@/api/qaApi';

export interface QAState {
  filters: QAFilters;
  pagination: QAPagination;
  sorting: QASorting;
  summary: QASummary | null;
  isLoading: boolean;
  error: string | null;
  showTipBanner: boolean;
}

const initialState: QAState = {
  filters: {
    search: '',
    status: 'all',
    dateRange: {
      startDate: '',
      endDate: '',
    },
  },
  pagination: {
    page: 1,
    limit: 10,
    offset: 0,
  },
  sorting: {
    sortBy: 'timestamp',
    sortOrder: 'desc',
  },
  summary: null,
  isLoading: false,
  error: null,
  showTipBanner: true,
};

const qaSlice = createSlice({
  name: 'qa',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<QAFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      // Reset to first page when filters change
      state.pagination.page = 1;
      state.pagination.offset = 0;
    },
    setPagination: (state, action: PayloadAction<Partial<QAPagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
      // Update offset based on page
      if (action.payload.page) {
        state.pagination.offset = (action.payload.page - 1) * state.pagination.limit;
      }
    },
    setSorting: (state, action: PayloadAction<Partial<QASorting>>) => {
      state.sorting = { ...state.sorting, ...action.payload };
    },
    setSummary: (state, action: PayloadAction<QASummary>) => {
      state.summary = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    dismissTipBanner: (state) => {
      state.showTipBanner = false;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination = initialState.pagination;
      state.sorting = initialState.sorting;
    },
  },
});

export const {
  setFilters,
  setPagination,
  setSorting,
  setSummary,
  setLoading,
  setError,
  dismissTipBanner,
  resetFilters,
} = qaSlice.actions;

export default qaSlice.reducer;
