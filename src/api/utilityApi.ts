import axiosInstance from "./axiosInstance";

// API 1: Get Default Coordinates
export interface GetDefaultCoordinatesRequest {
  searchType: number;
  inputText: string;
}

export interface GetDefaultCoordinatesResponse {
  code: number;
  message: string;
  data: {
    bname: string;
    latlong: string;
  };
}

// API 2: Get Circle Coordinates
export interface GetCircleCoordinatesRequest {
  distance: number;
  latlong: string;
  radius: number;
}

export interface GetCircleCoordinatesResponse {
  code: number;
  message: string;
  data: {
    coordinates: string[];
    center: {
      lat: string;
      lng: string;
    };
    radius: number;
  };
}

// API 1: Fetch business coordinates from Map URL
export const getDefaultCoordinates = async (
  mapUrl: string
): Promise<GetDefaultCoordinatesResponse> => {
  const requestData: GetDefaultCoordinatesRequest = {
    searchType: 2,
    inputText: mapUrl,
  };
  
  const response = await axiosInstance.post(
    '/geomodule/get-default-coordinates', 
    requestData
  );
  return response.data;
};

// API 2: Fetch circle coordinates based on distance and radius
export const getCircleCoordinates = async (
  distance: number,
  latlong: string,
  radius: number
): Promise<GetCircleCoordinatesResponse> => {
  const requestData: GetCircleCoordinatesRequest = {
    distance,
    latlong,
    radius,
  };
  
  const response = await axiosInstance.post(
    '/utility/get-circle-coordinates',
    requestData
  );
  return response.data;
};

// API 3: Download Map Creator CSV
export interface DownloadMapCreatorCSVRequest {
  businessName: string;
  keywords: string;
  centerLatlong: string;
  description: string;
  businessDetails: string;
  relSearch: string;
  coordinates: string[];
}

export interface DownloadMapCreatorCSVResponse {
  code: number;
  message: string;
  data: {
    fileUrl: string;
  };
}

export const downloadMapCreatorCSV = async (
  requestData: DownloadMapCreatorCSVRequest
): Promise<DownloadMapCreatorCSVResponse> => {
  const response = await axiosInstance.post(
    '/utility/download-mapcreater-csv',
    requestData
  );
  return response.data;
};
