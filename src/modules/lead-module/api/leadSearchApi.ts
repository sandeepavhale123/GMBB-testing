import axiosInstance from '@/api/axiosInstance';

interface GetApiKeyForSearchResponse {
  code: number;
  message: string;
  data: {
    apikey: string;
  };
}

export const getLeadApiKeyForSearch = async (): Promise<GetApiKeyForSearchResponse> => {
  const response = await axiosInstance.post('/lead/get-apikey-for-search');
  return response.data;
};