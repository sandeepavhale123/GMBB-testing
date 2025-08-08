import { format, parseISO } from 'date-fns';

export const formatToDayMonthYear = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd MMM yyyy');
  } catch (error) {
    // Fallback for invalid dates
    return dateString;
  }
};

export const formatToISOString = (date: Date): string => {
  return date.toISOString();
};

export const parseISOToDate = (dateString: string): Date => {
  return parseISO(dateString);
};

export const formatScheduledDate = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM dd, yyyy HH:mm');
  } catch (error) {
    return dateString;
  }
};

export const convertToBackendDateFormat = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatToDDMMYY = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return format(date, 'dd/MM/yy');
  } catch (error) {
    return dateString;
  }
};