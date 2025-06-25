
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
