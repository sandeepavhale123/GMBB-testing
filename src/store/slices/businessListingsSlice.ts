import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { businessListingsService, BusinessListingsResponse, BusinessListing } from '../../services/businessListingsService';

export interface BusinessListing {
  id: string;
  name: string;
  address: string;
  category: string;
  phone: string;
  website: string;
  [key: string]: any;
}

export interface BusinessListingsResponse {
  code: number;
  message: string;
  data: BusinessListing[];
}

interface BusinessListingsState {
  userAddedListings: BusinessListing[];
  selectedBusinessId: string;
}

const initialState: BusinessListingsState = {
  userAddedListings: [],
  selectedBusinessId: '',
};

export const fetchBusinessListings = createAsyncThunk(
  'businessListings/fetchBusinessListings',
  async (): Promise<BusinessListingsResponse> => {
    const response = await businessListingsService.getUserBusinessListings();
    return response;
  }
);

export const clearUserListings = createAsyncThunk(
  'businessListings/clearUserListings',
  async (): Promise<void> => {
    localStorage.removeItem('businessListings');
    localStorage.removeItem('selectedBusinessId');
  }
);

const businessListingsSlice = createSlice({
  name: 'businessListings',
  initialState,
  reducers: {
    setSelectedBusinessId: (state, action: PayloadAction<string>) => {
      state.selectedBusinessId = action.payload;
      localStorage.setItem('selectedBusinessId', action.payload);
    },
    addBusinessListing: (state, action: PayloadAction<BusinessListing>) => {
      state.userAddedListings.push(action.payload);
      localStorage.setItem('businessListings', JSON.stringify(state.userAddedListings));
    },
    removeBusinessListing: (state, action: PayloadAction<string>) => {
      state.userAddedListings = state.userAddedListings.filter(
        listing => listing.id !== action.payload
      );
      localStorage.setItem('businessListings', JSON.stringify(state.userAddedListings));
    },
    loadFromLocalStorage: (state) => {
      const savedListings = localStorage.getItem('businessListings');
      const savedSelectedId = localStorage.getItem('selectedBusinessId');
      
      if (savedListings) {
        try {
          state.userAddedListings = JSON.parse(savedListings);
        } catch (error) {
          console.error('Failed to parse saved business listings:', error);
        }
      }
      
      if (savedSelectedId) {
        state.selectedBusinessId = savedSelectedId;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinessListings.fulfilled, (state, action) => {
        state.userAddedListings = action.payload.data;
        localStorage.setItem('businessListings', JSON.stringify(action.payload.data));
      })
      .addCase(clearUserListings.fulfilled, (state) => {
        state.userAddedListings = [];
        state.selectedBusinessId = '';
      })
      .addCase('RESET_STORE', () => {
        localStorage.removeItem('businessListings');
        localStorage.removeItem('selectedBusinessId');
        return initialState;
      });
  },
});

export const {
  setSelectedBusinessId,
  addBusinessListing,
  removeBusinessListing,
  loadFromLocalStorage,
} = businessListingsSlice.actions;

export default businessListingsSlice.reducer;
