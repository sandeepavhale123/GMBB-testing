import { useState, useEffect, useCallback } from "react";
import {
  BulkReportDetailsResponse,
  BulkReportFilters,
  ReportDetail,
  ViewReportDetailsResponse,
  ViewReportDetailsItem,
} from "@/types/bulkReportTypes";
import { reportsApi } from "@/api/reportsApi";
import { useDebounce } from "./useDebounce";

// Transform API response to match component expectations
const transformApiResponse = (
  apiResponse: ViewReportDetailsResponse
): BulkReportDetailsResponse => {
  const { data } = apiResponse;

  return {
    project: {
      id: data.report.report_id,
      name: data.report.title,
      totalLocations: data.pagination.total,
      reportSections: ["GMB Health", "Reviews", "Insights", "Media"], // Default sections
      scheduleType: data.report.schedule.toLowerCase() as
        | "one-time"
        | "weekly"
        | "monthly",
      status: "active" as const,
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      emailRecipients: [], // Not provided by API
    },
    reports: data.items.map((item: ViewReportDetailsItem): ReportDetail => {
      // Map API status to component status
      const mapStatus = (apiStatus: string): ReportDetail["status"] => {
        switch (apiStatus) {
          case "Completed":
            return "completed";
          case "Processing":
            return "processing";
          case "Failed":
            return "failed";
          default:
            return "pending";
        }
      };

      // Handle date - if it's "-", use current date
      const reportDate =
        item.date === "-"
          ? new Date().toISOString()
          : new Date(item.date).toISOString();

      return {
        id: item.gloc_id.toString(),
        locationName: item.listing_name,
        address: item.city,
        reportDate,
        status: mapStatus(item.status),
        deliveryStatus: "sent" as const, // Default since API doesn't provide this
        recipients: [], // Not provided by API
        reportUrl: item.pdf_url || item.csv_url || "#",
        fileSize: "2.0 MB", // Default since API doesn't provide this
        sections: ["GMB Health", "Reviews", "Insights", "Media"], // Default sections
        pdfUrl: item.pdf_url,
        csvUrl: item.csv_url,
        htmlUrl: item.html_url,
      };
    }),
    pagination: {
      total: data.pagination.total,
      page: data.pagination.page,
      pages: Math.ceil(data.pagination.total / data.pagination.limit),
      limit: data.pagination.limit,
    },
    allInOnePdfReport: data.allInOnePdfReport,
    allInOneCsvReport: data.allInOneCsvReport,
  };
};

export const useBulkReportDetails = (projectId: string) => {
  const [data, setData] = useState<BulkReportDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<BulkReportFilters>({
    search: "",
    status: "all",
    deliveryStatus: "all",
  });

  // Debounce search to avoid too many API calls
  const debouncedSearch = useDebounce(filters.search, 3000);

  const fetchData = useCallback(async () => {
    if (!projectId) return;

    setLoading(true);
    try {
      const reportId = parseInt(projectId);
      if (isNaN(reportId)) {
        throw new Error("Invalid report ID");
      }

      const apiResponse = await reportsApi.getViewReportDetails({
        reportId,
        search: debouncedSearch,
        page: currentPage,
        limit: 10,
      });

      const transformedData = transformApiResponse(apiResponse);

      // Apply client-side filtering for status since API doesn't support it
      if (filters.status !== "all") {
        transformedData.reports = transformedData.reports.filter(
          (report) => report.status === filters.status
        );
      }

      setData(transformedData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch bulk report details"
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [projectId, currentPage, debouncedSearch, filters.status]);

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId, fetchData]);

  const updateFilters = useCallback(
    (newFilters: Partial<BulkReportFilters>) => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1); // Reset to first page when filtering
    },
    []
  );

  const resendEmail = useCallback(async (reportId: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local state to reflect the resend
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          reports: prev.reports.map((report) =>
            report.id === reportId
              ? { ...report, deliveryStatus: "sent" as const }
              : report
          ),
        };
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to resend email",
      };
    }
  }, []);

  const downloadReport = useCallback(
    async (reportId: string, format: "pdf" | "csv" = "pdf") => {
      try {
        const report = data?.reports.find((r) => r.id === reportId);
        if (!report) {
          throw new Error("Report not found");
        }

        const downloadUrl = format === "pdf" ? report.pdfUrl : report.csvUrl;
        if (!downloadUrl) {
          throw new Error(`${format.toUpperCase()} download not available`);
        }

        // Open download link in new tab
        window.open(downloadUrl, "_blank");
        return { success: true };
      } catch (err) {
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "Failed to download report",
        };
      }
    },
    [data]
  );

  const downloadAllInOnePdf = useCallback(async () => {
    try {
      if (!data?.allInOnePdfReport) {
        throw new Error("All-in-one PDF not available");
      }

      window.open(data.allInOnePdfReport, "_blank");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to download all-in-one PDF",
      };
    }
  }, [data]);

  const downloadAllInOneCsv = useCallback(async () => {
    try {
      if (!data?.allInOneCsvReport) {
        throw new Error("All-in-one CSV not available");
      }

      window.open(data.allInOneCsvReport, "_blank");
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error:
          err instanceof Error
            ? err.message
            : "Failed to download all-in-one CSV",
      };
    }
  }, [data]);

  const bulkResendEmails = useCallback(async (reportIds: string[]) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update local state
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          reports: prev.reports.map((report) =>
            reportIds.includes(report.id)
              ? { ...report, deliveryStatus: "sent" as const }
              : report
          ),
        };
      });

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to resend emails",
      };
    }
  }, []);

  return {
    data,
    loading,
    error,
    currentPage,
    setCurrentPage,
    filters,
    updateFilters,
    refresh: fetchData,
    resendEmail,
    downloadReport,
    downloadAllInOnePdf,
    downloadAllInOneCsv,
    bulkResendEmails,
  };
};
