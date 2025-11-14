import axiosInstance from "./axiosInstance";
import { HealthData } from "../types/health";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const healthApi = {
  getHealthReport: async (listingId: number, refresh: string = "") => {
    const response = await axiosInstance.post("/get-health-report", {
      listingId,
      refresh,
    });
    return response.data;
  },
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
  const { t } = useI18nNamespace("api/healthApi");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["health-report", listingId, refreshTrigger],
    queryFn: async () => {
      const res = await healthApi.getHealthReport(
        listingId as number,
        refreshTrigger > 0 ? "refresh" : ""
      );
      if (refreshTrigger > 0) {
        toast({
          title: t("health.successTitle"),
          description: res.message,
          variant: "default",
        });
      }
      return res.data;
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
