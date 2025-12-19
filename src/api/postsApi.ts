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
  // Auto Recurring Post fields
  autoRescheduleType?: number;  // 1 = daily, 2 = weekly, 3 = monthly
  autoPostTime?: string;        // "10:20 AM" format
  autoWeekDay?: string;         // "monday", "tuesday", etc.
  autoMonthDate?: number;       // 1-31
  autoPostCount?: number;       // Recurrence frequency count
}

export interface CreatePostResponse {
  code: number;
  message: string;
  data: {
    postId: number;
  };
}

// Edit Post interfaces
export interface EditPostRequest extends CreatePostRequest {
  id: number; // Post ID for editing
}

export interface EditPostResponse {
  code: number;
  message: string;
  data: {
    postId: string;
  };
}

// Get Post Details interfaces
export interface GetPostDetailsRequest {
  postId: number;
}

export interface GetPostDetailsResponse {
  code: number;
  message: string;
  data: {
    id: string;
    user_id: string;
    listingId: string;
    description: string;
    imageUrl: string;
    postTags: string;
    ctaButton: string;
    ctaUrl: string;
    status: string;
    postType: string;
    publishOption: string;
    scheduleDate: string;
    autoRescheduleType: number;
    autoPostTime: string;
    autoWeekDay: string;
    autoMonthDate: number;
    autoPostCount: number;
    // Event/Offer fields
    title?: string;
    startDate?: string;
    endDate?: string;
    couponCode?: string;
    redeemOnlineUrl?: string;
    termsConditions?: string;
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
  // Auto Recurring Post fields
  autoRescheduleType?: number;  // 1 = daily, 2 = weekly, 3 = monthly
  autoPostTime?: string;        // "10:20 AM" format
  autoWeekDay?: string;         // "monday", "tuesday", etc.
  autoMonthDate?: number;       // 1-31
  autoPostCount?: number;       // Recurrence frequency count
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
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface GetBulkPostsSummaryRequest {
  bulkId: number;
}

// Edit Bulk Post Details interfaces
export interface GetEditBulkPostDetailsRequest {
  bulkId: number;
}

export interface GetEditBulkPostDetailsResponse {
  code: number;
  message: string;
  data: {
    bulkId: number;
    listingId: string[];
    postType: string;
    description: string;
    postTags: string;
    selectedImage: string;
    imageUrl: string;
    ctaButton: string;
    ctaUrl: string;
    title: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    couponCode: string;
    redeemOnlineUrl: string;
    termsConditions: string;
    publishOption: string;
    scheduleDate: string;
    selretype: number;
    autoPostTime: string;
    weekDay: string;
    monthDay: string;
    recurrentFreq: string;
  };
}

export interface UpdateBulkPostRequest {
  bulkId: number;
  listingId: string;
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
  startDate?: string;
  endDate?: string;
  title?: string;
  tags?: string;
  couponCode?: string;
  redeemOnlineUrl?: string;
  termsConditions?: string;
  postTags?: string;
}

export interface UpdateBulkPostResponse {
  code: number;
  message: string;
  data: {
    results: Array<{
      listingId: string;
      status: string;
      postId: number;
      message: string;
    }>;
  };
}

export interface BulkPostSummaryItem {
  posttype: string;
  posttext: string;
  state: string;
  tags: string;
  image: string;
  event_title: string;
  action_type: string;
  CTA_url: string;
  publishDate: string;
}

export interface GetBulkPostsSummaryResponse {
  code: number;
  message: string;
  data: {
    postSummary: BulkPostSummaryItem[];
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
    if (request.galleryImageUrl) {
      formData.append("galleryImageUrl", request.galleryImageUrl);
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

    // Auto recurring post fields (only when publishOption is recurrent)
    if (request.publishOption === "recurrent") {
      if (request.autoRescheduleType) {
        formData.append("autoRescheduleType", request.autoRescheduleType.toString());
      }
      if (request.autoPostTime) {
        formData.append("autoPostTime", request.autoPostTime);
      }
      if (request.autoWeekDay) {
        formData.append("autoWeekDay", request.autoWeekDay);
      }
      if (request.autoMonthDate) {
        formData.append("autoMonthDate", request.autoMonthDate.toString());
      }
      if (request.autoPostCount) {
        formData.append("autoPostCount", request.autoPostCount.toString());
      }
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
    }
    if (request.aiImageUrl) {
      formData.append("aiImageUrl", request.aiImageUrl);
    }
    if (request.galleryImageUrl) {
      formData.append("galleryImageUrl", request.galleryImageUrl);
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

    // Auto recurring post fields (only when publishOption is recurrent)
    if (request.publishOption === "recurrent") {
      if (request.autoRescheduleType) {
        formData.append("autoRescheduleType", request.autoRescheduleType.toString());
      }
      if (request.autoPostTime) {
        formData.append("autoPostTime", request.autoPostTime);
      }
      if (request.autoWeekDay) {
        formData.append("autoWeekDay", request.autoWeekDay);
      }
      if (request.autoMonthDate) {
        formData.append("autoMonthDate", request.autoMonthDate.toString());
      }
      if (request.autoPostCount) {
        formData.append("autoPostCount", request.autoPostCount.toString());
      }
    }

    const response = await axiosInstance.post("/create-bulk-posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getBulkPostsOverview: async (
    request: GetBulkPostsOverviewRequest
  ): Promise<GetBulkPostsOverviewResponse> => {
    const response = await axiosInstance.post(
      "/get-bulk-posts-overview",
      request
    );
    return response.data;
  },

  deleteBulkPost: async (request: {
    bulkId: number;
  }): Promise<{ code: number; message: string; data: any[] }> => {
    const response = await axiosInstance.post(
      "/delete-bulk-overview-posts",
      request
    );
    return response.data;
  },

  getBulkPostDetails: async (request: {
    bulkId: number;
    search: string;
    status: string;
    page: number;
    limit: number;
  }): Promise<{
    code: number;
    message: string;
    data: {
      postSummary: Array<{
        posttype: string;
        posttext: string;
        state: string;
        tags: string;
        image: string;
        event_title: string;
        action_type: string;
        CTA_url: string;
        publishDate: string;
      }>;
      bulkPostDetails: Array<{
        id: string;
        state: string;
        search_url: string;
        locationName: string;
        zipCode: string;
      }>;
      pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
      };
    };
  }> => {
    const response = await axiosInstance.post("/get-bulk-posts-details", {
      bulkId: request.bulkId,
      search: request.search,
      status: request.status,
      page: request.page,
      limit: request.limit,
    });
    return response.data;
  },

  deletePostFromBulk: async (request: {
    postId: string;
  }): Promise<{ code: number; message: string; data: any[] }> => {
    const response = await axiosInstance.post("/delete-bulk-posts", {
      postId: [Number(request.postId)],
    });
    return response.data;
  },

  getBulkPostsSummary: async (
    request: GetBulkPostsSummaryRequest
  ): Promise<GetBulkPostsSummaryResponse> => {
    const response = await axiosInstance.post(
      "/get-bulk-posts-summary",
      request
    );
    return response.data;
  },

  getPostDetails: async (
    request: GetPostDetailsRequest
  ): Promise<GetPostDetailsResponse> => {
    const response = await axiosInstance.post("/get-post-details", request);
    return response.data;
  },

  editPost: async (request: EditPostRequest): Promise<EditPostResponse> => {
    const formData = new FormData();

    // Add post ID for editing
    formData.append("id", request.id.toString());

    // Add all fields to FormData (same as createPost)
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
    if (request.galleryImageUrl) {
      formData.append("galleryImageUrl", request.galleryImageUrl);
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

    // Auto recurring post fields (only when publishOption is recurrent)
    if (request.publishOption === "recurrent") {
      if (request.autoRescheduleType) {
        formData.append("autoRescheduleType", request.autoRescheduleType.toString());
      }
      if (request.autoPostTime) {
        formData.append("autoPostTime", request.autoPostTime);
      }
      if (request.autoWeekDay) {
        formData.append("autoWeekDay", request.autoWeekDay);
      }
      if (request.autoMonthDate) {
        formData.append("autoMonthDate", request.autoMonthDate.toString());
      }
      if (request.autoPostCount) {
        formData.append("autoPostCount", request.autoPostCount.toString());
      }
    }

    const response = await axiosInstance.post("/edit-post", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get bulk post details for editing
  getEditBulkPostDetails: async (
    request: GetEditBulkPostDetailsRequest
  ): Promise<GetEditBulkPostDetailsResponse> => {
    const response = await axiosInstance.post("/edit-bulk-posts-details", request);
    return response.data;
  },

  // Update bulk posts
  updateBulkPosts: async (
    request: UpdateBulkPostRequest
  ): Promise<UpdateBulkPostResponse> => {
    const formData = new FormData();

    formData.append("bulkId", request.bulkId.toString());
    formData.append("listingId", request.listingId);
    formData.append("postType", request.postType);
    formData.append("description", request.description);
    formData.append("publishOption", request.publishOption);

    if (request.userfile) {
      formData.append("userfile", request.userfile);
    }
    if (request.selectedImage) {
      formData.append("selectedImage", request.selectedImage);
    }
    if (request.aiImageUrl) {
      formData.append("aiImageUrl", request.aiImageUrl);
    }
    if (request.galleryImageUrl) {
      formData.append("galleryImageUrl", request.galleryImageUrl);
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
    if (request.title) {
      formData.append("title", request.title);
    }
    if (request.tags) {
      formData.append("tags", request.tags);
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

    const response = await axiosInstance.post("/update-bulk-posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
