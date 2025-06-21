
import { useAppSelector } from './useRedux';
import { BusinessListing } from '@/components/Header/types';

// Simple hook to get listing data for dashboard components
export const useDashboardListing = () => {
  // Try to get from Redux dashboard state first
  const dashboardState = useAppSelector(state => state.dashboard);
  
  // Fallback listing data
  const fallbackListing: Partial<BusinessListing> = {
    name: "KSoft Solution",
    address: "New York, NY",
    type: "Business"
  };

  // Use dashboard business profile if available, otherwise use fallback
  const selectedListing = dashboardState.businessProfile || fallbackListing;

  return {
    selectedListing,
    listingName: selectedListing.name || "KSoft Solution",
    listingAddress: selectedListing.address || "New York, NY"
  };
};
