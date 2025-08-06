import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { fetchBulkPostDetails, deletePostFromBulk } from '@/store/slices/postsSlice';

export const useBulkPostDetails = (bulkId: string) => {
  const dispatch = useAppDispatch();
  
  const { 
    bulkPostDetails, 
    bulkPostDetailsLoading: loading, 
    bulkPostDetailsError: error
  } = useAppSelector((state) => state.posts);

  const fetchData = useCallback(() => {
    if (bulkId) {
      // For now, we'll create mock data since the API endpoint might not be ready
      // dispatch(fetchBulkPostDetails({ bulkId }));
      
      // Mock implementation for testing
      const mockBulkPost = {
        bulkPost: {
          id: bulkId,
          title: "Sample Bulk Post Title",
          content: "This is a sample bulk post content for testing the details view.",
          status: "published",
          publishDate: new Date().toISOString(),
          tags: "sample, test, bulk",
          media: {
            images: "https://via.placeholder.com/400x300"
          }
        },
        posts: [
          {
            id: "1",
            listingName: "Business Location 1",
            business: "Business Location 1",
            category: "Restaurant",
            publishDate: new Date().toISOString(),
            status: "published",
            zipcode: "12345",
            searchUrl: "https://example.com/post1"
          },
          {
            id: "2", 
            listingName: "Business Location 2",
            business: "Business Location 2",
            category: "Retail",
            publishDate: new Date().toISOString(),
            status: "draft",
            zipcode: "67890",
            searchUrl: "https://example.com/post2"
          },
          {
            id: "3",
            listingName: "Business Location 3", 
            business: "Business Location 3",
            category: "Service",
            publishDate: new Date().toISOString(),
            status: "scheduled",
            zipcode: "54321",
            searchUrl: "https://example.com/post3"
          }
        ]
      };
      
      // Mock the dispatch call
      setTimeout(() => {
        // This would normally be handled by Redux
      }, 100);
    }
  }, [dispatch, bulkId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const deletePost = useCallback(async (postId: string) => {
    // Mock delete - just show success
    return { type: 'fulfilled', payload: { postId } };
  }, [dispatch]);

  // Mock data for development
  const mockData = bulkId ? {
    bulkPost: {
      id: bulkId,
      title: "Sample Bulk Post Title",
      content: "This is a sample bulk post content for testing the details view. It includes all the necessary information to demonstrate how the bulk post details page will look and function.",
      status: "published",
      publishDate: new Date().toISOString(),
      tags: "sample, test, bulk, development",
      media: {
        images: "https://via.placeholder.com/400x300?text=Sample+Post+Image"
      }
    },
    posts: [
      {
        id: "1",
        listingName: "Downtown Restaurant",
        business: "Downtown Restaurant",
        category: "Restaurant",
        publishDate: new Date().toISOString(),
        status: "published",
        zipcode: "12345",
        storeCode: "DT001",
        searchUrl: "https://example.com/post1"
      },
      {
        id: "2", 
        listingName: "City Retail Store",
        business: "City Retail Store",
        category: "Retail",
        publishDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: "draft",
        zipcode: "67890",
        storeCode: "CR002",
        searchUrl: "https://example.com/post2"
      },
      {
        id: "3",
        listingName: "Professional Services LLC", 
        business: "Professional Services LLC",
        category: "Service",
        publishDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        status: "scheduled",
        zipcode: "54321",
        storeCode: "PS003",
        searchUrl: "https://example.com/post3"
      },
      {
        id: "4",
        listingName: "Coffee Shop Downtown", 
        business: "Coffee Shop Downtown",
        category: "Food & Beverage",
        publishDate: new Date().toISOString(),
        status: "failed",
        zipcode: "11111",
        storeCode: "CS004",
        searchUrl: "https://example.com/post4"
      }
    ]
  } : null;

  return {
    bulkPost: mockData?.bulkPost || bulkPostDetails?.bulkPost,
    posts: mockData?.posts || bulkPostDetails?.posts || [],
    loading: false, // Set to false for mock data
    error: null,
    refresh,
    deletePost,
  };
};