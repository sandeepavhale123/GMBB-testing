import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// API Types
export interface BulkMapRankingStatsResponse {
  code: number;
  message: string;
  data: {
    totalProjects: number;
    noOfKeywords: number;
    noOfSchedule: number;
    allowedCredit: number;
    remainingCredit: number;
  };
}

// API function
const getBulkMapRankingStats = async (): Promise<BulkMapRankingStatsResponse> => {
  const response = await axiosInstance.post("/get-mapranking-stat", {});
  return response.data;
};

// Custom hook
export const useBulkMapRankingStats = () => {
  return useQuery({
    queryKey: ["bulk-map-ranking-stats"],
    queryFn: () => getBulkMapRankingStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
};

// Add Bulk Keywords Request Types
export interface AddBulkMapRankingKeywordsRequest {
  keywords: string;
  locationIds: number[];
  language: string;
  schedule: string;
  searchBy: string;
}

export interface AddBulkMapRankingKeywordsResponse {
  code: number;
  message: string;
}

// API function for adding bulk keywords
export const addBulkMapRankingKeywords = async (
  data: AddBulkMapRankingKeywordsRequest
): Promise<AddBulkMapRankingKeywordsResponse> => {
  const response = await axiosInstance.post("/add-mapranking-bulk-keyword", data);
  return response.data;
};


// Generate CSV for bulk map rank check  
export interface GenerateCSVFormBulkMapRankingRequest {
  listingIds:number[];
}

export interface GenerateCSVFormBulkMapRankingResponse {
    code:number ;
    message:string;
    data:{
        fileUrl:string;
        fileName:string;
    }
}
export const generateCSVForBulkMapRanking = async(
  data:GenerateCSVFormBulkMapRankingRequest
):Promise<GenerateCSVFormBulkMapRankingResponse> => {
   const response = await axiosInstance.post("/download-sample-csv",data);
   return response.data
}