
import type { BusinessInfo, WorkingHour, EditLog } from '../types/businessInfoTypes';

export interface TransformedBusinessData {
  name: string;
  address: string;
  phone: string;
  website: string;
  storeCode: string;
  category: string;
  additionalCategory: string;
  labels: string;
  appointmentUrl: string;
  mapUrl: string;
  description: string;
}

export interface TransformedWorkingHour {
  day: string;
  hours: string;
  isOpen: boolean;
}

export interface TransformedEditLog {
  date: string;
  action: string;
  status: string;
}

export const transformBusinessInfo = (businessInfo: BusinessInfo): TransformedBusinessData => {
  return {
    name: businessInfo.name || '',
    address: businessInfo.address || '',
    phone: businessInfo.phone || '',
    website: businessInfo.website || '',
    storeCode: businessInfo.store_code || '',
    category: businessInfo.category || '',
    additionalCategory: businessInfo.additional_category || '',
    labels: businessInfo.labels || '',
    appointmentUrl: businessInfo.appointment_url || '',
    mapUrl: businessInfo.map_url || '',
    description: businessInfo.description || '',
  };
};

export const transformWorkingHours = (workingHours: WorkingHour[]): TransformedWorkingHour[] => {
  const daysMap = new Map<string, TransformedWorkingHour>();
  const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  
  // Initialize all days as closed
  dayOrder.forEach(day => {
    daysMap.set(day, {
      day: day.charAt(0) + day.slice(1).toLowerCase(),
      hours: 'Closed',
      isOpen: false
    });
  });
  
  // Process working hours from API
  workingHours.forEach(hour => {
    const dayKey = hour.day.toUpperCase();
    if (daysMap.has(dayKey)) {
      const existing = daysMap.get(dayKey)!;
      if (hour.is_open || hour.hours !== 'Closed') {
        // Convert 24-hour format to 12-hour format for display
        const formattedHours = formatTimeRange(hour.open_time, hour.close_time);
        existing.hours = formattedHours;
        existing.isOpen = true;
      }
    }
  });
  
  return dayOrder.map(day => daysMap.get(day)!);
};

export const transformEditLogs = (editLogs: EditLog[]): TransformedEditLog[] => {
  return editLogs.map(log => ({
    date: new Date(log.date).toLocaleDateString(),
    action: log.field_changed || log.action,
    status: log.status
  }));
};

const formatTimeRange = (openTime: string, closeTime: string): string => {
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const min = minutes || '00';
    
    if (hour === 0) return `12:${min} AM`;
    if (hour < 12) return `${hour}:${min} AM`;
    if (hour === 12) return `12:${min} PM`;
    return `${hour - 12}:${min} PM`;
  };
  
  return `${formatTime(openTime)} - ${formatTime(closeTime)}`;
};
