import axiosInstance from "./axiosInstance";

export interface GenerateCSVRequest {
  fileType: string;
  listingIds: string[];
}

export interface GenerateCSVResponse {
  code: number;
  message: string;
  data: {
    fileUrl: string;
    fileName: string;
  };
}

export interface ValidationRow {
  row: number;
  data: Record<string, any>;
  errors: string[];
}

export interface UploadBulkSheetResponse {
  code: number;
  message: string;
  data: {
    fileName: string;
    fileUrl: string;
    totalRows: number;
    errorCount: number;
    rows: ValidationRow[];
  };
}

export const csvApi = {
  generateMultiCSVFile: async (request: GenerateCSVRequest): Promise<GenerateCSVResponse> => {
    console.log('🌐 Making API request to /generate-multicsv-file with:', request);
    
    try {
      const response = await axiosInstance.post('/generate-multicsv-file', request);
      console.log('✅ API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ API request failed:', {
        url: '/generate-multicsv-file',
        request,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  },

  uploadBulkSheet: async (fileType: string, userFile: File): Promise<UploadBulkSheetResponse> => {
    console.log('🌐 Making API request to /upload-bulk-sheet with:', { fileType, fileName: userFile.name });
    
    const formData = new FormData();
    formData.append('fileType', fileType);
    formData.append('userFile', userFile);
    
    try {
      const response = await axiosInstance.post('/upload-bulk-sheet', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('✅ Upload API response received:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Upload API request failed:', {
        url: '/upload-bulk-sheet',
        fileType,
        fileName: userFile.name,
        error: error?.message,
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        responseData: error?.response?.data
      });
      throw error;
    }
  }
};