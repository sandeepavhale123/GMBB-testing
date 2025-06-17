
import { useState, useEffect } from 'react';
import { BusinessListing } from '@/components/Header/types';
import { businessListingsService } from '@/services/businessListingsService';

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

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching business listings...');
      
      const data = await businessListingsService.getActiveListings({ limit: 10 });
      setListings(data);
      console.log('Successfully fetched business listings:', data);
    } catch (err) {
      console.error('Failed to fetch business listings:', err);
      
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
    fetchListings();
  }, []);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings
  };
};
