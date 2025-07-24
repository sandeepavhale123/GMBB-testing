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
import { useEffect } from "react";

export const useCreateCitationReport = () => {
  return useMutation({
    mutationFn: (payload: CreateCitationReportPayload) =>
      createCitationReport(payload),
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: data?.message || "Citation report created successfully.",
      });
    },
    onError: (data) => {
      toast({
        title: "Error",
        description: data?.message || "Failed to create citation report.",
      });
    },
  });
};

export const useGetCitationReport = (
  listingId?: string | number,
  enabled = true
) => {
  const query = useQuery({
    queryKey: ["citation-report", listingId],
    queryFn: () => getCitationReport({ listingId: listingId! }),
    enabled: enabled && !!listingId,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.isSuccess) {
      toast({
        title: "Success",
        description: query.data?.message || "Citation audit data fetched",
      });
    }
  }, [query.isSuccess]);

  useEffect(() => {
    if (query.isError) {
      toast({
        title: "Error",
        description:
          (query.error as any)?.message || "Failed to fetch Citation audit",
      });
    }
  }, [query.isError]);

  return query;
};

export const useRefreshCitationReport = () => {
  return useMutation({
    mutationFn: (payload: RefreshCitationReportPayload) =>
      refreshCitationReport(payload),
    onSuccess: (data) => {
      console.log("Citation refresh data", data);
      toast({
        title: "Success",
        description: data?.message || "Citation report refreshed successfully.",
      });
    },
    onError: (data) => {
      toast({
        title: "Error",
        description: data?.message || "Failed to refresh citation report.",
      });
    },
  });
};
