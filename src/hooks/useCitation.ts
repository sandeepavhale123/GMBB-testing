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
    if (query.isError) {
      const error = query.error as any;
      const errorStatus = error?.response?.status;
      
      // Don't show toast for expected errors
      const isValidationError = 
        errorStatus === 400 && 
        error?.response?.data?.message?.includes("businessName, phone, and address are required");
      
      const isAuthError = errorStatus === 401; // Hide 401 errors
      
      // Only show error toast for real errors
      if (!isValidationError && !isAuthError) {
        toast({
          title: "Error",
          description: error?.message || "Failed to fetch Citation audit",
        });
      }
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
