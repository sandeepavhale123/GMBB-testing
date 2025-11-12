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

        // console.log(
        //   "📋🔄 useBusinessListingsWithRedux: Fetching API business listings...",
        //   { timestamp: currentTime } // ADD TIMESTAMP LOGGING
        // );
        // console.log("📋🔄 Auth state:", {
        //   accessToken: !!accessToken,
        //   isAuthenticated,
        //   hasAttemptedRefresh,
        //   isInitialized,
        // });

        const data = await businessListingsService.getActiveListings({
          limit: 5000,
        });
        // console.log(
        //   "📋🔄 useBusinessListingsWithRedux: Received",
        //   data.length,
        //   "API listings"
        // );

        setApiListings(data);
        // console.log(
        //   "📋🔄 useBusinessListingsWithRedux: Successfully updated API listings state",
        //   { timestamp: currentTime, count: data.length } // ADD THIS LOGGING
        // );
      } catch (err: any) {
        // console.error(
        //   "📋🔄 useBusinessListingsWithRedux: Failed to fetch API business listings:",
        //   err
        // );

        // Handle 401 errors with token refresh
        if (err.response?.status === 401 && retryCount === 0) {
          // console.log(
          //   "📋🔄 useBusinessListingsWithRedux: Attempting token refresh due to 401 error..."
          // );
          try {
            const refreshSuccess = await refreshAccessToken();
            if (refreshSuccess) {
              // console.log(
              //   "📋🔄 useBusinessListingsWithRedux: Token refresh successful, retrying..."
              // );
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
      // console.log(
      //   "📋➕ useBusinessListingsWithRedux: Attempting to add business listing:",
      //   business.name
      // );

      // Check if business already exists in combined listings (by ID)
      const existsInListings = allListings.some(
        (listing) => listing.id === business.id
      );

      if (existsInListings) {
        // console.log(
        //   "📋➕ useBusinessListingsWithRedux: Business already exists in listings:",
        //   business.name
        // );
        toast({
          title: "Business Already Added",
          description: `"${business.name}" is already in your business listings.`,
          variant: "default",
        });
        return;
      }

      // console.log(
      //   "📋➕ useBusinessListingsWithRedux: Adding new business listing:",
      //   business.name
      // );
      dispatch(addBusinessListing(business));
      toast({
        title: "Business Added",
        description: `"${business.name}" has been added to your listings.`,
        variant: "default",
      });
    };

    useEffect(() => {
      // console.log("📋🔄 useBusinessListingsWithRedux: Dependencies changed", {
      //   isInitialized,
      //   hasAttemptedRefresh,
      //   isAuthenticated,
      //   accessToken: !!accessToken,
      // });

      // For fresh login scenarios, allow fetching if we have valid auth state
      // even if hasAttemptedRefresh is false (since we just logged in successfully)
      const canFetchData =
        isInitialized &&
        ((hasAttemptedRefresh && isAuthenticated) ||
          (isAuthenticated && accessToken)); // Allow immediate fetch after successful login

      if (canFetchData) {
        // console.log(
        //   "📋🔄 useBusinessListingsWithRedux: Conditions met, fetching listings..."
        // );
        fetchListings();
      } else if (isInitialized && !isAuthenticated) {
        // console.log(
        //   "📋🔄 useBusinessListingsWithRedux: Not authenticated, clearing data"
        // );
        setError("Authentication required");
        setLoading(false);
        setApiListings([]);
      } else {
        // console.log(
        //   "📋🔄 useBusinessListingsWithRedux: Waiting for auth initialization..."
        // );
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
