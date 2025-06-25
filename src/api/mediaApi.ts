
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
