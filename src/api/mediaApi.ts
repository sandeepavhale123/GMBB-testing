import axiosInstance from "./axiosInstance";

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent: string;
  order: number;
  count: number;
}

export interface CategoryResponse {
  code: number;
  message: string;
  data: Category[];
}

export const getCategories = async (): Promise<CategoryResponse> => {
  const response = await axiosInstance.get("/categories");
  return response.data;
};

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
    images: string[];
  };
}

export interface MediaStatsRequest {
  listingId: string;
  period: string;
}

export interface MediaStats {
  totalMedia: number;
  totalViews: number;
  totalClicks: number;
  averageViewsPerPost: number;
}

export interface MediaStatsResponse {
  code: number;
  message: string;
  data: MediaStats;
}

export interface GalleryImageRequest {
  page: number;
  limit: number;
  search: string;
  category: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
  mediaType: "photo" | "video";
}

export interface GalleryImageResponse {
  code: number;
  message: string;
  data: {
    images: GalleryImage[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface GalleryUploadRequest {
  file: File;
  title: string;
  category: string;
}

export interface GalleryUploadResponse {
  code: number;
  message: string;
  data: {
    imageUrl: string;
    imageId: string;
  };
}

export interface GalleryDeleteRequest {
  imageId: string;
}

export interface GalleryDeleteResponse {
  code: number;
  message: string;
  data: any[];
}

export interface BulkMediaOverviewRequest {
  page: number;
  limit: number;
  search: string;
}

export interface BulkMediaOverviewItem {
  bulkId: string;
  thumbnail: string;
  title: string;
  totalMedia: number;
  publishDate: string;
  status: string;
}

export interface BulkMediaOverviewResponse {
  code: number;
  message: string;
  data: {
    bulkMedia: BulkMediaOverviewItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface BulkMediaUploadData {
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

export interface BulkMediaUploadResponse {
  code: number;
  message: string;
  data: {
    bulkId: string;
    successfulUploads: number;
    failedUploads: number;
  };
}

export interface BulkMediaDeleteRequest {
  bulkId: string;
}

export interface BulkMediaDeleteResponse {
  code: number;
  message: string;
  data: any[];
}

export interface BulkMediaDetailsRequest {
  bulkId: string;
  page: number;
  limit: number;
}

export interface BulkMediaDetailsItem {
  mediaId: string;
  listingName: string;
  googleUrl: string;
  status: string;
  publishDate: string;
}

export interface BulkMediaDetailsResponse {
  code: number;
  message: string;
  data: {
    bulkId: string;
    title: string;
    media: BulkMediaDetailsItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface DeleteMediaFromBulkRequest {
  bulkId: string;
  mediaId: string;
}

export interface DeleteMediaFromBulkResponse {
  code: number;
  message: string;
  data: any[];
}

export const uploadMedia = async (data: MediaUploadData): Promise<MediaUploadResponse> => {
  const formData = new FormData();
  if (data.file) {
    formData.append("photo", data.file);
  }
  formData.append("photo_title", data.title);
  formData.append("category", data.category);
  formData.append("publish_option", data.publishOption);
  if (data.scheduleDate) {
    formData.append("schedule_date", data.scheduleDate);
  }
  formData.append("google_location_id", data.listingId);
  formData.append("selectedImage", data.selectedImage);
  if (data.aiImageUrl) {
    formData.append("aiImageUrl", data.aiImageUrl);
  }
  if (data.galleryImageUrl) {
    formData.append("galleryImageUrl", data.galleryImageUrl);
  }
  if (data.galleryMediaType) {
    formData.append("galleryMediaType", data.galleryMediaType);
  }
  const response = await axiosInstance.post("/upload-google-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const getMediaList = async (params: MediaListRequest): Promise<MediaListResponse> => {
  const response = await axiosInstance.post("/get-google-post", params);
  return response.data;
};

export const deleteMedia = async (params: MediaDeleteRequest): Promise<MediaDeleteResponse> => {
  const response = await axiosInstance.post("/delete-google-post", params);
  return response.data;
};

export const generateAIImage = async (data: AIImageGenerationRequest): Promise<AIImageGenerationResponse> => {
  const response = await axiosInstance.post("/generate-ai-images", data);
  return response.data;
};

export const getMediaStats = async (params: MediaStatsRequest): Promise<MediaStatsResponse> => {
  const response = await axiosInstance.post("/get-media-stats", params);
  return response.data;
};

export const getGalleryImages = async (params: GalleryImageRequest): Promise<GalleryImageResponse> => {
  const response = await axiosInstance.post("/get-gallery-images", params);
  return response.data;
};

export const uploadGalleryMedia = async (data: GalleryUploadRequest): Promise<GalleryUploadResponse> => {
  const formData = new FormData();
  formData.append("file", data.file);
  formData.append("title", data.title);
  formData.append("category", data.category);
  const response = await axiosInstance.post("/upload-gallery-media", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const deleteGalleryMedia = async (data: GalleryDeleteRequest): Promise<GalleryDeleteResponse> => {
  const response = await axiosInstance.post("/delete-gallery-media", data);
  return response.data;
};

export const getBulkMediaOverview = async (params: BulkMediaOverviewRequest): Promise<BulkMediaOverviewResponse> => {
  const response = await axiosInstance.post("/get-bulk-media-overview", params);
  return response.data;
};

export const createBulkMedia = async (data: BulkMediaUploadData): Promise<BulkMediaUploadResponse> => {
  const formData = new FormData();
  if (data.file) {
    formData.append("photo", data.file);
  }
  formData.append("photo_title", data.title);
  formData.append("category", data.category);
  formData.append("publish_option", data.publishOption);
  if (data.scheduleDate) {
    formData.append("schedule_date", data.scheduleDate);
  }
  formData.append("google_location_id", data.listingId);
  formData.append("selectedImage", data.selectedImage);
  if (data.aiImageUrl) {
    formData.append("aiImageUrl", data.aiImageUrl);
  }
  if (data.galleryImageUrl) {
    formData.append("galleryImageUrl", data.galleryImageUrl);
  }
  if (data.galleryMediaType) {
    formData.append("galleryMediaType", data.galleryMediaType);
  }
  const response = await axiosInstance.post("/create-bulk-google-post", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};

export const deleteBulkMedia = async (data: BulkMediaDeleteRequest): Promise<BulkMediaDeleteResponse> => {
  const response = await axiosInstance.post("/delete-bulk-media", data);
  return response.data;
};

export const getBulkMediaDetails = async (params: BulkMediaDetailsRequest): Promise<BulkMediaDetailsResponse> => {
  const response = await axiosInstance.post("/get-bulk-media-details", params);
  return response.data;
};

// Delete media from bulk operation
export const deleteMediaFromBulk = async (params: DeleteMediaFromBulkRequest): Promise<DeleteMediaFromBulkResponse> => {
  const response = await axiosInstance.post('/delete-bulk-media', params);
  return response.data;
};

// Get bulk media summary
export const getBulkMediaSummary = async (params: GetBulkMediaSummaryRequest): Promise<GetBulkMediaSummaryResponse> => {
  const response = await axiosInstance.post('/get-bulk-media-summary', params);
  return response.data;
};

// EXIF Template API Interfaces
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
  templateId: string | number;
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
  ImageUrl: string;
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
  saveAs: 0 | 1;
  tempname: string;
}

export interface UpdateImgexifResponse {
  code: number;
  message: string;
  data: {
    updatedImageUrl: string;
    templateSaved: 0 | 1;
  };
}

// EXIF Template API Functions
export const getExifTemplateList = async (
  params: ExifTemplateListRequest
): Promise<ExifTemplateListResponse> => {
  const response = await axiosInstance.post("/get-exif-template", params);
  return response.data;
};

export const getExifTemplateDetails = async (
  params: ExifTemplateDetailsRequest
): Promise<ExifTemplateDetailsResponse> => {
  const response = await axiosInstance.post("/get-exif-template-details", params);
  return response.data;
};

export const updateImgexifDetails = async (
  data: UpdateImgexifRequest
): Promise<UpdateImgexifResponse> => {
  const response = await axiosInstance.post("/update-imgexif-details", data);
  return response.data;
};
