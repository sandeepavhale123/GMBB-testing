
import axiosInstance from './axiosInstance';

export interface MediaUploadData {
  file: File;
  title: string;
  category: string;
  publishOption: string;
  scheduleDate?: string;
  listingId: string;
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
  postdate: string;
  posttime: string;
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

export const uploadMedia = async (data: MediaUploadData): Promise<MediaUploadResponse> => {
  const formData = new FormData();
  
  // Add the file
  formData.append('userfile', data.file);
  
  // Add other form fields
  formData.append('title', data.title);
  formData.append('category', data.category.toUpperCase());
  formData.append('type', data.file.type.startsWith('image/') ? 'photo' : 'video');
  formData.append('publish_option', data.publishOption);
  formData.append('listingId', data.listingId);
  
  // Add schedule date if provided (should already be in UTC format)
  if (data.scheduleDate && data.publishOption === 'schedule') {
    formData.append('schedule_date', data.scheduleDate);
  }

  const response = await axiosInstance.post<MediaUploadResponse>('/upload-media', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
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
