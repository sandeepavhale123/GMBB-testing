import { format, parseISO } from "date-fns";
import type { BulkMapRankingKeywordDetailsResponse } from "@/api/bulkMapRankingKeywordDetailsApi";

// Format date from "YYYY-MM-DD" to "Nov 14, 2025 • 2:30 PM"
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy • h:mm a");
  } catch {
    return "N/A";
  }
};

// Format date from "YYYY-MM-DD" to "Nov 14, 2025"
export const formatDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy");
  } catch {
    return "N/A";
  }
};

// Map status from API (0/1) to display value
export const mapStatus = (statusCode: string): "completed" | "running" => {
  return statusCode === "0" ? "completed" : "running";
};

// Capitalize schedule for display
export const formatSchedule = (schedule: string): string => {
  return schedule.charAt(0).toUpperCase() + schedule.slice(1);
};

// Map kStatus from API (0/1) to display value
export const mapKeywordStatus = (kStatus: string): "completed" | "running" => {
  return kStatus === "0" ? "completed" : "running";
};

// Format rank for display (handles "20+" format)
export const formatRank = (rank: string): string => {
  return rank === "20+" ? "20+" : `#${rank}`;
};

// Get status badge variant
export const getStatusBadgeVariant = (
  status: "completed" | "running" | "failed"
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "completed":
      return "default";
    case "running":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "secondary";
  }
};

// Transform API response to BulkMapSummaryCards props
export const transformKeywordDetailsToSummaryProps = (
  data: BulkMapRankingKeywordDetailsResponse["data"]
) => {
  const { rankDistribution, keywordDetails } = data;
  
  // Calculate total keywords
  const total = 
    rankDistribution.counts.range_1_3 +
    rankDistribution.counts.range_4_10 +
    rankDistribution.counts.range_11_15 +
    rankDistribution.counts.range_16_20 +
    rankDistribution.counts["range_20+"];

  return {
    searchBy: keywordDetails.searchBy,
    scheduledFrequency: keywordDetails.scheduleFrequency,
    lastCheck: formatDate(keywordDetails.lastCheck),
    nextCheck: formatDate(keywordDetails.nextCheck),
    positionSummary: {
      total,
      pos1_3: {
        count: rankDistribution.counts.range_1_3,
        percent: rankDistribution.percentages.range_1_3,
      },
      pos4_10: {
        count: rankDistribution.counts.range_4_10,
        percent: rankDistribution.percentages.range_4_10,
      },
      pos11_15: {
        count: rankDistribution.counts.range_11_15,
        percent: rankDistribution.percentages.range_11_15,
      },
      pos16_20: {
        count: rankDistribution.counts.range_16_20 + rankDistribution.counts["range_20+"],
        percent: rankDistribution.percentages.range_16_20 + rankDistribution.percentages["range_20+"],
      },
    },
  };
};
