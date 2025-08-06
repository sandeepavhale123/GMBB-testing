import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostsOverview, clearBulkPostsOverviewError } from '@/store/slices/postsSlice';

export const useBulkPostsOverview = () => {
  const dispatch = useAppDispatch();
  const { 
    bulkPostsOverview, 
    bulkPostsOverviewLoading: loading, 
    bulkPostsOverviewError: error 
  } = useAppSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchBulkPostsOverview());
  }, [dispatch]);

  const refresh = () => {
    dispatch(fetchBulkPostsOverview());
  };

  const clearError = () => {
    dispatch(clearBulkPostsOverviewError());
  };

  return {
    bulkPosts: bulkPostsOverview,
    loading,
    error,
    refresh,
    clearError,
  };
};