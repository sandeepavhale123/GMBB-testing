
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Simple type definitions to avoid circular references
interface QAFilters {
  search: string;
  status: 'all' | 'answered' | 'unanswered';
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

interface QAPagination {
  page: number;
  limit: number;
  offset: number;
}

interface QASorting {
  sortBy: 'timestamp';
  sortOrder: 'asc' | 'desc';
}

interface QASummary {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
}

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
      state.pagination.page = 1;
      state.pagination.offset = 0;
    },
    setPagination: (state, action: PayloadAction<Partial<QAPagination>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
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
