import axiosInstance from "./axiosInstance";

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
  sortOrder: "asc" | "desc";
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
    allowedListing: number;
    pagination: GoogleAccountPagination;
  };
}
export interface RefreshAccountResponse {
  code: number;
  message: string;
  data: string[][]; // Array of arrays containing [accountId, name, status]
}

export interface UpdateAccountResponse {
  code: number;
  message: string;
  data?: any;
}
export const deleteGoogleAccount = async (accountId: string): Promise<void> => {
  const response = await axiosInstance.post("/delete-account", {
    accountId: accountId,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to delete account: ${response.statusText}`);
  }

  return response.data;
};

export const refreshGmbAccount = async (
  accountId: string
): Promise<RefreshAccountResponse> => {
  const response = await axiosInstance.post("/manage-gmb-account", {
    accountId: parseInt(accountId),
  });

  if (response.status !== 200) {
    throw new Error(`Failed to refresh account: ${response.statusText}`);
  }

  return response.data;
};

export const updateGmbAccount = async (
  accountId: string,
  accountGrpIds: [string, string][]
): Promise<UpdateAccountResponse> => {
  const response = await axiosInstance.post("/update-gmb-account", {
    accountId: parseInt(accountId),
    accountGrpIds,
  });

  if (response.status !== 200) {
    throw new Error(`Failed to update account: ${response.statusText}`);
  }

  return response.data;
};

export const googleAccountApi = {
  // Get Accounts
  getAccounts: async (
    params: GoogleAccountRequest
  ): Promise<GoogleAccountResponse> => {
    const response = await axiosInstance({
      url: "/get-accounts",
      method: "POST",
      data: params,
    });
    return response.data;
  },

  // Delete Account - keeping the old method for backward compatibility
  deleteAccount: async (accountId: string): Promise<void> => {
    return deleteGoogleAccount(accountId);
  },

  // Refresh Account
  refreshAccount: async (
    accountId: string
  ): Promise<RefreshAccountResponse> => {
    return refreshGmbAccount(accountId);
  },

  // Update Account
  updateAccount: async (
    accountId: string,
    accountGrpIds: [string, string][]
  ): Promise<UpdateAccountResponse> => {
    return updateGmbAccount(accountId, accountGrpIds);
  },
};
