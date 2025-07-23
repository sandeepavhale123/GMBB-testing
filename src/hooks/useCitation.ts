// src/hooks/api/useCreateCitationReport.ts
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createCitationReport,
  getCitationReport,
  refreshCitationReport,
  CreateCitationReportPayload,
  GetCitationReportPayload,
  RefreshCitationReportPayload,
} from "@/api/citationApi";
import { toast } from "@/hooks/use-toast";

export const useCreateCitationReport = () => {
  return useMutation({
    mutationFn: (payload: CreateCitationReportPayload) =>
      createCitationReport(payload),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Citation report created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create citation report.",
      });
    },
  });
};

export const useGetCitationReport = (
  listingId?: string | number,
  enabled = true
) => {
  return useQuery({
    queryKey: ["citation-report", listingId],
    queryFn: () => getCitationReport({ listingId: listingId! }),
    enabled: enabled && !!listingId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRefreshCitationReport = () => {
  return useMutation({
    mutationFn: (payload: RefreshCitationReportPayload) =>
      refreshCitationReport(payload),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Citation report refreshed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to refresh citation report.",
      });
    },
  });
};
