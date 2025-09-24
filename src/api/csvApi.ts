import axios from 'axios';

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
    const response = await axios.post('/generate-multicsv-file', request);
    return response.data;
  }
};