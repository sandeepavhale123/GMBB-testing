import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { BusinessListing } from "@/components/Header/types";
import { mockReputationListings } from "../data/mockListings";
import { useAppDispatch } from "@/hooks/useRedux";
import { setSelectedBusiness } from "@/store/slices/businessListingsSlice";

interface ListingContextType {
  selectedListing: BusinessListing | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  listings: BusinessListing[];
  switchListing: (listing: BusinessListing) => void;
  setSelectedListing: (listing: BusinessListing | null) => void;
  initializeSelectedListing: (id?: string) => void;
  refetchListings: () => Promise<void>;
}

const ReputationListingContext = createContext<ListingContextType>({
  selectedListing: null,
  isLoading: false,
  isInitialLoading: false,
  listings: [],
  switchListing: () => {},
  setSelectedListing: () => {},
  initializeSelectedListing(id) {},
  refetchListings: async () => {},
});

export const useListingContext = () => {
  const context = useContext(ReputationListingContext);
  if (!context) {
    throw new Error(
      "useListingContext must be used within a ReputationListingProvider"
    );
  }
  return context;
};

interface ReputationListingProviderProps {
  children: React.ReactNode;
}

export const ReputationListingProvider: React.FC<
  ReputationListingProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();
  
  // Use mock data directly
  const listings = mockReputationListings;
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(
    listings[0] || null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  // Initialize with first listing on mount
  useEffect(() => {
    if (listings.length > 0 && !selectedListing) {
      const firstListing = listings[0];
      setSelectedListing(firstListing);
      dispatch(setSelectedBusiness(firstListing.id));
    }
  }, [listings, selectedListing, dispatch]);

  const initializeSelectedListing = useCallback(
    (id?: string) => {
      if (listings.length === 0) {
        setSelectedListing(null);
        return;
      }

      let targetListing: BusinessListing | null = null;

      if (id) {
        targetListing = listings.find((l) => l.id === id) || null;
      }

      if (!targetListing) {
        targetListing = listings[0];
      }

      if (targetListing) {
        setSelectedListing(targetListing);
        dispatch(setSelectedBusiness(targetListing.id));
      }
    },
    [listings, dispatch]
  );

  const switchListing = useCallback(
    (listing: BusinessListing) => {
      if (listing.id === selectedListing?.id) return;

      setIsLoading(true);
      setSelectedListing(listing);
      dispatch(setSelectedBusiness(listing.id));

      // No navigation - stay on current route
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    },
    [selectedListing?.id, dispatch]
  );

  const refetchListings = useCallback(async () => {
    // Mock refetch - do nothing since we're using static data
    return Promise.resolve();
  }, []);

  const contextValue = useMemo(
    () => ({
      selectedListing,
      isLoading,
      isInitialLoading,
      listings,
      switchListing,
      setSelectedListing,
      initializeSelectedListing,
      refetchListings,
    }),
    [
      selectedListing,
      isLoading,
      isInitialLoading,
      listings,
      switchListing,
      initializeSelectedListing,
      refetchListings,
    ]
  );

  return (
    <ReputationListingContext.Provider value={contextValue}>
      {children}
    </ReputationListingContext.Provider>
  );
};

export { ReputationListingContext };
