import { format, parseISO } from "date-fns";

export const convertLocalDateTimeToUTC = (localDateTime: string): string => {
  if (!localDateTime) return "";

  // Create a Date object from the local datetime-local input
  const localDate = new Date(localDateTime);

  // Convert to UTC ISO string and ensure it ends with 'Z'
  return localDate.toISOString();
};

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDateForDisplay = (utcDate: string): string => {
  if (!utcDate) return "";

  const date = new Date(utcDate);
  return date.toLocaleString();
};

export const convertToBackendDateFormat = (localDateTime: string): string => {
  if (!localDateTime) return "";

  // Backend expects "YYYY-MM-DDTHH:MM" format (e.g., "2025-07-08T13:16")
  // datetime-local already gives us this format, so return as-is
  return localDateTime;
};

export const formatScheduledDate = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // Handle DD/MM/YYYY H:MM AM/PM format from API
    if (dateString.includes("/") && dateString.includes(" ")) {
      // Parse DD/MM/YYYY H:MM AM/PM format
      const [datePart, timePart] = dateString.split(" ");
      const [day, month, year] = datePart.split("/");

      // Convert to MM/DD/YYYY format for proper parsing
      const formattedDateString = `${month}/${day}/${year} ${timePart}`;
      const date = new Date(formattedDateString);

      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    }

    // Fallback to standard date parsing.
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }

    return dateString;
  } catch (error) {
    return dateString;
  }
};

// format date in Jan 01 2025 this form
export const formatToDayMonthYear = (dateInput: string | Date): string => {
  try {
    const date = typeof dateInput === "string" ? parseISO(dateInput) : dateInput;
    return format(date, "dd MMM yyyy"); // Example: 01 Jan 2025
  } catch (error) {
    // console.error("Invalid date passed to formatToDayMonthYear:", dateInput);
    return "";
  }
};

// Format to "dd/MM/yy" safely
export const formatToDDMMYY = (dateInput: string | Date): string => {
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

    if (isNaN(date.getTime())) {
      // console.error("Invalid date passed to formatToDDMMYY:", dateInput);
      return "";
    }

    return format(date, "dd/MM/yy"); // Example: 24/07/25
  } catch (error) {
    console.error("Error formatting date in formatToDDMMYY:", dateInput, error);
    return "";
  }
};

// Format date to YYYY-MM-DD without timezone conversion
export const formatDateForBackend = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};
