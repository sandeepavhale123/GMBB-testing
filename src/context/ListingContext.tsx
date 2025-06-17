
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { BusinessListing } from '@/components/Header/types';
import { useBusinessListingsWithRedux } from '@/hooks/useBusinessListingsWithRedux';

interface ListingContextType {
  selectedListing: BusinessListing | null;
  isLoading: boolean;
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
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { listingId } = useParams();
  const location = useLocation();

  // Get the current route without the listing ID
  const getBaseRoute = () => {
    const pathParts = location.pathname.split('/');
    return pathParts[1] || 'location-dashboard';
  };

  useEffect(() => {
    if (!listingsLoading && listings.length > 0) {
      const targetListingId = listingId || listings[0].id;
      const targetListing = listings.find(l => l.id === targetListingId) || listings[0];
      
      setSelectedListing(targetListing);
      
      // If no listing ID in URL or invalid ID, redirect to first listing
      if (!listingId || !listings.find(l => l.id === listingId)) {
        const baseRoute = getBaseRoute();
        navigate(`/${baseRoute}/${listings[0].id}`, { replace: true });
      }
    }
  }, [listings, listingsLoading, listingId, navigate, location.pathname]);

  const switchListing = async (listing: BusinessListing) => {
    if (listing.id === selectedListing?.id) return;
    
    setIsLoading(true);
    
    // Check if the listing exists in current listings
    const existsInListings = listings.some(l => l.id === listing.id);
    
    // If it doesn't exist, add it to stored listings first
    if (!existsInListings) {
      console.log('🔄 ListingContext: Auto-storing new listing:', listing.name);
      addNewListing(listing);
    }
    
    setSelectedListing(listing);
    
    const baseRoute = getBaseRoute();
    navigate(`/${baseRoute}/${listing.id}`);
    
    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  return (
    <ListingContext.Provider 
      value={{ 
        selectedListing, 
        isLoading, 
        listings, 
        switchListing 
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};
