import { useState, useEffect } from "react";
import { BusinessListing } from "@/components/Header/types";
import { businessListingsService } from "@/services/businessListingsService";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";

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
  const {
    accessToken,
    isInitialized,
    hasAttemptedRefresh,
    refreshAccessToken,
  } = useAuthRedux();

  const fetchListings = async (retryCount = 0) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch listings without query to get user's default listings
      const data = await businessListingsService.getActiveListings({
        limit: 10,
      });

      setListings(data);
    } catch (err: any) {
      console.error(
        "📋 useBusinessListings: Failed to fetch business listings:",
        err
      );

      // Handle 401 errors with token refresh
      if (err.response?.status === 401 && retryCount === 0) {
        try {
          const refreshSuccess = await refreshAccessToken();
          if (refreshSuccess) {
            return fetchListings(1);
          }
        } catch (refreshError) {
          console.error(
            "📋 useBusinessListings: Token refresh failed:",
            refreshError
          );
        }
      }

      // Set appropriate error messages
      let errorMessage = "Failed to load business listings";
      if (err.response?.status === 401) {
        errorMessage = "Authentication required";
      } else if (err.response?.status === 403) {
        errorMessage = "Access denied";
      } else if (err.code === "NETWORK_ERROR" || !err.response) {
        errorMessage = "Network connection error";
      }

      setError(errorMessage);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && hasAttemptedRefresh) {
      if (accessToken) {
        fetchListings();
      } else {
        setError("Authentication required");
        setLoading(false);
      }
    }
  }, [accessToken, isInitialized, hasAttemptedRefresh]);

  return {
    listings,
    loading,
    error,
    refetch: fetchListings,
  };
};
