
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
      const data = await businessListingsService.getActiveListings({ limit: 10 });
      setListings(data);
      console.log('Fetched business listings:', data);
    } catch (err) {
      console.error('Failed to fetch business listings:', err);
      setError('Failed to load business listings');
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
