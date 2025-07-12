
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

export const formatScheduledDate = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Handle DD/MM/YYYY H:MM AM/PM format from API
    if (dateString.includes('/') && dateString.includes(' ')) {
      // Parse DD/MM/YYYY H:MM AM/PM format
      const [datePart, timePart] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      
      // Convert to MM/DD/YYYY format for proper parsing
      const formattedDateString = `${month}/${day}/${year} ${timePart}`;
      const date = new Date(formattedDateString);
      
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    }
    
    // Fallback to standard date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }
    
    return dateString;
  } catch (error) {
    return dateString;
  }
};
