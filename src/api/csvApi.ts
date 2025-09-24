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
  }
};