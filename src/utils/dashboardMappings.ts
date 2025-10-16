// Dashboard type to filter ID mapping for shareable reports
import { TFunction } from "i18next";
export const DASHBOARD_FILTER_TYPE_MAPPING: Record<string, number> = {
  default: 1,
  insight: 3,
  review: 4,
  location: 8,
  post: 9,
};

// Reverse mapping for converting filter type back to dashboard type
export const FILTER_TYPE_TO_DASHBOARD_MAPPING: Record<number, string> = {
  1: "default",
  3: "insight",
  4: "review",
  8: "location",
  9: "post",
};

export const getDashboardFilterType = (dashboardType: string): number => {
  return DASHBOARD_FILTER_TYPE_MAPPING[dashboardType] || 1;
};

export const getDashboardType = (filterType: number): string => {
  return FILTER_TYPE_TO_DASHBOARD_MAPPING[filterType] || "default";
};

// Get display name for dashboard type
export const getDashboardDisplayName = (
  dashboardType: string,
  t?: TFunction
): string => {
  if (t) {
    return t(`dashboardTypes.${dashboardType}`);
  }
  const displayNames: Record<string, string> = {
    default: "Default",
    insight: "Insight",
    review: "Review",
    location: "Location",
    post: "Post",
  };
  return displayNames[dashboardType] || "Default";
};
