import { format, parseISO } from "date-fns";

// Format date from "YYYY-MM-DD" to "Nov 14, 2025 • 2:30 PM"
export const formatDateTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, "MMM dd, yyyy • h:mm a");
  } catch {
    return "N/A";
  }
};

// Map status from API (0/1) to display value
export const mapStatus = (statusCode: string): "completed" | "pending" => {
  return statusCode === "0" ? "completed" : "pending";
};

// Capitalize schedule for display
export const formatSchedule = (schedule: string): string => {
  return schedule.charAt(0).toUpperCase() + schedule.slice(1);
};
