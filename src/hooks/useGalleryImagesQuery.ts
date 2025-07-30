import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getGalleryImages, GalleryImageRequest, GalleryImageResponse } from "../api/mediaApi";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useParams } from "react-router-dom";
import { galleryQueryKeys } from "./galleryQueryKeys";
import { useState, useEffect } from "react";

type GalleryData = GalleryImageResponse["data"];

export interface UseGalleryImagesParams {
  type: "IMAGE" | "VIDEO" | "AI";
  searchTerm: string;
  sortOrder: "desc" | "asc";
  limit?: number;
}

export const useGalleryImagesQuery = ({ type, searchTerm, sortOrder, limit = 16 }: UseGalleryImagesParams) => {
  const { accessToken } = useAuthRedux();
  const { listingId } = useParams();

  // Debounced search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const queryParams = { type, searchTerm: debouncedSearchTerm, sortOrder };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: galleryQueryKeys.infinite(queryParams),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!accessToken || !listingId) {
        throw new Error("Missing authentication or listing ID");
      }

      const params: GalleryImageRequest = {
        type,
        searchTerm: debouncedSearchTerm,
        limit,
        offset: pageParam,
        sortOrder,
      };

      const response = await getGalleryImages(params);

      if (response.code !== 200) {
        throw new Error(response.message || "Failed to fetch images");
      }

      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.isTruncated ? lastPage.nextOffset : undefined;
    },
    enabled: !!accessToken && !!listingId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime)
    refetchOnWindowFocus: true,
    retry: 3,
  });

  // Flatten all pages into a single array
  const images = data?.pages.flatMap(page => page.images) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  return {
    images,
    isLoading,
    error: isError ? error : null,
    hasMore: hasNextPage,
    total,
    loadMore: fetchNextPage,
    refetch,
    isFetchingNextPage,
  };
};