import axiosInstance from "./axiosInstance";

export interface MediaUploadData {
  file?: File;
  title: string;
  category: string;
  publishOption: string;
  scheduleDate?: string;
  listingId: string;
  selectedImage: "local" | "ai" | "gallery";
  aiImageUrl?: string;
  galleryImageUrl?: string;
}

export interface MediaUploadResponse {
  code: number;
  message: string;
  data: any[];
}

export interface MediaListRequest {
  listingId: string;
  page: number;
  limit: number;
  search: string;
  category: string;
  status: string;
  type: string;
  sort_by: string;
  sort_order: string;
}

export interface MediaListItem {
  id: string;
  gloc_id: string;
  googleUrl: string;
  category: string;
  insights: number;
  publishDate: string;
  status: string;
  media_type: string;
}

export interface MediaListResponse {
  code: number;
  message: string;
  data: {
    total: number;
    media: MediaListItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

export interface MediaDeleteRequest {
  listingId: string;
  mediaId: string;
}

export interface MediaDeleteResponse {
  code: number;
  message: string;
  data: any[];
}

export interface AIImageGenerationRequest {
  prompt: string;
  variants: number;
  style: string;
}

export interface AIImageGenerationResponse {
  code: number;
  message: string;
  data: {
    results: Array<{
      url: string;
    }>;
  };
}

export interface MediaStatsRequest {
  listingId: string;
}

export interface MediaStatsResponse {
  code: number;
  message: string;
  data: {
    totalMediaUploaded: number;
    lastWeekUploadedImages: number;
    mediaDistribution: {
      images: {
        count: number;
      };
      videos: {
        count: number;
      };
    };
    lastUpdatedImage: {
      views: number;
      url: string;
      uploadDate: string;
      category: string;
      status: string;
    } | null;
  };
}

export const uploadMedia = async (
  data: MediaUploadData
): Promise<MediaUploadResponse> => {
  // console.log('uploadMedia called with:', {
  //   fileName: data.file?.name,
  //   fileSize: data.file?.size,
  //   fileType: data.file?.type,
  //   title: data.title,
  //   category: data.category,
  //   publishOption: data.publishOption,
  //   listingId: data.listingId,
  //   selectedImage: data.selectedImage,
  //   aiImageUrl: data.aiImageUrl
  // });

  const formData = new FormData();

  // Add the file only for local uploads
  if (data.selectedImage === "local" && data.file) {
    formData.append("userfile", data.file);
    formData.append(
      "type",
      data.file.type.startsWith("image/") ? "photo" : "video"
    );
  }

  // Add other form fields
  formData.append("title", data.title);
  formData.append("category", data.category.toUpperCase());
  formData.append("publish_option", data.publishOption);
  formData.append("listingId", data.listingId);
  formData.append("selectedImage", data.selectedImage);

  // Add AI image URL if it's an AI-generated image
  if (data.selectedImage === "ai" && data.aiImageUrl) {
    formData.append("aiImageUrl", data.aiImageUrl);
    formData.append("type", "photo");
  }

  // Add gallery image URL if it's a gallery image
  if (data.selectedImage === "gallery" && data.galleryImageUrl) {
    formData.append("galleryImageUrl", data.galleryImageUrl);
    formData.append("type", "photo");
  }

  // Add schedule date if provided (should already be in UTC format)
  if (data.scheduleDate && data.publishOption === "schedule") {
    formData.append("schedule_date", data.scheduleDate);
  }

  // Log FormData contents
  // console.log("FormData contents:");
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      // console.log(
      //   `${key}: File(${value.name}, ${value.size} bytes, ${value.type})`
      // );
    } else {
      // console.log(`${key}: ${value}`);
    }
  }

  try {
    const response = await axiosInstance.post<MediaUploadResponse>(
      "/upload-media",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // console.log("Upload API response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload API error:", error?.response?.data?.message);
    throw error;
  }
};

export const getMediaList = async (
  params: MediaListRequest
): Promise<MediaListResponse> => {
  const response = await axiosInstance.post<MediaListResponse>(
    "/get-media-list",
    params
  );
  return response.data;
};

export const deleteMedia = async (
  params: MediaDeleteRequest
): Promise<MediaDeleteResponse> => {
  const response = await axiosInstance.post<MediaDeleteResponse>(
    "/delete-media",
    {
      listingId: parseInt(params.listingId),
      mediaId: parseInt(params.mediaId),
    }
  );
  return response.data;
};

export const generateAIImage = async (
  data: AIImageGenerationRequest
): Promise<AIImageGenerationResponse> => {
  const response = await axiosInstance.post<AIImageGenerationResponse>(
    "/generate-ai-image",
    data
  );
  return response.data;
};

export const getMediaStats = async (
  params: MediaStatsRequest
): Promise<MediaStatsResponse> => {
  const response = await axiosInstance.post<MediaStatsResponse>(
    "/get-media-stats",
    {
      listingId: parseInt(params.listingId),
    }
  );
  return response.data;
};

// Gallery Images API interfaces
export interface GalleryImageRequest {
  type: "IMAGE" | "VIDEO" | "AI";
  searchTerm: string;
  limit: number;
  offset: number;
  sortOrder: "desc" | "asc";
}

export interface GalleryImageItem {
  key: string;
  url: string;
  date: string;
  timestamp: number;
}

export interface GalleryImageResponse {
  code: number;
  message: string;
  data: {
    images: GalleryImageItem[];
    total: number;
    isTruncated: boolean;
    nextOffset: number;
  };
}

// Gallery upload interfaces
export interface GalleryUploadRequest {
  userfile?: File;
  selectedImage: "local" | "ai";
  aiImageUrl?: string;
  mediaType: "photo" | "video";
}

export interface GalleryUploadResponse {
  code: number;
  message: string;
  data: {
    url: string;
  };
}

// Get gallery images
export const getGalleryImages = async (params: GalleryImageRequest): Promise<GalleryImageResponse> => {
  try {
    const response = await axiosInstance.post('/get-gallery-images', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    throw error;
  }
};

// Gallery delete interfaces
export interface GalleryDeleteRequest {
  key: string;
}

export interface GalleryDeleteResponse {
  code: number;
  message: string;
  data: any[];
}

// Upload media to gallery
export const uploadGalleryMedia = async (data: GalleryUploadRequest): Promise<GalleryUploadResponse> => {
  try {
    const formData = new FormData();
    
    if (data.selectedImage === "local" && data.userfile) {
      formData.append("userfile", data.userfile);
    }
    
    formData.append("selectedImage", data.selectedImage);
    formData.append("mediaType", data.mediaType);
    
    if (data.selectedImage === "ai" && data.aiImageUrl) {
      formData.append("aiImageUrl", data.aiImageUrl);
    }

    const response = await axiosInstance.post<GalleryUploadResponse>('/upload-ingallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error uploading to gallery:', error);
    throw error;
  }
};

// Delete media from gallery
export const deleteGalleryMedia = async (data: GalleryDeleteRequest): Promise<GalleryDeleteResponse> => {
  try {
    const response = await axiosInstance.post<GalleryDeleteResponse>('/delete-gallery-images', data);
    return response.data;
  } catch (error) {
    console.error('Error deleting gallery media:', error);
    throw error;
  }
};

// Bulk Media Overview interfaces
export interface BulkMediaOverviewRequest {
  page: number;
  limit: number;
}

export interface BulkMediaOverviewItem {
  id: string;
  url: string;
  postdate: string;
  posttime: string;
  category: string;
  status: string;
  lids: string;
  ids: string;
  location_count: number;
  livePosts: number;
  schedulePosts: number;
  failedPosts: number;
  publishDate: string;
  mediaType: string;
}

export interface BulkMediaOverviewResponse {
  code: number;
  message: string;
  data: {
    bulkMediaOverviewDetails: BulkMediaOverviewItem[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Get bulk media overview
export const getBulkMediaOverview = async (params: BulkMediaOverviewRequest): Promise<BulkMediaOverviewResponse> => {
  try {
    const response = await axiosInstance.post('/get-bulk-media-overview', params);
    return response.data;
  } catch (error) {
    console.error('Error fetching bulk media overview:', error);
    throw error;
  }
};

// Bulk Media Upload interfaces
export interface BulkMediaUploadData {
  file?: File;
  title: string;
  category: string;
  publishOption: string;
  scheduleDate?: string;
  listingId: string; // Comma-separated format: "label-1530,176820,177880"
  selectedImage: "local" | "ai" | "gallery";
  aiImageUrl?: string;
  galleryImageUrl?: string;
}

export interface BulkMediaUploadResponse {
  code: number;
  message: string;
  data: any[];
}

// Bulk Media Delete interfaces
export interface BulkMediaDeleteRequest {
  bulkId: number;
}

export interface BulkMediaDeleteResponse {
  code: number;
  message: string;
  data: [];
}

// Create bulk media
export const createBulkMedia = async (
  data: BulkMediaUploadData
): Promise<BulkMediaUploadResponse> => {
  const formData = new FormData();

  // Add the file only for local uploads
  if (data.selectedImage === "local" && data.file) {
    formData.append("userfile", data.file);
    formData.append(
      "type",
      data.file.type.startsWith("image/") ? "photo" : "video"
    );
  }

  // Add other form fields
  formData.append("title", data.title);
  formData.append("category", data.category.toUpperCase());
  formData.append("publish_option", data.publishOption);
  formData.append("listingId", data.listingId); // Already comma-separated string
  formData.append("selectedImage", data.selectedImage);

  // Add AI image URL if it's an AI-generated image
  if (data.selectedImage === "ai" && data.aiImageUrl) {
    formData.append("aiImageUrl", data.aiImageUrl);
    formData.append("type", "photo");
  }

  // Add gallery image URL if it's a gallery image
  if (data.selectedImage === "gallery" && data.galleryImageUrl) {
    formData.append("galleryImageUrl", data.galleryImageUrl);
    formData.append("type", "photo");
  }

  // Add schedule date if provided (should already be in UTC format)
  if (data.scheduleDate && data.publishOption === "schedule") {
    formData.append("schedule_date", data.scheduleDate);
  }

  try {
    const response = await axiosInstance.post<BulkMediaUploadResponse>(
      "/create-bulk-media",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Bulk media upload API error:", error?.response?.data?.message);
    throw error;
  }
};

// Delete bulk media
export const deleteBulkMedia = async (data: BulkMediaDeleteRequest): Promise<BulkMediaDeleteResponse> => {
  try {
    const response = await axiosInstance.post<BulkMediaDeleteResponse>('/delete-bulk-overview-media', data);
    return response.data;
  } catch (error) {
    console.error('Error deleting bulk media:', error);
    throw error;
  }
};

// Bulk Media Details interfaces
export interface BulkMediaDetailsRequest {
  bulkId: string;
  page: number;
  limit: number;
}

export interface BulkMediaDetailsResponse {
  code: number;
  message: string;
  data: {
    mediaSummary: Array<{
      id: string;
      title?: string;
      description?: string;
      category?: string;
      mediaType?: string;
      image?: string;
      video?: string;
      publishDate?: string;
      tags?: string[];
      status?: string;
    }>;
    bulkMediaDetails: Array<{
      id: string;
      locationName: string;
      zipCode: string;
      state: string;
      search_url?: string;
    }>;
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
}

// Delete media from bulk operation
export interface DeleteMediaFromBulkRequest {
  mediaId: string;
}

export interface DeleteMediaFromBulkResponse {
  code: number;
  message: string;
  data: any[];
}

// Get bulk media details function
export const getBulkMediaDetails = async (params: BulkMediaDetailsRequest): Promise<BulkMediaDetailsResponse> => {
  const response = await fetch('/api/get-bulk-media-details', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Delete media from bulk operation
export const deleteMediaFromBulk = async (params: DeleteMediaFromBulkRequest): Promise<DeleteMediaFromBulkResponse> => {
  const response = await fetch('/api/delete-media-from-bulk', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
