
import { useState, useEffect } from 'react';
import { BusinessListing } from '@/components/Header/types';
import { businessListingsService } from '@/services/businessListingsService';
import { useAuthRedux } from '@/store/slices/auth/useAuthRedux';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { addBusinessListing } from '@/store/slices/businessListingsSlice';

interface UseBusinessListingsWithReduxReturn {
  listings: BusinessListing[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addNewListing: (business: BusinessListing) => void;
}

export const useBusinessListingsWithRedux = (): UseBusinessListingsWithReduxReturn => {
  const [apiListings, setApiListings] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isInitialized, hasAttemptedRefresh, refreshAccessToken } = useAuthRedux();
  
  const dispatch = useAppDispatch();
  const { userAddedListings } = useAppSelector(state => state.businessListings);

  // Combine user-added listings first, then API listings (user-added at top)
  const allListings = [...userAddedListings, ...apiListings];

  const fetchListings = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log('📋🔄 useBusinessListingsWithRedux: Fetching API business listings...');
      
      const data = await businessListingsService.getActiveListings({ limit: 10 });
      console.log('📋🔄 useBusinessListingsWithRedux: Received', data.length, 'API listings');
      
      setApiListings(data);
      console.log('📋🔄 useBusinessListingsWithRedux: Successfully updated API listings state');
    } catch (err: any) {
      console.error('📋🔄 useBusinessListingsWithRedux: Failed to fetch API business listings:', err);
      
      // Handle 401 errors with token refresh
      if (err.response?.status === 401 && retryCount === 0) {
        console.log('📋🔄 useBusinessListingsWithRedux: Attempting token refresh due to 401 error...');
        try {
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            console.log('📋🔄 useBusinessListingsWithRedux: Token refresh successful, retrying...');
            return fetchListings(1);
          }
        } catch (refreshError) {
          console.error('📋🔄 useBusinessListingsWithRedux: Token refresh failed:', refreshError);
        }
      }
      
      let errorMessage = 'Failed to load business listings';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Network connection error';
      }
      
      setError(errorMessage);
      setApiListings([]);
    } finally {
      setLoading(false);
    }
  };

  const addNewListing = (business: BusinessListing) => {
    console.log('📋➕ useBusinessListingsWithRedux: Adding new business listing:', business.name);
    dispatch(addBusinessListing(business));
  };

  useEffect(() => {
    if (isInitialized && hasAttemptedRefresh) {
      if (accessToken) {
        fetchListings();
      } else {
        setError('Authentication required');
        setLoading(false);
      }
    }
  }, [accessToken, isInitialized, hasAttemptedRefresh]);

  return {
    listings: allListings,
    loading,
    error,
    refetch: fetchListings,
    addNewListing
  };
};
