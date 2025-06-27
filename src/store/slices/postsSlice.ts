
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { postsApi, GetPostsRequest, ApiPost } from '../../api/postsApi';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'scheduled' | 'failed';
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
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  filter: 'all' | 'published' | 'draft' | 'scheduled' | 'failed';
  searchQuery: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  filter: 'all',
  searchQuery: '',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    hasNext: false,
    hasPrevious: false,
  },
};

// Helper function to map API status to frontend status
const mapApiStatusToFrontendStatus = (apiStatus: string): 'published' | 'draft' | 'scheduled' | 'failed' => {
  switch (apiStatus) {
    case 'LIVE':
      return 'published';
    case 'DRAFT':
      return 'draft';
    case 'SCHEDULED':
      return 'scheduled';
    case 'FAILED':
      return 'failed';
    default:
      return 'draft';
  }
};

// Helper function to map frontend filter to API filter
const mapFilterToApiStatus = (filter: string): string => {
  switch (filter) {
    case 'published':
      return 'LIVE';
    case 'draft':
      return 'DRAFT';
    case 'scheduled':
      return 'SCHEDULED';
    case 'failed':
      return 'FAILED';
    default:
      return 'all';
  }
};

// Helper function to transform API post to frontend post
const transformApiPostToFrontendPost = (apiPost: ApiPost): Post => ({
  id: apiPost.id,
  title: apiPost.title || 'Untitled Post',
  content: apiPost.content,
  status: mapApiStatusToFrontendStatus(apiPost.status),
  business: 'Business Name', // You might want to get this from context or API
  publishDate: apiPost.publishDate || new Date().toISOString().split('T')[0],
  engagement: {
    views: 0,
    clicks: 0,
    shares: 0,
  },
  searchUrl: apiPost.searchUrl,
  media: apiPost.media,
  tags: apiPost.tags,
});

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
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
        status: filters?.status || 'all',
        search: filters?.search || '',
        dateRange: {
          startDate: filters?.dateRange?.startDate || '',
          endDate: filters?.dateRange?.endDate || '',
        },
      },
      pagination: {
        page: pagination?.page || 1,
        limit: pagination?.limit || 10,
        total: 0,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
      sorting: {
        sortBy: sorting?.sortBy || 'postdate',
        sortOrder: sorting?.sortOrder || 'desc',
      },
    };

    const response = await postsApi.getPosts(request);
    return response;
  }
);

const postsSlice = createSlice({
  name: 'posts',
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
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
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
        state.posts = action.payload.data.posts.map(transformApiPostToFrontendPost);
        state.pagination = action.payload.data.pagination;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      });
  },
});

export const { setFilter, setSearchQuery, addPost, updatePost, clearError } = postsSlice.actions;
export default postsSlice.reducer;
