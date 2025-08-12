
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBulkMediaOverview, BulkMediaOverviewRequest, BulkMediaOverviewItem, getBulkMediaSummary, GetBulkMediaSummaryRequest, BulkMediaSummaryItem } from '@/api/mediaApi';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  business: string;
  uploadDate: string;
  title: string;
}

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface MediaState {
  media: MediaItem[];
  loading: boolean;
  selectedBusiness: string;
  bulkMediaOverview: BulkMediaOverviewItem[];
  bulkMediaOverviewLoading: boolean;
  bulkMediaOverviewError: string | null;
  bulkMediaOverviewPagination: PaginationState;
  // New state for bulk media summary
  bulkMediaSummary: BulkMediaSummaryItem | null;
  bulkMediaSummaryLoading: boolean;
  bulkMediaSummaryError: string | null;
}

const initialState: MediaState = {
  media: [
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
      type: 'image',
      business: 'Downtown Coffee',
      uploadDate: '2024-06-08',
      title: 'Morning Coffee Setup'
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      type: 'image',
      business: 'Main Street Bakery',
      uploadDate: '2024-06-07',
      title: 'Fresh Baked Goods'
    }
  ],
  loading: false,
  selectedBusiness: 'all',
  bulkMediaOverview: [],
  bulkMediaOverviewLoading: false,
  bulkMediaOverviewError: null,
  bulkMediaOverviewPagination: {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: 10,
    hasNext: false,
    hasPrevious: false,
  },
  // Initialize new bulk media summary state
  bulkMediaSummary: null,
  bulkMediaSummaryLoading: false,
  bulkMediaSummaryError: null,
};

// Async thunk for fetching bulk media overview
export const fetchBulkMediaOverview = createAsyncThunk(
  'media/fetchBulkMediaOverview',
  async (params: BulkMediaOverviewRequest) => {
    const response = await getBulkMediaOverview(params);
    return response;
  }
);

// Async thunk for fetching bulk media summary
export const fetchBulkMediaSummary = createAsyncThunk(
  'media/fetchBulkMediaSummary',
  async (params: GetBulkMediaSummaryRequest) => {
    const response = await getBulkMediaSummary(params);
    return response;
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    setSelectedBusiness: (state, action) => {
      state.selectedBusiness = action.payload;
    },
    addMedia: (state, action) => {
      state.media.unshift(action.payload);
    },
    clearBulkMediaOverviewError: (state) => {
      state.bulkMediaOverviewError = null;
    },
    clearBulkMediaSummaryError: (state) => {
      state.bulkMediaSummaryError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBulkMediaOverview.pending, (state) => {
        state.bulkMediaOverviewLoading = true;
        state.bulkMediaOverviewError = null;
      })
      .addCase(fetchBulkMediaOverview.fulfilled, (state, action) => {
        state.bulkMediaOverviewLoading = false;
        state.bulkMediaOverview = action.payload.data.bulkMediaOverviewDetails;
        state.bulkMediaOverviewPagination = {
          currentPage: action.payload.data.pagination.page,
          totalPages: action.payload.data.pagination.pages,
          totalItems: action.payload.data.pagination.total,
          itemsPerPage: action.payload.data.pagination.limit,
          hasNext: action.payload.data.pagination.page < action.payload.data.pagination.pages,
          hasPrevious: action.payload.data.pagination.page > 1,
        };
      })
      .addCase(fetchBulkMediaOverview.rejected, (state, action) => {
        state.bulkMediaOverviewLoading = false;
        state.bulkMediaOverviewError = action.error.message || 'Failed to fetch bulk media overview';
      })
      // Bulk media summary reducers
      .addCase(fetchBulkMediaSummary.pending, (state) => {
        state.bulkMediaSummaryLoading = true;
        state.bulkMediaSummaryError = null;
      })
      .addCase(fetchBulkMediaSummary.fulfilled, (state, action) => {
        state.bulkMediaSummaryLoading = false;
        state.bulkMediaSummary = action.payload.data.MediaSummary[0] || null;
      })
      .addCase(fetchBulkMediaSummary.rejected, (state, action) => {
        state.bulkMediaSummaryLoading = false;
        state.bulkMediaSummaryError = action.error.message || 'Failed to fetch bulk media summary';
      });
  },
});

export const { setSelectedBusiness, addMedia, clearBulkMediaOverviewError, clearBulkMediaSummaryError } = mediaSlice.actions;
export default mediaSlice.reducer;
