
import { useState, useEffect } from 'react';
import { BusinessListing } from '@/components/Header/types';
import { businessListingsService } from '@/services/businessListingsService';
import { useAuthRedux } from '@/store/slices/auth/useAuthRedux';

interface UseBusinessListingsReturn {
  listings: BusinessListing[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useBusinessListings = (): UseBusinessListingsReturn => {
  const [listings, setListings] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken, isInitialized, hasAttemptedRefresh, refreshAccessToken } = useAuthRedux();

  const fetchListings = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching business listings...');
      
      const data = await businessListingsService.getActiveListings({ limit: 10 });
      setListings(data);
      console.log('Successfully fetched business listings:', data);
    } catch (err: any) {
      console.error('Failed to fetch business listings:', err);
      
      // Handle 401 errors with token refresh
      if (err.response?.status === 401 && retryCount === 0) {
        console.log('Attempting token refresh due to 401 error...');
        try {
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            console.log('Token refresh successful, retrying business listings...');
            return fetchListings(1); // Retry once after refresh
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
        }
      }
      
      // More specific error messages
      let errorMessage = 'Failed to load business listings';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required';
      } else if (err.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        errorMessage = 'Network connection error';
      }
      
      setError(errorMessage);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if auth is initialized and we have attempted refresh
    if (isInitialized && hasAttemptedRefresh) {
      // If we have an access token, fetch immediately
      if (accessToken) {
        fetchListings();
      } else {
        // No access token, set error state
        setError('Authentication required');
        setLoading(false);
      }
    }
  }, [accessToken, isInitialized, hasAttemptedRefresh]);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings
  };
};
