import axiosInstance from "./axiosInstance";
import {
  CreateReportRequest,
  CreateReportPayload,
  Report,
  PerformanceHealthReportData,
} from "../types/reportTypes";

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
        from: dateRange.period1.from.toISOString(),
        to: dateRange.period1.to.toISOString(),
      },
      period2: {
        from: dateRange.period2.from.toISOString(),
        to: dateRange.period2.to.toISOString(),
      },
    };
  } else {
    // Individual report with single period
    apiDateRange = {
      period1: {
        from: dateRange.from.toISOString(),
        to: dateRange.to.toISOString(),
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
      console.log("Sending POST /create-report", payload);
      const response = await axiosInstance.post("/create-report", payload);
      console.log("Success:", response.data);

      const apiData = response.data;
      console.log("api Data in report api", apiData);
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
      console.log("Fetching performance health report for ID:", reportId);
      const response = await axiosInstance.post("/get-performance-health", {
        reportId: reportId || "KsP1pDlvqA1QcOF", // Use provided reportId or fallback
      });
      console.log("Performance health report data:", response.data);
      return response.data;
    } catch (error) {
      console.error("POST get-performance-health failed:", error);
      throw error;
    }
  },

  // NEW: Get Performance Insights Report API
  getPerformanceInsightsReport: async (reportId: string): Promise<any> => {
    try {
      console.log("Fetching performance insights report for ID:", reportId);
      const response = await axiosInstance.post("/get-performance-insight", {
        reportId: reportId || "KsP1pDlvqA1QcOF",
      });
      console.log("Performance insights report data:", response.data);
      return response.data;
    } catch (error) {
      console.error("POST get-performance-insight failed:", error);
      throw error;
    }
  },
};
