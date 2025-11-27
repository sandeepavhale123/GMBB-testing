import axiosInstance from "./axiosInstance";

export interface AutoReplyProjectAPI {
  id: string;
  projectName: string;
  locationCount: number;
  settingType: "AI" | "Custom Template";
  listings: string[];
  aiSettings?: {
    tone: string;
    responseLength: string;
    includePromotions: boolean;
  };
  customSettings?: {
    template: string;
    variables: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface FetchAutoReplyProjectsRequest {
  page: number;
  limit: number;
  search?: string;
}

export interface FetchAutoReplyProjectsResponse {
  code: number;
  message: string;
  data: {
    projects: AutoReplyProjectAPI[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

export interface CreateAutoReplyProjectRequest {
  projectName: string;
  listings: string[];
  replyType: "AI" | "Custom";
  aiSettings?: {
    tone: string;
    responseLength: string;
    includePromotions: boolean;
  };
  customSettings?: {
    template: string;
    variables: string[];
  };
}

export interface CreateAutoReplyProjectResponse {
  code: number;
  message: string;
  data: AutoReplyProjectAPI;
}

export interface DeleteAutoReplyProjectResponse {
  code: number;
  message: string;
}

export interface ListingOption {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface FetchListingsResponse {
  code: number;
  message: string;
  data: ListingOption[];
}

export const autoReplyApi = {
  // Fetch auto reply projects.
  fetchProjects: async (params: FetchAutoReplyProjectsRequest): Promise<FetchAutoReplyProjectsResponse> => {
    const response = await axiosInstance.post("/get-auto-reply-projects", {
      page: params.page,
      limit: params.limit,
      search: params.search || "",
    });
    return response.data;
  },

  // Create auto reply project
  createProject: async (data: CreateAutoReplyProjectRequest): Promise<CreateAutoReplyProjectResponse> => {
    const response = await axiosInstance.post("/create-auto-reply-project", data);
    return response.data;
  },

  // Delete auto reply project
  deleteProject: async (projectId: string): Promise<DeleteAutoReplyProjectResponse> => {
    const response = await axiosInstance.post("/delete-auto-reply-project", {
      projectId,
    });
    return response.data;
  },

  // Fetch listings for dropdown
  fetchListings: async (): Promise<FetchListingsResponse> => {
    const response = await axiosInstance.post("/get-listings-for-auto-reply");
    return response.data;
  },
};
