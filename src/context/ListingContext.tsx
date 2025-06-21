
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BusinessListing } from '@/components/Header/types';
import { useBusinessListingsWithRedux } from '@/hooks/useBusinessListingsWithRedux';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { moveListingToTop, setSelectedBusiness } from '@/store/slices/businessListingsSlice';

interface ListingContextType {
  selectedListing: BusinessListing | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  listings: BusinessListing[];
  switchListing: (listing: BusinessListing) => void;
}

const ListingContext = createContext<ListingContextType | null>(null);

export const useListingContext = () => {
  const context = useContext(ListingContext);
  if (!context) {
    throw new Error('useListingContext must be used within a ListingProvider');
  }
  return context;
};

interface ListingProviderProps {
  children: React.ReactNode;
}

export const ListingProvider: React.FC<ListingProviderProps> = ({ children }) => {
  const { listings, loading: listingsLoading, addNewListing } = useBusinessListingsWithRedux();
  const { selectedBusinessId } = useAppSelector(state => state.businessListings);
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const { listingId } = useParams();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // Memoize the base route calculation
  const baseRoute = useMemo(() => {
    const pathParts = location.pathname.split('/');
    return pathParts[1] || 'location-dashboard';
  }, [location.pathname]);

  // Memoize the initialization logic
  const initializeSelectedListing = useCallback(() => {
    if (listingsLoading || !listings.length || hasInitialized) return;

    console.log('🔄 ListingContext: Initializing with listings:', listings.length);
    
    let targetListing: BusinessListing | null = null;

    // Priority 1: Use URL listingId if valid and not 'default'
    if (listingId && listingId !== 'default') {
      targetListing = listings.find(l => l.id === listingId) || null;
    }

    // Priority 2: Use persisted selectedBusinessId if URL doesn't have a valid listing
    if (!targetListing && selectedBusinessId) {
      targetListing = listings.find(l => l.id === selectedBusinessId) || null;
    }

    // Priority 3: Fallback to first listing
    if (!targetListing) {
      targetListing = listings[0];
    }

    if (targetListing) {
      setSelectedListing(targetListing);
      dispatch(setSelectedBusiness(targetListing.id));

      // Only redirect if URL is pointing to 'default' or invalid listing
      const shouldRedirect = !listingId || 
                            listingId === 'default' || 
                            !listings.find(l => l.id === listingId);

      if (shouldRedirect) {
        console.log('🔄 ListingContext: Redirecting to:', `/${baseRoute}/${targetListing.id}`);
        navigate(`/${baseRoute}/${targetListing.id}`, { replace: true });
      }
    }

    setHasInitialized(true);
  }, [
    listings, 
    listingsLoading, 
    listingId, 
    selectedBusinessId, 
    hasInitialized, 
    navigate, 
    baseRoute, 
    dispatch
  ]);

  // Initialize selected listing
  useEffect(() => {
    initializeSelectedListing();
  }, [initializeSelectedListing]);

  const switchListing = useCallback(async (listing: BusinessListing) => {
    if (listing.id === selectedListing?.id) return;
    
    setIsLoading(true);
    
    // Check if the listing exists in current listings
    const existsInListings = listings.some(l => l.id === listing.id);
    
    if (!existsInListings) {
      // If it doesn't exist, add it to stored listings first
      console.log('🔄 ListingContext: Auto-storing new listing:', listing.name);
      addNewListing(listing);
    } else {
      // If it exists in user listings, move it to top for "most recently used" behavior
      const isInUserListings = listings.slice(0, listings.length).some(l => l.id === listing.id);
      if (isInUserListings) {
        console.log('🔝 ListingContext: Moving existing listing to top:', listing.name);
        dispatch(moveListingToTop(listing.id));
      }
    }
    
    setSelectedListing(listing);
    dispatch(setSelectedBusiness(listing.id));
    
    navigate(`/${baseRoute}/${listing.id}`);
    
    // Reduce loading time for better performance
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [selectedListing?.id, listings, addNewListing, dispatch, baseRoute, navigate]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    selectedListing, 
    isLoading, 
    isInitialLoading: listingsLoading,
    listings, 
    switchListing 
  }), [selectedListing, isLoading, listingsLoading, listings, switchListing]);

  return (
    <ListingContext.Provider value={contextValue}>
      {children}
    </ListingContext.Provider>
  );
};

export { ListingContext };
