import { useState, useEffect, useRef } from "react";
import { BusinessListing } from "@/components/Header/types";
import { businessListingsService } from "@/services/businessListingsService";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useAppSelector, useAppDispatch } from "@/hooks/useRedux";
import { addBusinessListing } from "@/store/slices/businessListingsSlice";
import { toast } from "@/hooks/use-toast";

interface UseBusinessListingsWithReduxReturn {
  listings: BusinessListing[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addNewListing: (business: BusinessListing) => void;
}

export const useBusinessListingsWithRedux =
  (): UseBusinessListingsWithReduxReturn => {
    const [apiListings, setApiListings] = useState<BusinessListing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const lastFetchRef = useRef<number>(0); // ADD THIS LINE

    const {
      accessToken,
      isInitialized,
      hasAttemptedRefresh,
      isAuthenticated,
      refreshAccessToken,
    } = useAuthRedux();

    const dispatch = useAppDispatch();
    const { userAddedListings } = useAppSelector(
      (state) => state.businessListings
    );

    // Combine user-added listings first, then API listings (user-added at top)
    const allListings = [...userAddedListings, ...apiListings];

    const fetchListings = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);
        const currentTime = Date.now();
        lastFetchRef.current = currentTime; // ADD THIS LINE

        const data = await businessListingsService.getActiveListings({
          limit: 5000,
        });

        setApiListings(data);
      } catch (err: any) {
        // console.error(
        //   "📋🔄 useBusinessListingsWithRedux: Failed to fetch API business listings:",
        //   err
        // );

        // Handle 401 errors with token refresh
        if (err.response?.status === 401 && retryCount === 0) {
          try {
            const refreshSuccess = await refreshAccessToken();
            if (refreshSuccess) {
              return fetchListings(1);
            }
          } catch (refreshError) {
            // console.error(
            //   "📋🔄 useBusinessListingsWithRedux: Token refresh failed:",
            //   refreshError
            // );
          }
        }

        let errorMessage = "Failed to load business listings";
        if (err.response?.status === 401) {
          errorMessage = "Authentication required";
        } else if (err.response?.status === 403) {
          errorMessage = "Access denied";
        } else if (err.code === "NETWORK_ERROR" || !err.response) {
          errorMessage = "Network connection error";
        }

        setError(errorMessage);
        setApiListings([]);
      } finally {
        setLoading(false);
      }
    };

    const addNewListing = (business: BusinessListing) => {
      // Check if business already exists in combined listings (by ID)
      const existsInListings = allListings.some(
        (listing) => listing.id === business.id
      );

      if (existsInListings) {
        toast({
          title: "Business Already Added",
          description: `"${business.name}" is already in your business listings.`,
          variant: "default",
        });
        return;
      }

      dispatch(addBusinessListing(business));
      toast({
        title: "Business Added",
        description: `"${business.name}" has been added to your listings.`,
        variant: "default",
      });
    };

    useEffect(() => {
      // For fresh login scenarios, allow fetching if we have valid auth state
      // even if hasAttemptedRefresh is false (since we just logged in successfully)
      const canFetchData =
        isInitialized &&
        ((hasAttemptedRefresh && isAuthenticated) ||
          (isAuthenticated && accessToken)); // Allow immediate fetch after successful login

      if (canFetchData) {
        fetchListings();
      } else if (isInitialized && !isAuthenticated) {
        setError("Authentication required");
        setLoading(false);
        setApiListings([]);
      } else {
        //
      }
    }, [accessToken, isInitialized, hasAttemptedRefresh, isAuthenticated]);

    return {
      listings: allListings,
      loading,
      error,
      refetch: fetchListings,
      addNewListing,
    };
  };
