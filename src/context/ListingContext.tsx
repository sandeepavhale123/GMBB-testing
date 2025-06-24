
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BusinessListing } from '@/components/Header/types';
import { useBusinessListingsWithRedux } from '@/hooks/useBusinessListingsWithRedux';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { moveListingToTop, setSelectedBusiness, updateUserSession } from '@/store/slices/businessListingsSlice';
import { useAuthRedux } from '@/store/slices/auth/useAuthRedux';

interface ListingContextType {
  selectedListing: BusinessListing | null;
  isLoading: boolean;
  isInitialLoading: boolean;
  listings: BusinessListing[];
  switchListing: (listing: BusinessListing) => void;
}

const ListingContext = createContext<ListingContextType>({
  selectedListing: null,
  isLoading: false,
  isInitialLoading: false,
  listings: [],
  switchListing: () => {}
});

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
  const { user, isInitialized } = useAuthRedux();
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId?: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const baseRoute = useMemo(() => {
    const pathParts = location.pathname.split('/');
    return pathParts[1] || 'location-dashboard';
  }, [location.pathname]);

  // Update user session when user changes
  useEffect(() => {
    if (user?.userId && isInitialized) {
      const currentSession = localStorage.getItem('current_user_session');
      if (currentSession !== user.userId) {
        console.log('🔄 ListingContext: User session change detected');
        dispatch(updateUserSession(user.userId));
        localStorage.setItem('current_user_session', user.userId);
        setHasInitialized(false); // Force re-initialization
      }
    }
  }, [user?.userId, isInitialized, dispatch]);

  const initializeSelectedListing = useCallback(() => {
    if (listingsLoading || !listings.length || hasInitialized || !isInitialized) return;

    console.log('🔄 ListingContext: Initializing with listings:', listings.length);
    console.log('🔄 ListingContext: Current selectedBusinessId:', selectedBusinessId);
    console.log('🔄 ListingContext: URL listingId:', listingId);
    
    let targetListing: BusinessListing | null = null;

    // 1. Try to use listing from URL if valid
    if (listingId && listingId !== 'default') {
      targetListing = listings.find(l => l.id === listingId) || null;
      console.log('🔄 ListingContext: Found listing from URL:', targetListing?.name);
    }

    // 2. Try to use stored selectedBusinessId if URL doesn't have valid listing
    if (!targetListing && selectedBusinessId) {
      targetListing = listings.find(l => l.id === selectedBusinessId) || null;
      console.log('🔄 ListingContext: Found listing from stored ID:', targetListing?.name);
    }

    // 3. Default to first available listing if nothing else works
    if (!targetListing && listings.length > 0) {
      targetListing = listings[0];
      console.log('🔄 ListingContext: Using first available listing:', targetListing?.name);
    }

    if (targetListing) {
      setSelectedListing(targetListing);
      dispatch(setSelectedBusiness(targetListing.id));

      // Redirect if necessary
      const shouldRedirect = !listingId || 
                            listingId === 'default' || 
                            !listings.find(l => l.id === listingId);

      if (shouldRedirect) {
        console.log('🔄 ListingContext: Redirecting to:', `/${baseRoute}/${targetListing.id}`);
        navigate(`/${baseRoute}/${targetListing.id}`, { replace: true });
      }
    } else {
      console.log('🔄 ListingContext: No listings available');
    }

    setHasInitialized(true);
  }, [
    listings, 
    listingsLoading, 
    listingId, 
    selectedBusinessId, 
    hasInitialized,
    isInitialized,
    navigate, 
    baseRoute, 
    dispatch
  ]);

  useEffect(() => {
    initializeSelectedListing();
  }, [initializeSelectedListing]);

  const switchListing = useCallback(async (listing: BusinessListing) => {
    if (listing.id === selectedListing?.id) return;
    
    setIsLoading(true);
    
    const existsInListings = listings.some(l => l.id === listing.id);
    
    if (!existsInListings) {
      console.log('🔄 ListingContext: Auto-storing new listing:', listing.name);
      addNewListing(listing);
    } else {
      const isInUserListings = listings.slice(0, listings.length).some(l => l.id === listing.id);
      if (isInUserListings) {
        console.log('🔝 ListingContext: Moving existing listing to top:', listing.name);
        dispatch(moveListingToTop(listing.id));
      }
    }
    
    setSelectedListing(listing);
    dispatch(setSelectedBusiness(listing.id));
    
    navigate(`/${baseRoute}/${listing.id}`);
    
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [selectedListing?.id, listings, addNewListing, dispatch, baseRoute, navigate]);

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
