import axiosInstance from "./axiosInstance";
import {
  CreateReportRequest,
  CreateReportPayload,
  Report,
  PerformanceHealthReportData,
} from "../types/reportTypes";
import { GetAllBulkReportsRequest, GetAllBulkReportsResponse } from "../types/bulkReportTypes";

// Helper function to convert frontend data to API payload format
const createReportPayload = (
  data: CreateReportRequest
): CreateReportPayload => {
  const { name, type, listingId, dateRange, sections, domain } = data;

  // Convert date ranges to ISO string format
  let apiDateRange;
  if ("period1" in dateRange && "period2" in dateRange) {
    // Compare report with two periods
    apiDateRange = {
      period1: {
        from: dateRange.period1.from,
        to: dateRange.period1.to,
      },
      period2: {
        from: dateRange.period2.from,
        to: dateRange.period2.to,
      },
    };
  } else {
    // Individual report with single period
    apiDateRange = {
      period1: {
        from: dateRange.from,
        to: dateRange.to,
      },
    };
  }

  return {
    name,
    type,
    listingId: parseInt(listingId), // Convert to number as expected by API
    date_range: apiDateRange,
    sections,
    domain: `${window.location.origin}/`,
  };
};

export const reportsApi = {
  getReports: async (listingId: string): Promise<Report[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },

  createReport: async (
    data: CreateReportRequest
  ): Promise<{
    report: Report;
    message: string;
    reportId: string;
    domain: string;
  }> => {
    const payload = createReportPayload(data);

    try {
      // console.log("Sending POST /create-report", payload);
      const response = await axiosInstance.post("/create-report", payload);
      // console.log("Success:", response.data);

      const apiData = response.data;
      // console.log("api Data in report api", apiData);
      const reportId =
        apiData.data.reportId || apiData.id || Date.now().toString();
      const domain = apiData.data.ReportUrl;

      const report: Report = {
        id: reportId,
        name: data.name,
        type: data.type,
        reportSections: data.sections.map((sectionId) => ({
          id: sectionId,
          name:
            sectionId.charAt(0).toUpperCase() + sectionId.slice(1) + " Section",
          enabled: true,
        })),
        dateRange: data.dateRange,
        createdAt: new Date().toISOString(),
        status: "generating",
      };

      return {
        report,
        message: apiData.message || "Report is being generated.",
        reportId,
        domain,
      };
    } catch (error) {
      console.error("POST /create-report failed:", error);
      throw error;
    }
  },

  getReport: async (reportId: string): Promise<Report | null> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return null;
  },

  // NEW: Get Performance Health Report API
  getPerformanceHealthReport: async (
    reportId: string
  ): Promise<PerformanceHealthReportData> => {
    try {
      // console.log("Fetching performance health report for ID:", reportId);
      const payload = isNaN(Number(reportId))
        ? { reportId: reportId }
        : { listingId: reportId };
      const response = await axiosInstance.post("/get-performance-health", {
        reportId: reportId,
      });
      // console.log("Performance health report data:", response.data);
      return response.data;
    } catch (error) {
      console.error("POST get-performance-health failed:", error);
      throw error;
    }
  },

  // NEW: Get Performance Insights Report API
  getPerformanceInsightsReport: async (reportId: string): Promise<any> => {
    try {
      // console.log("Fetching performance insights report for ID:", reportId);
      const response = await axiosInstance.post("/get-performance-insight", {
        reportId: reportId || "KsP1pDlvqA1QcOF",
      });
      // console.log("Performance insights report data:", response.data);
      return response.data;
    } catch (error) {
      console.error("POST get-performance-insight failed:", error);
      throw error;
    }
  },

  // Get Review Report Api
  getPerformanceReviewReport: async (reportId: string) => {
    try {
      // console.log("Fetching performance review report for ID:", reportId);
      const response = await axiosInstance.post("/get-performance-review", {
        reportId,
      });
      // console.log("Performance review report data:", response.data);
      return response.data;
    } catch (error) {
      console.error("POST get-performance-review failed:", error);
      throw error;
    }
  },
  //Get Post Report Api
  getPerformancePostsReport: async (reportId: string): Promise<any> => {
    try {
      // console.log("Fetching performance posts report for ID:", reportId);
      const response = await axiosInstance.post("/get-performance-post", {
        reportId,
      });

      if (response.data?.code === 200) {
        // console.log("Performance posts report data:", response.data);
        return response.data;
      } else {
        throw new Error(response.data?.message || "Failed to fetch report");
      }
    } catch (error) {
      console.error("POST get-performance-post failed:", error);
      throw error;
    }
  },

  // Get media report data
  getPerformanceMediaReport: async (reportId: string): Promise<any> => {
    try {
      const response = await axiosInstance.post("/get-performance-media", {
        reportId,
      });

      if (response.data?.code === 200) {
        // console.log("Performance media report data:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch performance media report"
        );
      }
    } catch (error) {
      console.error("POST get-performance-media failed:", error);
      throw error;
    }
  },

  // For footer data
  getPerformanceBrandingReport: async (reportId: string): Promise<any> => {
    try {
      const response = await axiosInstance.post("/get-performance-report", {
        reportId,
      });

      if (response.data?.code === 200) {
        // console.log("Performance branding report data:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch branding report"
        );
      }
    } catch (error) {
      console.error("POST get-performance-report failed:", error);
      throw error;
    }
  },

  // get keywords for georanking
  getPerformanceGeoKeywords: async (reportId: string): Promise<any> => {
    try {
      const response = await axiosInstance.post("/get-performance-keywords", {
        reportId,
      });

      if (response.data?.code === 200) {
        // console.log("Performance geo keywords data:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch geo keyword list"
        );
      }
    } catch (error) {
      console.error("POST get-performance-keywords failed:", error);
      throw error;
    }
  },

  // geo ranking report api
  getPerformanceGeoRankingReport: async (
    reportId: string,
    keywordId: number
  ): Promise<any> => {
    try {
      // console.log(
      //   "Fetching performance geo ranking for ID:",
      //   reportId,
      //   "Keyword:",
      //   keywordId
      // );
      const response = await axiosInstance.post("/get-performance-ranking", {
        reportId,
        keywordId,
      });

      if (response.data?.code === 200) {
        // console.log("Performance geo ranking data:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch geo ranking report"
        );
      }
    } catch (error) {
      console.error("POST get-performance-ranking failed:", error);
      throw error;
    }
  },

  // get data for report tabel
  getAllReports: async (
    listingId: number | string,
    page: number,
    limit: number = 10
  ): Promise<any> => {
    try {
      const response = await axiosInstance.post("/get-all-reports", {
        listingId,
        page,
        limit,
      });

      if (response.data?.code === 200) {
        // console.log("📄 All reports data:", response.data);
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch all reports"
        );
      }
    } catch (error) {
      console.error("POST /get-all-reports failed:", error);
      throw error;
    }
  },
  // Get Performance Citation Report API
  getPerformanceCitationReport: async (reportId: string): Promise<any> => {
    try {
      const response = await axiosInstance.post("/get-performance-citation", {
        reportId,
      });

      if (response.data?.code === 200) {
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch citation report"
        );
      }
    } catch (error) {
      console.error("POST get-performance-citation failed:", error);
      throw error;
    }
  },

  // Get all bulk reports with pagination, search, and filtering
  getAllBulkReports: async (params: {
    page: number;
    limit: number;
    search: string;
    report_type: 'all' | 'onetime' | 'monthly' | 'weekly';
  }): Promise<any> => {
    try {
      const response = await axiosInstance.post("/get-all-bulk-reports", params);

      if (response.data?.code === 200) {
        return response.data;
      } else {
        throw new Error(
          response.data?.message || "Failed to fetch bulk reports"
        );
      }
    } catch (error) {
      console.error("POST /get-all-bulk-reports failed:", error);
      throw error;
    }
  },
};
