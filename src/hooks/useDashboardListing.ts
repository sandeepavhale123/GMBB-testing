
import { useListingContext } from '@/context/ListingContext';

// Simple hook to get listing data for dashboard components
export const useDashboardListing = () => {
  // Check if ListingProvider context is available
  let hasListingContext = true;
  let contextData;
  
  try {
    contextData = useListingContext();
  } catch (error) {
    hasListingContext = false;
  }

  // Fallback listing data when context is not available
  const fallbackData = {
    selectedListing: null,
    listingName: "KSoft Solution",
    listingAddress: "New York, NY"
  };

  if (!hasListingContext || !contextData) {
    return fallbackData;
  }

  const { selectedListing } = contextData;

  return {
    selectedListing,
    listingName: selectedListing?.name || "KSoft Solution",
    listingAddress: selectedListing?.address || "New York, NY"
  };
};
