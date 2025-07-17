import axiosInstance from "./axiosInstance";

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePicture: string;
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

export const getTeamMembers = async (payload: GetTeamMembersRequest): Promise<GetTeamMembersResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-team",
      method: "POST",
      data: payload,
    });

    console.log("Team members API response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    throw error;
  }
};