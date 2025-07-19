import axiosInstance from "./axiosInstance";

export interface GetPostsRequest {
  listingId: number;
  filters: {
    status: string;
    search: string;
    dateRange: {
      startDate: string;
      endDate: string;
    };
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
  sorting: {
    sortBy: string;
    sortOrder: string;
  };
}

export interface CreatePostRequest {
  listingId: number;
  title: string;
  postType: string;
  description: string;
  userfile?: File;
  selectedImage?: string;
  aiImageUrl?: string;
  ctaButton?: string;
  ctaUrl?: string;
  publishOption: string;
  scheduleDate?: string;
  platforms: string[];
  startDate?: string;
  endDate?: string;
  couponCode?: string;
  redeemOnlineUrl?: string;
  termsConditions?: string;
  postTags?: string;
  siloPost?: boolean;
}

export interface CreatePostResponse {
  code: number;
  message: string;
  data: {
    postId: number;
  };
}

export interface ApiPost {
  id: string;
  title: string;
  content: string;
  status: "LIVE" | "DRAFT" | "SCHEDULED" | "FAILED";
  listingId: string;
  searchUrl: string;
  publishDate: string | null;
  media: {
    images: string;
  };
  tags: string;
  reason: string;
}

export interface GetPostsResponse {
  code: number;
  message: string;
  data: {
    posts: ApiPost[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalPosts: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    filters: {
      appliedFilters: {
        status: string;
        search: string;
      };
    };
  };
}

export interface DeletePostRequest {
  postId: number[];
  listingId: number;
}

export interface DeletePostResponse {
  code: number;
  message: string;
  data: [];
}

export const postsApi = {
  getPosts: async (request: GetPostsRequest): Promise<GetPostsResponse> => {
    const response = await axiosInstance.post("/get-posts", request);
    return response.data;
  },

  createPost: async (
    request: CreatePostRequest
  ): Promise<CreatePostResponse> => {
    const formData = new FormData();

    // Add all fields to FormData
    formData.append("listingId", request.listingId.toString());
    formData.append("title", request.title || "");
    formData.append("postType", request.postType || "");
    formData.append("description", request.description);
    formData.append("publishOption", request.publishOption);
    formData.append("platforms", JSON.stringify(request.platforms));

    // Add optional fields
    if (request.userfile) {
      formData.append("userfile", request.userfile);
    }
    if (request.selectedImage) {
      formData.append("selectedImage", request.selectedImage);
    }
    if (request.aiImageUrl) {
      formData.append("aiImageUrl", request.aiImageUrl);
    }
    if (request.ctaButton) {
      formData.append("ctaButton", request.ctaButton);
    }
    if (request.ctaUrl) {
      formData.append("ctaUrl", request.ctaUrl);
    }
    if (request.scheduleDate) {
      formData.append("scheduleDate", request.scheduleDate);
    }
    if (request.startDate) {
      formData.append("startDate", request.startDate);
    }
    if (request.endDate) {
      formData.append("endDate", request.endDate);
    }
    if (request.couponCode) {
      formData.append("couponCode", request.couponCode);
    }
    if (request.redeemOnlineUrl) {
      formData.append("redeemOnlineUrl", request.redeemOnlineUrl);
    }
    if (request.termsConditions) {
      formData.append("termsConditions", request.termsConditions);
    }
    if (request.postTags) {
      formData.append("postTags", request.postTags);
    }
    if (request.siloPost !== undefined) {
      formData.append("siloPost", request.siloPost.toString());
    }

    const response = await axiosInstance.post("/create-post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deletePost: async (
    request: DeletePostRequest
  ): Promise<DeletePostResponse> => {
    const response = await axiosInstance.post("/delete-posts", request);
    return response.data;
  },
};
