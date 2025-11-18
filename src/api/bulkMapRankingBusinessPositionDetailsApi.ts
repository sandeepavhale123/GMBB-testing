import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";

// Request Types
export interface BusinessPositionDetailsRequest {
  id: number;
}

// Response Types
export interface RankingDetail {
  name: string;
  address: string;
  rating: string;
  review: string;
  position: number;
  selected: boolean;
}

export interface BusinessPositionDetailsResponse {
  code: number;
  message: string;
  data: {
    RankingDetails: RankingDetail[];
  };
}

// API function
const getBusinessPositionDetails = async (
  id: number
): Promise<BusinessPositionDetailsResponse> => {
  const response = await axiosInstance.post("/get-business-position-details", {
    id,
  });
  return response.data;
};

// Custom hook
export const useBusinessPositionDetails = (
  id: number,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ["business-position-details", id],
    queryFn: () => getBusinessPositionDetails(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};
