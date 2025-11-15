import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BusinessListing } from "@/components/Header/types";

interface BusinessListingsState {
  userAddedListings: BusinessListing[];
  selectedBusinessId: string | null;
  lastUserSession: string | null;
}

const initialState: BusinessListingsState = {
  userAddedListings: [],
  selectedBusinessId: null,
  lastUserSession: null,
};

// Load from localStorage on initialization
const loadFromLocalStorage = (): BusinessListing[] => {
  try {
    const stored = localStorage.getItem("userBusinessListings");
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load business listings from localStorage:", error);
    return [];
  }
};

// Load selected business ID from localStorage
const loadSelectedBusinessId = (): string | null => {
  try {
    const stored = localStorage.getItem("selectedBusinessId");

    return stored || null;
  } catch (error) {
    console.error(
      "Failed to load selected business ID from localStorage:",
      error
    );
    return null;
  }
};

// Load last user session
const loadLastUserSession = (): string | null => {
  try {
    const stored = localStorage.getItem("current_user_session");
    return stored || null;
  } catch (error) {
    console.error("Failed to load user session from localStorage:", error);
    return null;
  }
};

// Check if user has changed
const checkUserChanged = (): boolean => {
  const currentSession = localStorage.getItem("current_user_session");
  const lastSession = localStorage.getItem("last_user_session");

  if (currentSession && lastSession && currentSession !== lastSession) {
    return true;
  }

  return false;
};

// Save to localStorage
const saveToLocalStorage = (listings: BusinessListing[]) => {
  try {
    localStorage.setItem("userBusinessListings", JSON.stringify(listings));
  } catch (error) {
    console.error("Failed to save business listings to localStorage:", error);
  }
};

// Save selected business ID to localStorage
const saveSelectedBusinessId = (businessId: string | null) => {
  try {
    if (businessId) {
      localStorage.setItem("selectedBusinessId", businessId);
    } else {
      localStorage.removeItem("selectedBusinessId");
    }
  } catch (error) {
    console.error(
      "Failed to save selected business ID to localStorage:",
      error
    );
  }
};

// Initialize state with user change detection
const getInitialState = (): BusinessListingsState => {
  const userChanged = checkUserChanged();

  if (userChanged) {
    localStorage.removeItem("userBusinessListings");
    localStorage.removeItem("selectedBusinessId");
    // Update last session tracker
    const currentSession = localStorage.getItem("current_user_session");
    if (currentSession) {
      localStorage.setItem("last_user_session", currentSession);
    }
    return {
      ...initialState,
      lastUserSession: loadLastUserSession(),
    };
  }

  return {
    ...initialState,
    userAddedListings: loadFromLocalStorage(),
    selectedBusinessId: loadSelectedBusinessId(),
    lastUserSession: loadLastUserSession(),
  };
};

const businessListingsSlice = createSlice({
  name: "businessListings",
  initialState: getInitialState(),
  reducers: {
    addBusinessListing: (state, action: PayloadAction<BusinessListing>) => {
      const existingIndex = state.userAddedListings.findIndex(
        (listing) => listing.id === action.payload.id
      );

      if (existingIndex === -1) {
        // Add new listing at the beginning of the array
        state.userAddedListings.unshift(action.payload);
        saveToLocalStorage(state.userAddedListings);
      } else {
        //
      }
    },
    moveListingToTop: (state, action: PayloadAction<string>) => {
      const listingIndex = state.userAddedListings.findIndex(
        (listing) => listing.id === action.payload
      );

      if (listingIndex > 0) {
        // Remove listing from current position and add to beginning
        const [listing] = state.userAddedListings.splice(listingIndex, 1);
        state.userAddedListings.unshift(listing);
        saveToLocalStorage(state.userAddedListings);
      }
    },
    removeBusinessListing: (state, action: PayloadAction<string>) => {
      state.userAddedListings = state.userAddedListings.filter(
        (listing) => listing.id !== action.payload
      );
      saveToLocalStorage(state.userAddedListings);
    },
    setSelectedBusiness: (state, action: PayloadAction<string | null>) => {
      state.selectedBusinessId = action.payload;
      saveSelectedBusinessId(action.payload);
    },
    clearUserListings: (state) => {
      state.userAddedListings = [];
      state.selectedBusinessId = null;
      localStorage.removeItem("userBusinessListings");
      localStorage.removeItem("selectedBusinessId");
    },
    updateUserSession: (state, action: PayloadAction<string>) => {
      state.lastUserSession = action.payload;
      localStorage.setItem("last_user_session", action.payload);
    },
  },
});

export const {
  addBusinessListing,
  moveListingToTop,
  removeBusinessListing,
  setSelectedBusiness,
  clearUserListings,
  updateUserSession,
} = businessListingsSlice.actions;

export default businessListingsSlice.reducer;
