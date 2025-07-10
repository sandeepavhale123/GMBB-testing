import axiosInstance from "./axiosInstance";
import { useQuery } from "@tanstack/react-query";
export interface QuickWin {
  task_key: number;
  task_name: string;
  task_description: string;
  due_date: string;
  frequency: string;
  sort_order: number;
}
export interface OverviewData {
  totalPosts: number;
  totalReview: number;
  totalMedia: number;
  totalQuestion: number;
  totalAnswer: number;
  healthScore: number;
  placeId: string;
  quickWins: QuickWin[];
}

export const overviewApi = {
  getOverviewDetails: async (listingId: number) => {
    const response = await axiosInstance.post("/get-overview-details", {
      listingId,
    });
    return response.data;
  },
};

const transformApiResponse = (apiData: any): OverviewData => {
  return {
    totalPosts: Number(apiData.totalPosts) || 0,
    totalReview: Number(apiData.totalReview) || 0,
    totalMedia: Number(apiData.totalMedia) || 0,
    totalQuestion: Number(apiData.totalQuestion) || 0,
    totalAnswer: Number(apiData.totalAnswer) || 0,
    healthScore: Number(apiData.healthScore) || 0,
    placeId: String(apiData.placeId) || "",
    quickWins: Array.isArray(apiData.quickWins) ? apiData.quickWins : [],
  };
};

interface UseOverviewDataReturn {
  data: OverviewData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useOverviewData = (
  listingId: number | null
): UseOverviewDataReturn => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["overview-details", listingId],
    queryFn: async () => {
      const res = await overviewApi.getOverviewDetails(listingId as number);
      return transformApiResponse(res.data);
    },
    enabled: !!listingId,
    refetchOnWindowFocus: false,
  });

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? String(error) : null,
    refetch,
  };
};
