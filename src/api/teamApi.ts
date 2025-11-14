import { toast } from "@/hooks/use-toast";
import axiosInstance from "./axiosInstance";

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string;
  password: string;
  role: string;
  listingsCount: number;
}

export interface TeamPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface TeamSummary {
  totalMembers: number;
  activeMembers: number;
  roleDistribution: {
    [key: string]: number;
  };
}

export interface GetTeamMembersRequest {
  page: number;
  limit: number;
  search: string;
  role: string;
}

export interface GetTeamMembersResponse {
  code: number;
  message: string;
  data: {
    members: TeamMember[];
    pagination: TeamPaginationInfo;
    summary: TeamSummary;
  };
}

export interface AddTeamMemberRequest {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: string;
}

export interface AddTeamMemberResponse {
  code: number;
  message: string;
  data: {
    user_id: number;
  };
}

export interface DeleteTeamMemberRequest {
  id: number;
  isDelete: string;
}

export interface DeleteTeamMemberResponse {
  code: number;
  message: string;
  data: [];
}

export const getTeamMembers = async (
  payload: GetTeamMembersRequest
): Promise<GetTeamMembersResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-team",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    throw error;
  }
};

export const addTeamMember = async (
  payload: AddTeamMemberRequest
): Promise<AddTeamMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/add-team-member",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to add team member:", error);
    throw error;
  }
};

export interface GetEditMemberRequest {
  id: number;
}

export interface GetEditMemberResponse {
  code: number;
  message: string;
  data: TeamMember;
}

export interface UpdateTeamMemberRequest {
  Id: number;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  role: string;
}

export interface UpdateTeamMemberResponse {
  code: number;
  message: string;
  data: any;
}

export const getEditMember = async (
  payload: GetEditMemberRequest
): Promise<GetEditMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-edit-member",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to fetch edit member:", error);
    throw error;
  }
};

export const updateTeamMember = async (
  payload: UpdateTeamMemberRequest
): Promise<UpdateTeamMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/update-team-member",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to update team member:", error);
    throw error;
  }
};

export const deleteTeamMember = async (
  payload: DeleteTeamMemberRequest
): Promise<DeleteTeamMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/delete-member",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to delete team member:", error);
    throw error;
  }
};

export interface GetActiveAccountsRequest {
  id: number; // employee id
  page: number;
  limit: number;
}

export interface Account {
  accountId: string;
  accountName: string;
  totalListings: number;
  activeListings: number;
  inActiveListings: number;
}

export interface Listing {
  id: string;
  name: string;
  accountName: string;
  allocated: boolean;
}

export interface GetActiveAccountsResponse {
  code: number;
  message: string;
  data: {
    totalAssignListings: number;
    assignListingIds: number[];
    accounts: Account[];
    totalListings: number;
    listings: Listing[];
    page: number;
    limit: number;
    nextPageToken: number | null;
    prevPageToken: number | null;
    hasMore: boolean;
  };
}

export interface GetActiveAccountListRequest {
  id: number; // team member id
  accountId: number;
}

export interface GetActiveAccountListResponse {
  code: number;
  message: string;
  data: {
    accountId: string;
    accountName: string;
    totalListings: number;
    listings: Listing[];
    page: number;
    limit: number;
    nextPageToken: string;
    prevPageToken: string;
    hasMore: boolean;
  };
}

export interface SaveAssignListingsRequest {
  id: number;
  listId: number[];
}

export interface SaveAssignListingsResponse {
  code: number;
  message: string;
  data: {
    id: number;
    listId: string;
  };
}

export const getActiveAccounts = async (
  payload: GetActiveAccountsRequest
): Promise<GetActiveAccountsResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-active-accounts",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to fetch active accounts:", error);
    throw error;
  }
};

export const getActiveAccountList = async (
  payload: GetActiveAccountListRequest
): Promise<GetActiveAccountListResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-active-account-list",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to fetch active account list:", error);
    throw error;
  }
};

export const saveAssignListings = async (
  payload: SaveAssignListingsRequest
): Promise<SaveAssignListingsResponse> => {
  try {
    const result = await axiosInstance({
      url: "/save-assign-listings",
      method: "POST",
      data: payload,
    });

    return result.data;
  } catch (error) {
    // console.error("Failed to save assign listings:", error);
    throw error;
  }
};
