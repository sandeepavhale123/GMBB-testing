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

export const addTeamMember = async (payload: AddTeamMemberRequest): Promise<AddTeamMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/add-team-member",
      method: "POST",
      data: payload,
    });

    console.log("Add team member API response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to add team member:", error);
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
  id: number;
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

export const getEditMember = async (payload: GetEditMemberRequest): Promise<GetEditMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/get-edit-member",
      method: "POST",
      data: payload,
    });

    console.log("Get edit member API response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to fetch edit member:", error);
    throw error;
  }
};

export const updateTeamMember = async (payload: UpdateTeamMemberRequest): Promise<UpdateTeamMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/update-member",
      method: "POST",
      data: payload,
    });

    console.log("Update team member API response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to update team member:", error);
    throw error;
  }
};

export const deleteTeamMember = async (payload: DeleteTeamMemberRequest): Promise<DeleteTeamMemberResponse> => {
  try {
    const result = await axiosInstance({
      url: "/delete-member",
      method: "POST",
      data: payload,
    });

    console.log("Delete team member API response:", result.data);
    return result.data;
  } catch (error) {
    console.error("Failed to delete team member:", error);
    throw error;
  }
};