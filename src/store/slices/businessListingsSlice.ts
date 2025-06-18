
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { businessListingsService } from '../../services/businessListingsService';
import { BusinessListing as HeaderBusinessListing } from '../../components/Header/types';

export interface BusinessListing {
  id: string;
  name: string;
  address: string;
  category: string;
  phone: string;
  website: string;
  type: string;
  zipcode: string;
  active: string;
  status?: 'Active' | 'Pending';
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

// Transform Header BusinessListing to Store BusinessListing
const transformToStoreListing = (listing: HeaderBusinessListing): BusinessListing => ({
  ...listing,
  category: listing.type || '',
  phone: '',
  website: '',
  status: listing.active === "1" ? 'Active' : 'Pending'
});

export const fetchBusinessListings = createAsyncThunk(
  'businessListings/fetchBusinessListings',
  async (): Promise<BusinessListingsResponse> => {
    const data = await businessListingsService.getActiveListings();
    const transformedData = data.map(transformToStoreListing);
    return {
      code: 200,
      message: 'Success',
      data: transformedData
    };
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
    addBusinessListing: (state, action: PayloadAction<HeaderBusinessListing>) => {
      const transformedListing = transformToStoreListing(action.payload);
      state.userAddedListings.push(transformedListing);
      localStorage.setItem('businessListings', JSON.stringify(state.userAddedListings));
    },
    removeBusinessListing: (state, action: PayloadAction<string>) => {
      state.userAddedListings = state.userAddedListings.filter(
        listing => listing.id !== action.payload
      );
      localStorage.setItem('businessListings', JSON.stringify(state.userAddedListings));
    },
    moveListingToTop: (state, action: PayloadAction<string>) => {
      const listingIndex = state.userAddedListings.findIndex(
        listing => listing.id === action.payload
      );
      if (listingIndex > 0) {
        const [listing] = state.userAddedListings.splice(listingIndex, 1);
        state.userAddedListings.unshift(listing);
        localStorage.setItem('businessListings', JSON.stringify(state.userAddedListings));
      }
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
  moveListingToTop,
  loadFromLocalStorage,
} = businessListingsSlice.actions;

export default businessListingsSlice.reducer;
