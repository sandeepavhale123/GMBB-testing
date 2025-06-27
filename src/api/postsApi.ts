
import axiosInstance from './axiosInstance';

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

export interface ApiPost {
  id: string;
  title: string;
  content: string;
  status: 'LIVE' | 'DRAFT' | 'SCHEDULED' | 'FAILED';
  listingId: string;
  searchUrl: string;
  publishDate: string | null;
  media: {
    images: string;
  };
  tags: string;
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

export const postsApi = {
  getPosts: async (request: GetPostsRequest): Promise<GetPostsResponse> => {
    const response = await axiosInstance.post('/get-posts', request);
    return response.data;
  }
};
