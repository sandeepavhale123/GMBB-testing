
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessListing } from '@/components/Header/types';

interface BusinessListingsState {
  userAddedListings: BusinessListing[];
  selectedBusinessId: string | null;
}

const initialState: BusinessListingsState = {
  userAddedListings: [],
  selectedBusinessId: null,
};

// Load from localStorage on initialization
const loadFromLocalStorage = (): BusinessListing[] => {
  try {
    const stored = localStorage.getItem('userBusinessListings');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load business listings from localStorage:', error);
    return [];
  }
};

// Save to localStorage
const saveToLocalStorage = (listings: BusinessListing[]) => {
  try {
    localStorage.setItem('userBusinessListings', JSON.stringify(listings));
  } catch (error) {
    console.error('Failed to save business listings to localStorage:', error);
  }
};

const businessListingsSlice = createSlice({
  name: 'businessListings',
  initialState: {
    ...initialState,
    userAddedListings: loadFromLocalStorage(),
  },
  reducers: {
    addBusinessListing: (state, action: PayloadAction<BusinessListing>) => {
      const existingIndex = state.userAddedListings.findIndex(
        listing => listing.id === action.payload.id
      );
      
      if (existingIndex === -1) {
        // Add new listing at the beginning of the array
        state.userAddedListings.unshift(action.payload);
        saveToLocalStorage(state.userAddedListings);
        console.log('✅ Added business listing at top:', action.payload.name);
      } else {
        console.log('ℹ️ Business listing already exists:', action.payload.name);
      }
    },
    moveListingToTop: (state, action: PayloadAction<string>) => {
      const listingIndex = state.userAddedListings.findIndex(
        listing => listing.id === action.payload
      );
      
      if (listingIndex > 0) {
        // Remove listing from current position and add to beginning
        const [listing] = state.userAddedListings.splice(listingIndex, 1);
        state.userAddedListings.unshift(listing);
        saveToLocalStorage(state.userAddedListings);
        console.log('🔝 Moved business listing to top:', listing.name);
      }
    },
    removeBusinessListing: (state, action: PayloadAction<string>) => {
      state.userAddedListings = state.userAddedListings.filter(
        listing => listing.id !== action.payload
      );
      saveToLocalStorage(state.userAddedListings);
      console.log('🗑️ Removed business listing with ID:', action.payload);
    },
    setSelectedBusiness: (state, action: PayloadAction<string | null>) => {
      state.selectedBusinessId = action.payload;
    },
    clearUserListings: (state) => {
      state.userAddedListings = [];
      localStorage.removeItem('userBusinessListings');
      console.log('🧹 Cleared all user business listings');
    }
  },
});

export const { 
  addBusinessListing, 
  moveListingToTop,
  removeBusinessListing, 
  setSelectedBusiness,
  clearUserListings 
} = businessListingsSlice.actions;

export default businessListingsSlice.reducer;
