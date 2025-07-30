import { useState, useEffect, useCallback } from "react";
import { getGalleryImages, GalleryImageRequest, GalleryImageResponse } from "../api/mediaApi";
import { useToast } from "./use-toast";
import { useAuthRedux } from "@/store/slices/auth/useAuthRedux";
import { useParams } from "react-router-dom";

export interface UseGalleryImagesParams {
  type: "IMAGE" | "VIDEO" | "AI";
  searchTerm: string;
  sortOrder: "desc" | "asc";
  limit?: number;
}

export const useGalleryImages = ({ type, searchTerm, sortOrder, limit = 16 }: UseGalleryImagesParams) => {
  const [images, setImages] = useState<GalleryImageResponse["data"]["images"]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextToken, setNextToken] = useState<string | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const { toast } = useToast();
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

  const fetchImages = useCallback(async (isLoadMore = false) => {
    if (!accessToken || !listingId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params: GalleryImageRequest = {
        type,
        searchTerm: debouncedSearchTerm,
        limit,
        token: isLoadMore ? nextToken || "" : "",
        sortOrder,
      };

      const response = await getGalleryImages(params);

      if (response.code === 200) {
        if (isLoadMore) {
          setImages(prev => [...prev, ...response.data.images]);
        } else {
          setImages(response.data.images);
        }
        setNextToken(response.data.nextToken);
        setIsTruncated(response.data.isTruncated);
      } else {
        setError(response.message || "Failed to fetch images");
        toast({
          title: "Error",
          description: response.message || "Failed to fetch images",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to fetch images";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, listingId, type, debouncedSearchTerm, sortOrder, limit, nextToken, toast]);

  // Reset and fetch when params change
  useEffect(() => {
    setImages([]);
    setNextToken(null);
    setIsTruncated(false);
    fetchImages(false);
  }, [type, debouncedSearchTerm, sortOrder]);

  const loadMore = useCallback(() => {
    if (isTruncated && nextToken && !isLoading) {
      fetchImages(true);
    }
  }, [isTruncated, nextToken, isLoading, fetchImages]);

  const refetch = useCallback(() => {
    setImages([]);
    setNextToken(null);
    setIsTruncated(false);
    fetchImages(false);
  }, [fetchImages]);

  return {
    images,
    isLoading,
    error,
    hasMore: isTruncated && !!nextToken,
    loadMore,
    refetch,
  };
};