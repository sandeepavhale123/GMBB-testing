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
    bname: string;
    lat: string;
    long: string;
  };
}

export interface BusinessDetailsFromMapUrlRequest {
  searchType: number;
  inputText: string;
}

export interface BusinessDetailsFromMapUrlResponse {
  code: number;
  message: string;
  data: {
    bname: string;
    latlong: string;
  };
}

export interface BusinessLocation {
  name: string;
  latitude: string;
  longitude: string;
  type?: number;
  input?: string;
}

export interface Project {
  id: string;
  project_name: string;
}

export interface ProjectListResponse {
  code: number;
  message: string;
  data: {
    projectLists: Project[];
  };
}

// Get Google API key for Places search
export const getApiKeyForSearch = async (): Promise<GetApiKeyForSearchResponse> => {
  const response = await axiosInstance.post('/geomodule/get-apikey-for-search');
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
  
  const response = await axiosInstance.post('/geomodule/get-default-coordinates', requestData);
  return response.data;
};

// Get business details using Map URL
export const getBusinessDetailsFromMapUrl = async (
  mapUrl: string
): Promise<BusinessDetailsFromMapUrlResponse> => {
  const requestData: BusinessDetailsFromMapUrlRequest = {
    searchType: 2,
    inputText: mapUrl,
  };
  
  const response = await axiosInstance.post('/geomodule/get-default-coordinates', requestData);
  return response.data;
};

// Get project lists
export const getProjectLists = async (): Promise<ProjectListResponse> => {
  const response = await axiosInstance.post('/geomodule/get-project-lists');
  return response.data;
};