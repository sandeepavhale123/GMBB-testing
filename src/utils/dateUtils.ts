
export const convertLocalDateTimeToUTC = (localDateTime: string): string => {
  if (!localDateTime) return '';
  
  // Create a Date object from the local datetime-local input
  const localDate = new Date(localDateTime);
  
  // Convert to UTC ISO string and ensure it ends with 'Z'
  return localDate.toISOString();
};

export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatDateForDisplay = (utcDate: string): string => {
  if (!utcDate) return '';
  
  const date = new Date(utcDate);
  return date.toLocaleString();
};

export const convertToBackendDateFormat = (localDateTime: string): string => {
  if (!localDateTime) return '';
  
  // Backend expects "YYYY-MM-DDTHH:MM" format (e.g., "2025-07-08T13:16")
  // datetime-local already gives us this format, so return as-is
  return localDateTime;
};
