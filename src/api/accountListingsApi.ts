import axiosInstance from "./axiosInstance";

export interface AccountListingPagination {
  page: number;
  limit: number;
  offset: number;
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}

export interface AccountListingFilters {
  search: string;
  status: "all" | "active" | "inactive" | "verified" | "unverified";
}

export interface AccountListingSorting {
  sortOrder: "asc" | "desc";
}

export interface AccountListingRequest {
  accountId: number;
  pagination: AccountListingPagination;
  filters: AccountListingFilters;
  sorting: AccountListingSorting;
}

export interface AccountListingLocation {
  id: string;
  locationName: string;
  address: string;
  country: string;
  state: string;
  zipcode: string;
  category: string;
  isVerified: string;
  isActive: string;
}

export interface AccountListingResponse {
  code: number;
  message: string;
  data: {
    accountId: number;
    profileEmail: string;
    totalListing: number;
    activeCount: number;
    inactiveCount: number;
    locations: AccountListingLocation[];
    pagination: AccountListingPagination;
  };
}

export const accountListingsApi = {
  getAccountListings: async (
    params: AccountListingRequest
  ): Promise<AccountListingResponse> => {
    const response = await axiosInstance({
      url: "/get-account-listings",
      method: "POST",
      data: params,
    });
    return response.data;
  },
};
