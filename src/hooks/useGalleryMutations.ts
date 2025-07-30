import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadGalleryMedia, deleteGalleryMedia, GalleryUploadRequest, GalleryDeleteRequest } from "../api/mediaApi";
import { useToast } from "./use-toast";
import { galleryQueryKeys } from "./galleryQueryKeys";

export const useUploadGalleryMediaMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GalleryUploadRequest) => uploadGalleryMedia(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        // Invalidate all gallery queries to refetch with new data
        queryClient.invalidateQueries({
          queryKey: galleryQueryKeys.all,
        });
        
        toast({
          title: "Success",
          description: "Media uploaded successfully",
        });
      } else {
        throw new Error(response.message || "Failed to upload media");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload media",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGalleryMediaMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GalleryDeleteRequest) => deleteGalleryMedia(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        // Invalidate all gallery queries to refetch with updated data
        queryClient.invalidateQueries({
          queryKey: galleryQueryKeys.all,
        });
        
        toast({
          title: "Success",
          description: "Media deleted successfully",
        });
      } else {
        throw new Error(response.message || "Failed to delete media");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete media",
        variant: "destructive",
      });
    },
  });
};

export const useSaveAIImageMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: GalleryUploadRequest) => uploadGalleryMedia(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        // Invalidate all gallery queries to refetch with new data
        queryClient.invalidateQueries({
          queryKey: galleryQueryKeys.all,
        });
        
        toast({
          title: "Success",
          description: "AI image saved successfully",
        });
      } else {
        throw new Error(response.message || "Failed to save AI image");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save AI image",
        variant: "destructive",
      });
    },
  });
};