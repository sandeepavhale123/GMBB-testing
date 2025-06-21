
import { useContext } from 'react';
import { ListingContext } from '@/context/ListingContext';

// Simple hook to get listing data for dashboard components
export const useDashboardListing = () => {
  // Always call useContext - this is safe and follows Rules of Hooks
  const context = useContext(ListingContext);
  
  // Fallback listing data when context is not available
  const fallbackData = {
    selectedListing: null,
    listingName: "KSoft Solution",
    listingAddress: "New York, NY"
  };

  // If no context provider, return fallback
  if (!context) {
    return fallbackData;
  }

  const { selectedListing } = context;

  return {
    selectedListing,
    listingName: selectedListing?.name || "KSoft Solution",
    listingAddress: selectedListing?.address || "New York, NY"
  };
};
