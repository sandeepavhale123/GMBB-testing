import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  postsApi,
  GetPostsRequest,
  ApiPost,
  CreatePostRequest,
  DeletePostRequest,
  CreateBulkPostRequest,
  BulkPostOverviewItem,
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
    const response = await postsApi.createPost(postData);
    return response;
  }
);

// Async thunk for creating bulk posts
export const createBulkPost = createAsyncThunk(
  "posts/createBulkPost",
  async (postData: CreateBulkPostRequest) => {
    const response = await postsApi.createBulkPost(postData);
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

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFilter: (state, action) => {
      // console.log("Setting filter to:", action.payload);
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        // console.log("Raw API response:", action.payload);
        state.posts = action.payload.data.posts.map(
          transformApiPostToFrontendPost
        );
        // console.log("Transformed posts:", state.posts);
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
        // console.log("Post created successfully:", action.payload);
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
        // console.log("Bulk post created successfully:", action.payload);
        // Increment total posts count
        state.pagination.totalPosts += 1;
      })
      .addCase(createBulkPost.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.error.message || "Failed to create bulk post";
      })
      .addCase(deletePost.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.deleteLoading = false;
        // console.log("Posts deleted successfully:", action.payload);
        // Remove deleted posts from state
        const deletedIds = action.payload.deletedPostIds.map((id) =>
          id.toString()
        );
        state.posts = state.posts.filter(
          (post) => !deletedIds.includes(post.id)
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
        state.bulkPostsOverviewError = action.error.message || "Failed to fetch bulk posts overview";
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
} = postsSlice.actions;
export default postsSlice.reducer;
