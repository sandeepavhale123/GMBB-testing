import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { reportsApi } from "../api/reportsApi";
import { CreateReportRequest } from "../types/reportTypes";

export const useReports = (listingId: string) => {
  return useQuery({
    queryKey: ["reports", listingId],
    queryFn: () => reportsApi.getReports(listingId),
    enabled: !!listingId,
  });
};

export const useCreateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportRequest) => reportsApi.createReport(data),
    onSuccess: ({ report, message, reportId, domain }, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["all-reports", variables.listingId],
      });

      // Open new tab with performance report
      if (reportId) {
        const url = `${domain}`;
        const cleanUrl = url.replace(/([^:]\/)\/+/g, "$1"); // Removes duplicate slashes except after http(s):
        window.open(cleanUrl, "_blank");
      }
    },
    onError: (error) => {
      console.error("Report creation error:", error);
      toast({
        title: "Error",
        description:
          (error as any)?.response?.data?.message ||
          error.message ||
          "Failed to create report. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useReport = (reportId: string) => {
  return useQuery({
    queryKey: ["report", reportId],
    queryFn: () => reportsApi.getReport(reportId),
    enabled: !!reportId,
  });
};

// NEW: Hook for Performance Health Report
export const usePerformanceHealthReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-health-report", reportId, language],
    queryFn: () => reportsApi.getPerformanceHealthReport(reportId, language),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // optional: prevents auto-refetching for 5 mins
    refetchOnWindowFocus: false, // prevents refetching when window regains focus
  });
};

// Hook: usePerformanceInsightsReport
export const usePerformanceInsightsReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-insights-report", reportId, language],
    queryFn: () => reportsApi.getPerformanceInsightsReport(reportId, language),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// get Review Report
export const usePerformanceReviewReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-review-report", reportId, language],
    queryFn: () => reportsApi.getPerformanceReviewReport(reportId, language),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// get post report
export const usePerformancePostsReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-posts-report", reportId, language],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformancePostsReport(
          reportId,
          language
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Post Report",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch performance post report.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// header and footer data
export const usePerformanceBrandingReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-branding-report", reportId, language],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceBrandingReport(
          reportId,
          language
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Branding Report",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch performance branding report.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Media Report
export const usePerformanceMediaReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-media-report", reportId, language],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceMediaReport(
          reportId,
          language
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Media Report",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch performance media report.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// data for keywords in geo ranking
export const usePerformanceGeoKeywords = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-geo-keywords", reportId, language],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceGeoKeywords(
          reportId,
          language
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Keyword List",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch geo keyword data.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePerformanceGeoRankingReport = (
  reportId: string,
  keywordId: number
) => {
  return useQuery({
    queryKey: ["performance-geo-ranking", reportId, keywordId],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceGeoRankingReport(
          reportId,
          keywordId
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading GEO Report",
          description:
            error?.message ||
            error?.response?.data?.message ||
            "Failed to fetch GEO ranking report.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId && !!keywordId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// Public version with no caching for fresh data on re-selection
export const usePublicGeoRankingReport = (
  reportId: string,
  keywordId: number,
  language?: string
) => {
  return useQuery({
    queryKey: ["public-geo-ranking", reportId, keywordId, language],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceGeoRankingReport(
          reportId,
          keywordId,
          language
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading GEO Report",
          description:
            error?.message ||
            error?.response?.data?.message ||
            "Failed to fetch GEO ranking report.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId && !!keywordId,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });
};

export const useAllReports = (
  listingId: number | string,
  page: number,
  limit: number = 10
) => {
  return useQuery({
    queryKey: ["all-reports", listingId, page],
    queryFn: () => reportsApi.getAllReports(listingId, page, limit),
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const usePerformanceCitationReport = (
  reportId: string,
  language?: string
) => {
  return useQuery({
    queryKey: ["performance-citation-report", reportId, language],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceCitationReport(
          reportId,
          language
        );
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Citation Report",
          description:
            error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch performance citation report.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
