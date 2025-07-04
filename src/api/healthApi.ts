import axiosInstance from "./axiosInstance";
import { HealthData } from "../types/health";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export const healthApi = {
  getHealthReport: async (listingId: number, refresh: string = "") => {
    const response = await axiosInstance.post("/get-health-report", {
      listingId,
      refresh,
    });
    return response.data;
  },
};

const transformApiResponse = (apiData: any): HealthData => {
  const insightItems = apiData.insightper?.items?.[0] || {};
  const chartData = (insightItems.chartData || []).map((item: any) => ({
    ...item,
    count: Number(item.count) || 0,
    views: Number(item.views) || 0,
  }));

  const insightMetrics = (insightItems.insightMetrics || []).map(
    (item: any) => ({
      ...item,
      value: Number(item.value) || 0,
    })
  );

  return {
    healthScore: Number(apiData.healthScore) || 0,
    reviews: {
      current: Number(apiData.reviews?.review) || 0,
      total: Number(apiData.reviews?.reply) || 0,
    },
    questionsAnswers: {
      questions: Number(apiData.questionsAnswers?.questions) || 0,
      answers: Number(apiData.questionsAnswers?.answers) || 0,
    },
    avgRating: Number(apiData.avgRating) || 0,
    gmbPhotos: Number(apiData.gmbPhotos) || 0,
    gmbPosts: Number(apiData.gmbPosts) || 0,
    chartData,
    insightMetrics,
    sections: apiData.sections || [],
    communication: Array.isArray(apiData.communication)
      ? apiData.communication
      : [apiData.communication],
  };
};

interface UseHealthReportReturn {
  data: HealthData | null;
  loading: boolean;
  error: string | null;
  refreshHealthReport: () => void;
}

export const useHealthReport = (
  listingId: number | null
): UseHealthReportReturn => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["health-report", listingId, refreshTrigger],
    queryFn: async () => {
      const res = await healthApi.getHealthReport(
        listingId as number,
        refreshTrigger > 0 ? "refresh" : ""
      );
      return transformApiResponse(res.data);
    },
    enabled: !!listingId,
    refetchOnWindowFocus: false,
  });

  const refreshHealthReport = () => setRefreshTrigger((prev) => prev + 1);

  return {
    data: data ?? null,
    loading: isLoading,
    error: error ? String(error) : null,
    refreshHealthReport,
  };
};
