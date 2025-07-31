import { UseGalleryImagesParams } from "./useGalleryImages";

export const galleryQueryKeys = {
  all: ['galleryImages'] as const,
  lists: () => [...galleryQueryKeys.all, 'list'] as const,
  list: (params: Omit<UseGalleryImagesParams, 'limit'>) => 
    [...galleryQueryKeys.lists(), params] as const,
  infinite: (params: Omit<UseGalleryImagesParams, 'limit'>) => 
    [...galleryQueryKeys.all, 'infinite', params] as const,
};