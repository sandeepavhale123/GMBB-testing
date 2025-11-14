import axiosInstance from "./axiosInstance";

// New interfaces for bulk media summary
export interface GetBulkMediaSummaryRequest {
  bulkId: number;
}

export interface BulkMediaSummaryItem {
  bulkId: string;
  tags: string;
  image: string;
  category: string;
  mediaType: string;
  publishDate: string;
}

export interface GetBulkMediaSummaryResponse {
  code: number;
  message: string;
  data: {
    MediaSummary: BulkMediaSummaryItem[];
  };
}

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
  galleryMediaType?: "photo" | "video";
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
  reason?: string;
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
    formData.append("type", data.galleryMediaType || "photo");
  }

  // Add schedule date if provided (should already be in UTC format)
  if (data.scheduleDate && data.publishOption === "schedule") {
    formData.append("schedule_date", data.scheduleDate);
  }

  // Log FormData contents
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      // a
    } else {
      //a
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

    return response.data;
  } catch (error) {
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
export const getGalleryImages = async (
  params: GalleryImageRequest
): Promise<GalleryImageResponse> => {
  try {
    const response = await axiosInstance.post("/get-gallery-images", params);
    return response.data;
  } catch (error) {
    // console.error('Error fetching gallery images:', error);
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
export const uploadGalleryMedia = async (
  data: GalleryUploadRequest
): Promise<GalleryUploadResponse> => {
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

    const response = await axiosInstance.post<GalleryUploadResponse>(
      "/upload-ingallery",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    // console.error('Error uploading to gallery:', error);
    throw error;
  }
};

// Delete media from gallery
export const deleteGalleryMedia = async (
  data: GalleryDeleteRequest
): Promise<GalleryDeleteResponse> => {
  try {
    const response = await axiosInstance.post<GalleryDeleteResponse>(
      "/delete-gallery-images",
      data
    );
    return response.data;
  } catch (error) {
    // console.error('Error deleting gallery media:', error);
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
export const getBulkMediaOverview = async (
  params: BulkMediaOverviewRequest
): Promise<BulkMediaOverviewResponse> => {
  try {
    const response = await axiosInstance.post(
      "/get-bulk-media-overview",
      params
    );
    return response.data;
  } catch (error) {
    // console.error('Error fetching bulk media overview:', error);
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
  galleryMediaType?: "photo" | "video";
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
    formData.append("type", data.galleryMediaType || "photo");
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
    // console.error("Bulk media upload API error:", error?.response?.data?.message);
    throw error;
  }
};

// Delete bulk media
export const deleteBulkMedia = async (
  data: BulkMediaDeleteRequest
): Promise<BulkMediaDeleteResponse> => {
  try {
    const response = await axiosInstance.post<BulkMediaDeleteResponse>(
      "/delete-bulk-overview-media",
      data
    );
    return response.data;
  } catch (error) {
    // console.error('Error deleting bulk media:', error);
    throw error;
  }
};

// Bulk Media Details interfaces
export interface BulkMediaDetailsRequest {
  bulkId: number;
  search: string;
  status: string;
  page: number;
  limit: number;
}

export interface BulkMediaDetailsResponse {
  code: number;
  message: string;
  data: {
    MediaSummary: Array<{
      bulkId: string;
      tags: string;
      image: string;
      category: string;
      mediaType: string;
      publishDate: string;
    }>;
    bulkMediaDetails: Array<{
      id: string;
      state: string;
      image: string;
      locationName: string;
      zipCode: string;
      reason?: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

// Delete media from bulk operation
export interface DeleteMediaFromBulkRequest {
  mediaId: number[];
}

export interface DeleteMediaFromBulkResponse {
  code: number;
  message: string;
  data: any[];
}

// Get bulk media details function
export const getBulkMediaDetails = async (
  params: BulkMediaDetailsRequest
): Promise<BulkMediaDetailsResponse> => {
  const response = await axiosInstance.post("/get-bulk-media-details", params);
  return response.data;
};

// Delete media from bulk operation
export const deleteMediaFromBulk = async (
  params: DeleteMediaFromBulkRequest
): Promise<DeleteMediaFromBulkResponse> => {
  const response = await axiosInstance.post("/delete-bulk-media", params);
  return response.data;
};

// Get bulk media summary
export const getBulkMediaSummary = async (
  params: GetBulkMediaSummaryRequest
): Promise<GetBulkMediaSummaryResponse> => {
  const response = await axiosInstance.post("/get-bulk-media-summary", params);
  return response.data;
};

// EXIF Template API interfaces
export interface ExifTemplateListRequest {
  search: string;
  page: number;
  limit: number;
}

export interface ExifTemplate {
  id: string;
  template_name: string;
}

export interface ExifTemplateListResponse {
  code: number;
  message: string;
  data: {
    templates: ExifTemplate[];
    pagination: {
      total_template: number;
      page: number;
      limit: number;
      total_pages: number;
    };
  };
}

export interface ExifTemplateDetailsRequest {
  templateId: number;
}

export interface ExifTemplateDetails {
  id: string;
  user_id: string;
  imgname: string;
  imgtitle: string;
  imgsub: string;
  imgkey: string;
  imgcopy: string;
  imgauthor: string;
  imgcomment: string;
  imgdesc: string;
  imglat: string;
  imglong: string;
  imgmaker: string | null;
  imgsoftware: string | null;
  imgmodel: string | null;
  status: string;
  tempname: string;
}

export interface ExifTemplateDetailsResponse {
  code: number;
  message: string;
  data: {
    template: ExifTemplateDetails;
  };
}

export interface UpdateImgexifRequest {
  ImageUrl: string[];
  imgname: string;
  imgtitle: string;
  imgsub: string;
  imgkey: string;
  imgcopy: string;
  imgauthor: string;
  imgcomment: string;
  imgdesc: string;
  imglat: string;
  imglong: string;
  imgmaker: string;
  imgsoftware: string;
  imgmodel: string;
  saveAs: number;
  tempname: string;
}

export interface UpdateImgexifResponse {
  code: number;
  message: string;
  data: {
    updatedImageUrl: string;
    templateSaved: number;
  };
}

// Get EXIF template list
export const getExifTemplateList = async (
  params: ExifTemplateListRequest
): Promise<ExifTemplateListResponse> => {
  const response = await axiosInstance.post("/get-exif-template", params);
  return response.data;
};

// Get EXIF template details
export const getExifTemplateDetails = async (
  params: ExifTemplateDetailsRequest
): Promise<ExifTemplateDetailsResponse> => {
  const response = await axiosInstance.post(
    "/get-exif-template-details",
    params
  );
  return response.data;
};

// Update image EXIF details
export const updateImgexifDetails = async (
  data: UpdateImgexifRequest
): Promise<UpdateImgexifResponse> => {
  const response = await axiosInstance.post("/update-imgexif-details", data);
  return response.data;
};

// Delete EXIF Template
export interface DeleteExifTemplateRequest {
  templateId: number;
  confirm: string;
}

export interface DeleteExifTemplateResponse {
  code: number;
  message: string;
  data: {
    deletedId: number;
  };
}

export const deleteExifTemplate = async (
  data: DeleteExifTemplateRequest
): Promise<DeleteExifTemplateResponse> => {
  const response = await axiosInstance.post("/delete-exif-template", data);
  return response.data;
};
