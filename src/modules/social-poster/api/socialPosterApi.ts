import axiosInstance from '@/api/axiosInstance';
import {
  PlatformAccount,
  Post,
  DashboardStats,
  PlatformStats,
  GetPostsRequest,
  GetPostsResponse,
  CreatePostRequest,
  CreatePostResponse,
  ConnectAccountRequest,
  ConnectAccountResponse,
  UpdatePostRequest,
  RetryPostRequest,
  GetAccountsResponse,
  GetDashboardStatsResponse,
  DisconnectAccountResponse,
  GetAvailableAccountsResponse,
  UploadMediaResponse,
  RefreshTokenRequest,
  RefreshTokenSuccessResponse,
  GetPostingActivityResponse,
  GetPostActivityResponse,
} from '../types';

// Dashboard Stats
export const getDashboardStats = async (): Promise<GetDashboardStatsResponse> => {
  const response = await axiosInstance.get('/social-poster/dashboard-stats');
  return response.data;
};

export const getPostingActivityByPlatform = async (timeRange: string): Promise<GetPostingActivityResponse> => {
  const response = await axiosInstance.get('/social-poster/dashboard/posting-activity-by-platform', {
    params: { time_range: timeRange }
  });
  return response.data;
};

export const getPostActivity = async (timeRange: string): Promise<GetPostActivityResponse> => {
  const response = await axiosInstance.get('/social-poster/dashboard/post-activity', {
    params: { time_range: timeRange }
  });
  return response.data;
};

export const getPlatformStats = async (): Promise<PlatformStats[]> => {
  const response = await axiosInstance.get('/social-poster/platform-stats');
  return response.data.data;
};

export const getUpcomingPosts = async (limit: number = 10) => {
  const response = await axiosInstance.get('/social-poster/upcoming-posts', {
    params: { limit }
  });
  return response.data;
};

// Accounts
export const getConnectedAccounts = async (params?: { platform?: string; status?: string }): Promise<GetAccountsResponse> => {
  const response = await axiosInstance.get('/social-poster/accounts', { params });
  return response.data;
};

export const getAvailableAccounts = async (params?: { platform?: string; status?: string }): Promise<GetAvailableAccountsResponse> => {
  const response = await axiosInstance.get('/social-poster/accounts/available', { params });
  return response.data;
};

export const connectAccount = async (data: ConnectAccountRequest): Promise<ConnectAccountResponse> => {
  const response = await axiosInstance.post('/social-poster/accounts/connect', data);
  return response.data;
};

export const disconnectAccount = async (accountId: string): Promise<DisconnectAccountResponse> => {
  const response = await axiosInstance.delete(`/social-poster/accounts/${accountId}`);
  return response.data;
};

export const refreshAccountToken = async (data: RefreshTokenRequest): Promise<RefreshTokenSuccessResponse> => {
  const response = await axiosInstance.post('/social-poster/accounts/refresh-token', data);
  return response.data;
};

// Threads-specific token refresh
export const refreshThreadsToken = async (platformAccountId: number): Promise<any> => {
  const response = await axiosInstance.post('/social-poster/accounts/threads/refresh-token', {
    platform_account_id: platformAccountId
  });
  return response.data;
};

// Posts
export const getPosts = async (params: GetPostsRequest): Promise<GetPostsResponse> => {
  const response = await axiosInstance.get('/social-poster/posts', { params });
  return response.data;
};

export const getPost = async (postId: string) => {
  const response = await axiosInstance.get(`/social-poster/posts/${postId}`);
  return response.data;
};

export const createPost = async (data: CreatePostRequest): Promise<CreatePostResponse> => {
  const response = await axiosInstance.post('/social-poster/posts', data);
  return response.data;
};

export const updatePost = async (postId: string, data: UpdatePostRequest) => {
  const response = await axiosInstance.put(`/social-poster/posts/${postId}`, data);
  return response.data;
};

export const deletePost = async (postId: string): Promise<void> => {
  await axiosInstance.delete(`/social-poster/posts/${postId}`);
};

export const retryPost = async (data: RetryPostRequest): Promise<void> => {
  await axiosInstance.post(`/social-poster/posts/${data.postId}/retry`, data);
};

// Media Upload
export const uploadMedia = async (file: File): Promise<UploadMediaResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axiosInstance.post('/social-poster/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteMedia = async (mediaId: string): Promise<void> => {
  await axiosInstance.delete(`/social-poster/media/${mediaId}`);
};
