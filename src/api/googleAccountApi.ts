
import axiosInstance from './axiosInstance';

export interface GoogleAccountPagination {
  page: number;
  limit: number;
  offset: number;
  total?: number;
  total_pages?: number;
  has_next?: boolean;
  has_prev?: boolean;
}

export interface GoogleAccountFilters {
  search: string;
}

export interface GoogleAccountSorting {
  sortOrder: 'asc' | 'desc';
}

export interface GoogleAccountRequest {
  pagination: GoogleAccountPagination;
  filters: GoogleAccountFilters;
  sorting: GoogleAccountSorting;
}

export interface GoogleAccountResponse {
  code: number;
  message: string;
  data: {
    accounts: Array<{
      id: string;
      name: string | null;
      email: string;
      avatar: string | null;
      listings: number;
      activeListings: number;
      lastSynced: string;
      isEnabled: boolean;
      visibilityScore: number;
      reviewResponseRate: number;
      keywordsTracked: number;
      qaResponseHealth: number;
      connectedListings: string[];
    }>;
    totalActiveListings: number;
    totalAccounts: number;
    pagination: GoogleAccountPagination;
  };
}

export const googleAccountApi = {
  getAccounts: async (params: GoogleAccountRequest): Promise<GoogleAccountResponse> => {
    const response = await axiosInstance({
      url: '/get-accounts',
      method: 'POST',
      data: params,
    });
    return response.data;
  },
};
