import { useState, useEffect, useCallback } from "react";
import {
  accountListingsApi,
  AccountListingRequest,
  AccountListingResponse,
} from "../api/accountListingsApi";

export interface UseAccountListingsParams {
  accountId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive" | "verified" | "unverified";
  sortOrder?: "asc" | "desc";
}

// Transform API location to component listing format
const transformLocationToListing = (location: any) => ({
  id: location.id,
  name: location.locationName,
  store_code: location.storeCode !== "" ? location.storeCode : "-", // Use ID as store code since not provided
  group_name: location.category, // Use category as group name
  state: location.state,
  status:
    location.isVerified === "1" ? ("verified" as const) : ("pending" as const),
  isActive: location.isActive === "1",
  profile_image: undefined, // Not provided by API
  address: location.address || `${location.state}, ${location.country}`,
  zipcode: location.zipcode,
});

export const useAccountListings = (params: UseAccountListingsParams) => {
  const [data, setData] = useState<AccountListingResponse["data"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    accountId,
    page = 1,
    limit = 10,
    search = "",
    status = "all",
    sortOrder = "asc",
  } = params;

  const fetchListings = useCallback(async () => {
    if (!accountId) return;

    setLoading(true);
    setError(null);

    try {
      const request: AccountListingRequest = {
        accountId: parseInt(accountId),
        pagination: {
          page,
          limit,
          offset: (page - 1) * limit,
        },
        filters: {
          search: search.toLowerCase().trim(), // Make search case-insensitive
          status,
        },
        sorting: {
          sortOrder,
        },
      };

      const response = await accountListingsApi.getAccountListings(request);
      setData(response.data);
    } catch (err: any) {
      // console.error("Error fetching account listings:", err);
      setError(
        err.response?.data?.message || "Failed to fetch account listings"
      );
    } finally {
      setLoading(false);
    }
  }, [accountId, page, limit, search, status, sortOrder]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const refetch = useCallback(() => {
    fetchListings();
  }, [fetchListings]);

  // Transform locations to listings format
  const listings = data?.locations
    ? data.locations.map(transformLocationToListing)
    : [];

  return {
    listings,
    totalListings: data?.totalListing || 0,
    activeListings: data?.activeCount || 0,
    inactiveListings: data?.inactiveCount || 0,
    pagination: data?.pagination,
    profileEmail: data?.profileEmail,
    loading,
    error,
    refetch,
  };
};
