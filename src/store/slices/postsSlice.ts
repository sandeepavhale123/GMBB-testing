import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postsApi,
  GetPostsRequest,
  ApiPost,
  CreatePostRequest,
  DeletePostRequest,
  CreateBulkPostRequest,
  BulkPostOverviewItem,
  GetBulkPostsSummaryRequest,
  BulkPostSummaryItem,
  EditPostRequest,
  GetPostDetailsResponse,
} from "../../api/postsApi";

interface Post {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "scheduled" | "failed";
  business: string;
  publishDate: string;
  engagement: {
    views: number;
    clicks: number;
    shares: number;
  };
  searchUrl?: string;
  media?: {
    images: string;
  };
  tags?: string;
  reason: string;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  filter: "all" | "published" | "draft" | "scheduled" | "failed";
  searchQuery: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  createLoading: boolean;
  createError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  bulkPostsOverview: BulkPostOverviewItem[];
  bulkPostsOverviewLoading: boolean;
  bulkPostsOverviewError: string | null;
  bulkPostsOverviewPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };

  // Bulk post details state
  bulkPostDetails: {
    postSummary: any[];
    bulkPostDetails: any[];
    pagination: any;
  } | null;
  bulkPostDetailsLoading: boolean;
  bulkPostDetailsError: string | null;

  // Bulk post summary state
  bulkPostSummary: BulkPostSummaryItem[] | null;
  bulkPostSummaryLoading: boolean;
  bulkPostSummaryError: string | null;

  // Edit post state
  editLoading: boolean;
  editError: string | null;
  postDetails: GetPostDetailsResponse["data"] | null;
  postDetailsLoading: boolean;
  postDetailsError: string | null;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  filter: "all",
  searchQuery: "",
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrevious: false,
  },
  createLoading: false,
  createError: null,
  deleteLoading: false,
  deleteError: null,
  bulkPostsOverview: [],
  bulkPostsOverviewLoading: false,
  bulkPostsOverviewError: null,
  bulkPostsOverviewPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  },

  bulkPostDetails: null,
  bulkPostDetailsLoading: false,
  bulkPostDetailsError: null,

  bulkPostSummary: null,
  bulkPostSummaryLoading: false,
  bulkPostSummaryError: null,

  // Edit post state
  editLoading: false,
  editError: null,
  postDetails: null,
  postDetailsLoading: false,
  postDetailsError: null,
};

// Helper function to map API status to frontend status
const mapApiStatusToFrontendStatus = (
  apiStatus: string
): "published" | "draft" | "scheduled" | "failed" => {
  const normalizedStatus = apiStatus.toUpperCase();
  switch (normalizedStatus) {
    case "LIVE":
    case "PUBLISHED":
      return "published";
    case "DRAFT":
      return "draft";
    case "SCHEDULED":
      return "scheduled";
    case "FAILED":
      return "failed";
    default:
      return "draft";
  }
};

// Helper function to map frontend filter to API filter
const mapFilterToApiStatus = (filter: string): string => {
  switch (filter) {
    case "published":
      return "LIVE";
    case "draft":
      return "DRAFT";
    case "scheduled":
      return "SCHEDULED";
    case "failed":
      return "FAILED";
    default:
      return "all";
  }
};

// Helper: Convert frequency to API type number
const mapFrequencyToType = (frequency: string): number => {
  switch (frequency) {
    case "daily": return 1;
    case "weekly": return 2;
    case "monthly": return 3;
    default: return 1;
  }
};

// Helper: Convert 24hr time to 12hr format
const convertTo12HourFormat = (time24: string): string => {
  if (!time24) return "";
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Helper: Convert day index to day name
const dayIndexToName = (index: string): string => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[parseInt(index)] || 'sunday';
};

// Helper function to transform API post to frontend post
const transformApiPostToFrontendPost = (apiPost: ApiPost): Post => {
  const transformedPost = {
    id: apiPost.id,
    title: apiPost.title || "Untitled Post",
    content: apiPost.content,
    status: mapApiStatusToFrontendStatus(apiPost.status),
    business: "Business Name", // You might want to get this from context or API
    publishDate: apiPost.publishDate || new Date().toISOString().split("T")[0],
    engagement: {
      views: 0,
      clicks: 0,
      shares: 0,
    },
    searchUrl: apiPost.searchUrl,
    media: apiPost.media,
    tags: apiPost.tags,
    reason: apiPost.reason || "",
  };

  return transformedPost;
};

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({
    listingId,
    filters,
    pagination,
    sorting,
  }: {
    listingId: number;
    filters?: {
      status?: string;
      search?: string;
      dateRange?: {
        startDate?: string;
        endDate?: string;
      };
    };
    pagination?: {
      page?: number;
      limit?: number;
    };
    sorting?: {
      sortBy?: string;
      sortOrder?: string;
    };
  }) => {
    const request: GetPostsRequest = {
      listingId,
      filters: {
        status: filters?.status || "all",
        search: filters?.search || "",
        dateRange: {
          startDate: filters?.dateRange?.startDate || "",
          endDate: filters?.dateRange?.endDate || "",
        },
      },
      pagination: {
        page: pagination?.page || 1,
        limit: pagination?.limit || 12,
        total: 0,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
      sorting: {
        sortBy: sorting?.sortBy || "postdate",
        sortOrder: sorting?.sortOrder || "desc",
      },
    };

    const response = await postsApi.getPosts(request);
    return response;
  }
);

// Async thunk for creating posts
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData: CreatePostRequest) => {
    // Transform auto-scheduling fields if publishOption is "auto"
    const transformedData: CreatePostRequest = {
      ...postData,
      publishOption: postData.publishOption === "auto" ? "recurrent" : postData.publishOption,
    };

    // Add auto-scheduling fields when recurrent
    if (postData.publishOption === "auto") {
      const autoData = postData as any;
      transformedData.autoRescheduleType = mapFrequencyToType(autoData.autoScheduleFrequency || "daily");
      transformedData.autoPostTime = convertTo12HourFormat(autoData.autoScheduleTime || "");
      transformedData.autoPostCount = parseInt(autoData.autoScheduleRecurrenceCount) || 1;
      
      if (autoData.autoScheduleFrequency === "weekly") {
        transformedData.autoWeekDay = dayIndexToName(autoData.autoScheduleDay || "0");
      }
      
      if (autoData.autoScheduleFrequency === "monthly") {
        transformedData.autoMonthDate = parseInt(autoData.autoScheduleDate) || 1;
      }
    }

    const response = await postsApi.createPost(transformedData);
    return response;
  }
);

// Async thunk for creating bulk posts
export const createBulkPost = createAsyncThunk(
  "posts/createBulkPost",
  async (postData: CreateBulkPostRequest) => {
    // Transform auto-scheduling fields if publishOption is "auto"
    const transformedData: CreateBulkPostRequest = {
      ...postData,
      publishOption: postData.publishOption === "auto" ? "recurrent" : postData.publishOption,
    };

    // Add auto-scheduling fields when recurrent
    if (postData.publishOption === "auto") {
      const autoData = postData as any;
      transformedData.autoRescheduleType = mapFrequencyToType(autoData.autoScheduleFrequency || "daily");
      transformedData.autoPostTime = convertTo12HourFormat(autoData.autoScheduleTime || "");
      transformedData.autoPostCount = parseInt(autoData.autoScheduleRecurrenceCount) || 1;
      
      if (autoData.autoScheduleFrequency === "weekly") {
        transformedData.autoWeekDay = dayIndexToName(autoData.autoScheduleDay || "0");
      }
      
      if (autoData.autoScheduleFrequency === "monthly") {
        transformedData.autoMonthDate = parseInt(autoData.autoScheduleDate) || 1;
      }
    }

    const response = await postsApi.createBulkPost(transformedData);
    return response;
  }
);

// Async thunk for deleting posts (handles both single and multi-delete)
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (deleteData: DeletePostRequest) => {
    const response = await postsApi.deletePost(deleteData);
    return { ...response, deletedPostIds: deleteData.postId };
  }
);

// Async thunk for fetching bulk posts overview
export const fetchBulkPostsOverview = createAsyncThunk(
  "posts/fetchBulkPostsOverview",
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number } = {}) => {
    const response = await postsApi.getBulkPostsOverview({ page, limit });
    return response;
  }
);

// Async thunk for deleting bulk post
export const deleteBulkPost = createAsyncThunk(
  "posts/deleteBulkPost",
  async (params: { bulkId: number }, { rejectWithValue }) => {
    try {
      const response = await postsApi.deleteBulkPost(params);
      return { ...response, bulkId: params.bulkId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete bulk post"
      );
    }
  }
);

// Fetch bulk post details
export const fetchBulkPostDetails = createAsyncThunk(
  "posts/fetchBulkPostDetails",
  async (
    request: {
      bulkId: string;
      search: string;
      status: string;
      page: number;
      limit: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await postsApi.getBulkPostDetails({
        bulkId: parseInt(request.bulkId),
        search: request.search,
        status: request.status,
        page: request.page,
        limit: request.limit,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bulk post details"
      );
    }
  }
);

// Delete post from bulk
export const deletePostFromBulk = createAsyncThunk(
  "posts/deletePostFromBulk",
  async (request: { postId: string }, { rejectWithValue }) => {
    try {
      const response = await postsApi.deletePostFromBulk(request);
      return { response, postId: request.postId };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete post"
      );
    }
  }
);

// Fetch bulk post summary
export const fetchBulkPostSummary = createAsyncThunk(
  "posts/fetchBulkPostSummary",
  async (request: GetBulkPostsSummaryRequest, { rejectWithValue }) => {
    try {
      const response = await postsApi.getBulkPostsSummary(request);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bulk post summary"
      );
    }
  }
);

// Fetch post details for editing
export const fetchPostDetails = createAsyncThunk(
  "posts/fetchPostDetails",
  async (postId: number, { rejectWithValue }) => {
    try {
      const response = await postsApi.getPostDetails({ postId });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch post details"
      );
    }
  }
);

// Edit post
export const editPost = createAsyncThunk(
  "posts/editPost",
  async (request: EditPostRequest, { rejectWithValue }) => {
    try {
      const response = await postsApi.editPost(request);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to edit post"
      );
    }
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    addPost: (state, action) => {
      state.posts.unshift(action.payload);
    },
    updatePost: (state, action) => {
      const index = state.posts.findIndex(
        (post) => post.id === action.payload.id
      );
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCreateError: (state) => {
      state.createError = null;
    },
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
    clearBulkPostsOverviewError: (state) => {
      state.bulkPostsOverviewError = null;
    },

    // Clear bulk post details error
    clearBulkPostDetailsError: (state) => {
      state.bulkPostDetailsError = null;
    },

    // Clear bulk post summary error
    clearBulkPostSummaryError: (state) => {
      state.bulkPostSummaryError = null;
    },
    
    // Clear edit error
    clearEditError: (state) => {
      state.editError = null;
    },

    // Clear post details
    clearPostDetails: (state) => {
      state.postDetails = null;
      state.postDetailsError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;

        state.posts = action.payload.data.posts.map(
          transformApiPostToFrontendPost
        );

        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch posts";
      })
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;

        // Increment total posts count
        state.pagination.totalPosts += 1;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.error.message || "Failed to create post";
      })
      .addCase(createBulkPost.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createBulkPost.fulfilled, (state, action) => {
        state.createLoading = false;

        // Increment total posts count
        state.pagination.totalPosts += 1;
      })
      .addCase(createBulkPost.rejected, (state, action) => {
        state.createLoading = false;
        state.createError =
          action.error.message || "Failed to create bulk post";
      })
      .addCase(deletePost.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleteLoading = false;

        // Remove deleted posts from state
        const deletedIds = action.payload.deletedPostIds.map((id) =>
          id.toString()
        );

        state.posts = state.posts.filter(
          (post) => !deletedIds.includes(post.id.toString())
        );

        // Update pagination totals
        state.pagination.totalPosts -= deletedIds.length;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.error.message || "Failed to delete posts";
      })
      .addCase(fetchBulkPostsOverview.pending, (state) => {
        state.bulkPostsOverviewLoading = true;
        state.bulkPostsOverviewError = null;
      })
      .addCase(fetchBulkPostsOverview.fulfilled, (state, action) => {
        state.bulkPostsOverviewLoading = false;
        state.bulkPostsOverview = action.payload.data.bulkPostOverviewDetails;

        // Map API pagination format to our internal format
        const apiPagination = action.payload.data.pagination;
        state.bulkPostsOverviewPagination = {
          currentPage: apiPagination.page,
          totalPages: apiPagination.pages,
          totalItems: apiPagination.total,
          hasNext: apiPagination.page < apiPagination.pages,
          hasPrevious: apiPagination.page > 1,
        };
      })
      .addCase(fetchBulkPostsOverview.rejected, (state, action) => {
        state.bulkPostsOverviewLoading = false;
        state.bulkPostsOverviewError =
          action.error.message || "Failed to fetch bulk posts overview";
      })

      .addCase(deleteBulkPost.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteBulkPost.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // Remove deleted bulk post from the overview array
        state.bulkPostsOverview = state.bulkPostsOverview.filter(
          (post) => Number(post.id) !== action.payload.bulkId
        );
      })
      .addCase(deleteBulkPost.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      })

      // Fetch bulk post details
      .addCase(fetchBulkPostDetails.pending, (state) => {
        state.bulkPostDetailsLoading = true;
        state.bulkPostDetailsError = null;
      })
      .addCase(fetchBulkPostDetails.fulfilled, (state, action) => {
        state.bulkPostDetailsLoading = false;
        state.bulkPostDetails = action.payload;
      })
      .addCase(fetchBulkPostDetails.rejected, (state, action) => {
        state.bulkPostDetailsLoading = false;
        state.bulkPostDetailsError = action.payload as string;
      })

      // Delete post from bulk
      .addCase(deletePostFromBulk.pending, (state) => {
        state.bulkPostDetailsLoading = true;
      })
      .addCase(deletePostFromBulk.fulfilled, (state, action) => {
        state.bulkPostDetailsLoading = false;
        // Remove the deleted post from the details
        if (state.bulkPostDetails) {
          state.bulkPostDetails.bulkPostDetails =
            state.bulkPostDetails.bulkPostDetails.filter(
              (post) => post.id !== action.payload.postId
            );
        }
      })
      .addCase(deletePostFromBulk.rejected, (state, action) => {
        state.bulkPostDetailsLoading = false;
        state.bulkPostDetailsError = action.payload as string;
      })

      // Fetch bulk post summary
      .addCase(fetchBulkPostSummary.pending, (state) => {
        state.bulkPostSummaryLoading = true;
        state.bulkPostSummaryError = null;
      })
      .addCase(fetchBulkPostSummary.fulfilled, (state, action) => {
        state.bulkPostSummaryLoading = false;
        state.bulkPostSummary = action.payload.postSummary;
      })
      .addCase(fetchBulkPostSummary.rejected, (state, action) => {
        state.bulkPostSummaryLoading = false;
        state.bulkPostSummaryError = action.payload as string;
      })

      // Fetch post details
      .addCase(fetchPostDetails.pending, (state) => {
        state.postDetailsLoading = true;
        state.postDetailsError = null;
      })
      .addCase(fetchPostDetails.fulfilled, (state, action) => {
        state.postDetailsLoading = false;
        state.postDetails = action.payload;
      })
      .addCase(fetchPostDetails.rejected, (state, action) => {
        state.postDetailsLoading = false;
        state.postDetailsError = action.payload as string;
      })

      // Edit post
      .addCase(editPost.pending, (state) => {
        state.editLoading = true;
        state.editError = null;
      })
      .addCase(editPost.fulfilled, (state) => {
        state.editLoading = false;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.editLoading = false;
        state.editError = action.payload as string;
      });
  },
});

export const {
  setFilter,
  setSearchQuery,
  addPost,
  updatePost,
  clearError,
  clearCreateError,
  clearDeleteError,
  clearBulkPostsOverviewError,
  clearBulkPostDetailsError,
  clearBulkPostSummaryError,
  clearEditError,
  clearPostDetails,
} = postsSlice.actions;
export default postsSlice.reducer;
