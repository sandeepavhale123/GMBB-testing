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
        queryKey: ["reports", variables.listingId],
      });

      toast({
        title: "Report Created",
        description:
          message ||
          `Your ${variables.type.toLowerCase()} report is being generated.`,
      });
      console.log(reportId, domain, "usereport");
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
        description: "Failed to create report. Please try again.",
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
export const usePerformanceHealthReport = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-health-report", reportId],
    queryFn: () => reportsApi.getPerformanceHealthReport(reportId),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000, // optional: prevents auto-refetching for 5 mins
    refetchOnWindowFocus: false, // prevents refetching when window regains focus
  });
};

// Hook: usePerformanceInsightsReport
export const usePerformanceInsightsReport = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-insights-report", reportId],
    queryFn: () => reportsApi.getPerformanceInsightsReport(reportId),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// get Review Report
export const usePerformanceReviewReport = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-review-report", reportId],
    queryFn: () => reportsApi.getPerformanceReviewReport(reportId),
    enabled: !!reportId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};

// get post report
export const usePerformancePostsReport = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-posts-report", reportId],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformancePostsReport(reportId);
        toast({
          title: "Post Report Loaded",
          description:
            data?.message || "Performance post report fetched successfully.",
        });
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Post Report",
          description:
            error?.message || "Failed to fetch performance post report.",
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
export const usePerformanceBrandingReport = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-branding-report", reportId],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceBrandingReport(reportId);
        toast({
          title: "Branding Report Loaded",
          description:
            data?.message ||
            "Performance branding report fetched successfully.",
        });
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Branding Report",
          description:
            error?.message || "Failed to fetch performance branding report.",
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
export const usePerformanceMediaReport = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-media-report", reportId],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceMediaReport(reportId);
        toast({
          title: "Media Report Loaded",
          description:
            data?.message || "Performance media report fetched successfully.",
        });
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Media Report",
          description:
            error?.message || "Failed to fetch performance media report.",
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
export const usePerformanceGeoKeywords = (reportId: string) => {
  return useQuery({
    queryKey: ["performance-geo-keywords", reportId],
    queryFn: async () => {
      try {
        const data = await reportsApi.getPerformanceGeoKeywords(reportId);
        toast({
          title: "Keyword List Loaded",
          description:
            data?.message || "Successfully fetched geo keyword data.",
        });
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading Keyword List",
          description: error?.message || "Failed to fetch geo keyword data.",
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
        toast({
          title: "GEO Ranking Report Loaded",
          description:
            data?.message || "Successfully fetched GEO ranking report.",
        });
        return data;
      } catch (error: any) {
        toast({
          title: "Error Loading GEO Report",
          description: error?.message || "Failed to fetch GEO ranking report.",
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

export const useAllReports = (listingId: number | string) => {
  return useQuery({
    queryKey: ["all-reports", listingId],
    queryFn: () => reportsApi.getAllReports(listingId),
    enabled: !!listingId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      toast({
        title: "All Reports Loaded",
        description: data?.message || "Fetched all reports successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error Fetching Reports",
        description: error?.message || "Failed to fetch all reports.",
        variant: "destructive",
      });
    },
  });
};
