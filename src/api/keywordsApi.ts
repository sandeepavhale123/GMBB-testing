
import axiosInstance from "./axiosInstance";
import { 
  KeywordsListResponse, 
  AddKeywordRequest, 
  AddKeywordResponse, 
  CheckRankRequest 
} from "../types/keywords";

export const getKeywordsList = async (
  listingId: string,
  page: number = 1,
  limit: number = 10
): Promise<KeywordsListResponse> => {
  const response = await axiosInstance.post("/get-keywords-list", {
    listingId,
    page,
    limit
  });
  return response.data;
};

export const addKeywords = async (
  requestData: AddKeywordRequest
): Promise<AddKeywordResponse> => {
  const response = await axiosInstance.post("/add-keywords", requestData);
  return response.data;
};

export const checkKeywordRanks = async (
  requestData: CheckRankRequest
): Promise<{ code: number; message: string }> => {
  const response = await axiosInstance.post("/check-keyword-ranks", requestData);
  return response.data;
};

export const exportKeywords = async (
  listingId: string,
  format: 'csv' | 'json'
): Promise<Blob> => {
  const response = await axiosInstance.post("/export-keywords", {
    listingId,
    format
  }, {
    responseType: 'blob'
  });
  return response.data;
};
