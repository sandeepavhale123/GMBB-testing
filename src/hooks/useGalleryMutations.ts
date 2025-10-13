import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  uploadGalleryMedia,
  deleteGalleryMedia,
  GalleryUploadRequest,
  GalleryDeleteRequest,
} from "../api/mediaApi";
import { useToast } from "./use-toast";
import { galleryQueryKeys } from "./galleryQueryKeys";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const useUploadGalleryMediaMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useI18nNamespace("hooks/useGalleryMutations");
  return useMutation({
    mutationFn: (data: GalleryUploadRequest) => uploadGalleryMedia(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        // Invalidate all gallery queries to refetch with new data
        queryClient.invalidateQueries({
          queryKey: galleryQueryKeys.all,
        });

        toast({
          title: t("toast.success"),
          description: t("toast.upload.success"),
        });
      } else {
        throw new Error(response.message || t("toast.upload.failed"));
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("toast.error"),
        description: error.message || t("toast.upload.failed"),
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGalleryMediaMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useI18nNamespace("hooks/useGalleryMutations");
  return useMutation({
    mutationFn: (data: GalleryDeleteRequest) => deleteGalleryMedia(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        // Invalidate all gallery queries to refetch with updated data
        queryClient.invalidateQueries({
          queryKey: galleryQueryKeys.all,
        });

        toast({
          title: t("toast.success"),
          description: t("toast.delete.success"),
        });
      } else {
        throw new Error(response.message || t("toast.delete.failed"));
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("toast.error"),
        description: error.message || t("toast.delete.failed"),
        variant: "destructive",
      });
    },
  });
};

export const useSaveAIImageMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { t } = useI18nNamespace("hooks/useGalleryMutations");
  return useMutation({
    mutationFn: (data: GalleryUploadRequest) => uploadGalleryMedia(data),
    onSuccess: (response) => {
      if (response.code === 200) {
        // Invalidate all gallery queries to refetch with new data
        queryClient.invalidateQueries({
          queryKey: galleryQueryKeys.all,
        });

        toast({
          title: t("toast.success"),
          description: t("toast.saveAI.success"),
        });
      } else {
        throw new Error(response.message || t("toast.saveAI.failed"));
      }
    },
    onError: (error: Error) => {
      toast({
        title: t("toast.error"),
        description: error.message || t("toast.saveAI.failed"),
        variant: "destructive",
      });
    },
  });
};
