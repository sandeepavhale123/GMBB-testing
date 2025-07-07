import axiosInstance from './axiosInstance';

export interface MediaUploadData {
  file?: File;
  title: string;
  category: string;
  publishOption: string;
  scheduleDate?: string;
  listingId: string;
  selectedImage: "local" | "ai";
  aiImageUrl?: string;
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

export const uploadMedia = async (data: MediaUploadData): Promise<MediaUploadResponse> => {
  console.log('uploadMedia called with:', {
    fileName: data.file?.name,
    fileSize: data.file?.size,
    fileType: data.file?.type,
    title: data.title,
    category: data.category,
    publishOption: data.publishOption,
    listingId: data.listingId,
    selectedImage: data.selectedImage,
    aiImageUrl: data.aiImageUrl
  });

  const formData = new FormData();
  
  // Add the file only for local uploads
  if (data.selectedImage === 'local' && data.file) {
    formData.append('userfile', data.file);
    formData.append('type', data.file.type.startsWith('image/') ? 'photo' : 'video');
  }
  
  // Add other form fields
  formData.append('title', data.title);
  formData.append('category', data.category.toUpperCase());
  formData.append('publish_option', data.publishOption);
  formData.append('listingId', data.listingId);
  formData.append('selectedImage', data.selectedImage);
  
  // Add AI image URL if it's an AI-generated image
  if (data.selectedImage === 'ai' && data.aiImageUrl) {
    formData.append('aiImageUrl', data.aiImageUrl);
    formData.append('type', 'photo');
  }
  
  // Add schedule date if provided (should already be in UTC format)
  if (data.scheduleDate && data.publishOption === 'schedule') {
    formData.append('schedule_date', data.scheduleDate);
  }

  // Log FormData contents
  console.log('FormData contents:');
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  try {
    const response = await axiosInstance.post<MediaUploadResponse>('/upload-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Upload API error:', error);
    throw error;
  }
};

export const getMediaList = async (params: MediaListRequest): Promise<MediaListResponse> => {
  const response = await axiosInstance.post<MediaListResponse>('/get-media-list', params);
  return response.data;
};

export const deleteMedia = async (params: MediaDeleteRequest): Promise<MediaDeleteResponse> => {
  const response = await axiosInstance.post<MediaDeleteResponse>('/delete-media', {
    listingId: parseInt(params.listingId),
    mediaId: parseInt(params.mediaId)
  });
  return response.data;
};

export const generateAIImage = async (data: AIImageGenerationRequest): Promise<AIImageGenerationResponse> => {
  const response = await axiosInstance.post<AIImageGenerationResponse>('/generate-ai-image', data);
  return response.data;
};

export const getMediaStats = async (params: MediaStatsRequest): Promise<MediaStatsResponse> => {
  const response = await axiosInstance.post<MediaStatsResponse>('/get-media-stats', {
    listingId: parseInt(params.listingId)
  });
  return response.data;
};
