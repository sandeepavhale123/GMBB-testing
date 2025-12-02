import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from '../api/socialPosterApi';
import type { CreatePostRequest, UpdatePostRequest, GetPostsRequest, ConnectAccountRequest, RetryPostRequest } from '../types';
// Import mock data for temporary use
import { 
  mockDashboardStats, 
  mockPlatformStats, 
  mockPlatformAccounts, 
  mockPosts 
} from '../data/mockData';

// Query Keys
export const socialPosterKeys = {
  all: ['social-poster'] as const,
  dashboardStats: () => [...socialPosterKeys.all, 'dashboard-stats'] as const,
  platformStats: () => [...socialPosterKeys.all, 'platform-stats'] as const,
  accounts: () => [...socialPosterKeys.all, 'accounts'] as const,
  availableAccounts: (filters?: { platform?: string; status?: string }) => [...socialPosterKeys.all, 'available-accounts', filters] as const,
  posts: (filters?: GetPostsRequest) => [...socialPosterKeys.all, 'posts', filters] as const,
  post: (id: string) => [...socialPosterKeys.all, 'posts', id] as const,
};

// Dashboard Stats Hook
export const useDashboardStats = () => {
  return useQuery({
    queryKey: socialPosterKeys.dashboardStats(),
    queryFn: () => api.getDashboardStats(),
  });
};

// Platform Stats Hook
export const usePlatformStats = () => {
  return useQuery({
    queryKey: socialPosterKeys.platformStats(),
    queryFn: () => api.getPlatformStats(),
  });
};

// Upcoming Posts Hook
export const useUpcomingPosts = (limit: number = 10) => {
  return useQuery({
    queryKey: [...socialPosterKeys.all, 'upcoming-posts', limit] as const,
    queryFn: () => api.getUpcomingPosts(limit),
  });
};

// Accounts Hooks
export const useConnectedAccounts = (filters?: { platform?: string; status?: string }) => {
  return useQuery({
    queryKey: [...socialPosterKeys.accounts(), filters],
    queryFn: () => api.getConnectedAccounts(filters),
  });
};

export const useAvailableAccounts = (filters?: { platform?: string; status?: string }) => {
  return useQuery({
    queryKey: socialPosterKeys.availableAccounts(filters),
    queryFn: () => api.getAvailableAccounts(filters),
  });
};

export const useConnectAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ConnectAccountRequest) => {
      // TODO: Replace with real API call when endpoint is ready
      // return api.connectAccount(data);
      return Promise.resolve({
        code: 200,
        message: 'Account connected successfully',
        account: {} as any
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.accounts() });
      toast.success('Account connected successfully');
    },
    onError: () => {
      toast.error('Failed to connect account');
    },
  });
};

export const useDisconnectAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (accountId: string) => api.disconnectAccount(accountId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.accounts() });
      const subAccountsText = data.data.deletedSubAccounts > 0 
        ? ` (${data.data.deletedSubAccounts} sub-account${data.data.deletedSubAccounts > 1 ? 's' : ''} removed)`
        : '';
      toast.success(`${data.data.platform.charAt(0).toUpperCase() + data.data.platform.slice(1)} account disconnected successfully${subAccountsText}`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to disconnect account');
    },
  });
};

export const useRefreshAccountToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { platform_account_id: number; frontend_origin: string }) => api.refreshAccountToken(data),
    onSuccess: (response) => {
      if (response.data.requires_reauthorization) {
        toast.error(response.message);
        if (response.data.reauthorization_url) {
          window.location.href = response.data.reauthorization_url;
        }
      } else {
        queryClient.invalidateQueries({ queryKey: socialPosterKeys.accounts() });
        toast.success(response.message);
      }
    },
    onError: () => {
      toast.error('Failed to refresh token');
    },
  });
};

// Posts Hooks
export const usePosts = (filters?: GetPostsRequest) => {
  return useQuery({
    queryKey: socialPosterKeys.posts(filters),
    queryFn: () => api.getPosts(filters || {}),
  });
};

export const usePost = (postId: string) => {
  return useQuery({
    queryKey: socialPosterKeys.post(postId),
    queryFn: () => api.getPost(postId),
    enabled: !!postId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostRequest) => api.createPost(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['social-poster', 'posts'] });
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.dashboardStats() });
      toast.success(response.message || 'Post created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create post');
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, data }: { postId: string; data: UpdatePostRequest }) => api.updatePost(postId, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.posts() });
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.post(variables.postId) });
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.dashboardStats() });
      toast.success(response.message || 'Post updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update post');
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => api.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social-poster', 'posts'] });
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.dashboardStats() });
      toast.success('Post deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete post');
    },
  });
};

export const useRetryPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RetryPostRequest) => {
      // TODO: Replace with real API call when endpoint is ready
      // return api.retryPost(data);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: socialPosterKeys.posts() });
      toast.success('Post retry initiated');
    },
    onError: () => {
      toast.error('Failed to retry post');
    },
  });
};

// Media Upload Hook
export const useUploadMedia = () => {
  return useMutation({
    mutationFn: (file: File) => api.uploadMedia(file),
  });
};

export const useDeleteMedia = () => {
  return useMutation({
    mutationFn: (mediaId: string) => api.deleteMedia(mediaId),
    onError: () => {
      toast.error('Failed to delete media');
    },
  });
};
