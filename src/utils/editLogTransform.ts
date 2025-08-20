import type { EditLogItem, TransformedEditLogItem } from '../types/editLogTypes';
import { format } from 'date-fns';

export const transformEditLogItem = (item: EditLogItem): TransformedEditLogItem => {
  const date = new Date(item.createdAt);
  
  return {
    id: item.id,
    category: item.category,
    reason: item.reason,
    date: item.createdAt,
    formattedDate: format(date, 'MMM dd, yyyy'),
  };
};

export const transformEditLogs = (items: EditLogItem[]): TransformedEditLogItem[] => {
  return items.map(transformEditLogItem);
};