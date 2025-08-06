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
  galleryImageUrl?: string;
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

export interface CreateBulkPostRequest {
  listingId: string; // Comma-separated string like "label-1530,176820,177880"
  title: string;
  postType: string;
  description: string;
  userfile?: File;
  selectedImage?: string;
  aiImageUrl?: string;
  galleryImageUrl?: string;
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

export interface CreateBulkPostResponse {
  code: number;
  message: string;
  data: {
    postId: number;
  };
}

export interface GetBulkPostsOverviewRequest {
  page: number;
  limit: number;
}

export interface BulkPostOverviewItem {
  id: string;
  posttype: string;
  posttext: string;
  state: string;
  tags: string;
  image: string;
  action_type: string;
  CTA_url: string;
  location_count: number;
  publishDate: string;
  livePosts: number;
  failedPosts: number;
  schedulePosts: number;
}

export interface GetBulkPostsOverviewResponse {
  code: number;
  message: string;
  data: {
    bulkPostOverviewDetails: BulkPostOverviewItem[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
  };
}

export const postsApi = {
  getPosts: async (request: GetPostsRequest): Promise<GetPostsResponse> => {
    const response = await axiosInstance.post("/get-posts", request);
    return response.data;
  },

  createPost: async (
    request: CreatePostRequest
  ): Promise<CreatePostResponse> => {
    console.log('🚀 API createPost called with:', request);
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
      console.log('✅ Added selectedImage to FormData:', request.selectedImage);
    }
    if (request.aiImageUrl) {
      formData.append("aiImageUrl", request.aiImageUrl);
    }
    if (request.galleryImageUrl) {
      formData.append("galleryImageUrl", request.galleryImageUrl);
      console.log('🖼️ Added galleryImageUrl to FormData:', request.galleryImageUrl);
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

  createBulkPost: async (
    request: CreateBulkPostRequest
  ): Promise<CreateBulkPostResponse> => {
    console.log('🚀 API createBulkPost called with:', request);
    const formData = new FormData();

    // Add all fields to FormData
    formData.append("listingId", request.listingId); // Already a string
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
      console.log('✅ Added selectedImage to FormData:', request.selectedImage);
    }
    if (request.aiImageUrl) {
      formData.append("aiImageUrl", request.aiImageUrl);
    }
    if (request.galleryImageUrl) {
      formData.append("galleryImageUrl", request.galleryImageUrl);
      console.log('🖼️ Added galleryImageUrl to FormData:', request.galleryImageUrl);
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

    const response = await axiosInstance.post("/create-bulk-posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getBulkPostsOverview: async (request: GetBulkPostsOverviewRequest): Promise<GetBulkPostsOverviewResponse> => {
    const response = await axiosInstance.post("/get-bulk-posts-overview", request);
    return response.data;
  },
};
