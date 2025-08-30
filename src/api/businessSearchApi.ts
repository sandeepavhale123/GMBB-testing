import axiosInstance from "./axiosInstance";

// Business search API responses
export interface GetApiKeyForSearchResponse {
  code: number;
  message: string;
  data: {
    apikey: string;
  };
}

export interface BusinessDetailsFromCIDRequest {
  searchType: number;
  inputText: string;
}

export interface BusinessDetailsFromCIDResponse {
  code: number;
  message: string;
  data: {
    business_name: string;
    lat: string;
    long: string;
  };
}

export interface BusinessDetails {
  business_name: string;
  lat: string;
  long: string;
}

// Get Google API key for Places search
export const getApiKeyForSearch = async (): Promise<GetApiKeyForSearchResponse> => {
  const response = await axiosInstance.post('/api/v1/geomodule/get-apikey-for-search');
  return response.data;
};

// Get business details using CID lookup
export const getBusinessDetailsFromCID = async (
  cid: string
): Promise<BusinessDetailsFromCIDResponse> => {
  const requestData: BusinessDetailsFromCIDRequest = {
    searchType: 3,
    inputText: cid,
  };
  
  const response = await axiosInstance.post('/api/v1/geomodule/get-default-coordinates', requestData);
  return response.data;
};