import type { EditLogItem, TransformedEditLogItem } from '../types/editLogTypes';
import { format } from 'date-fns';
import { getCategoryMapping } from './editLogCategoryMapping';

export const transformEditLogItem = (item: EditLogItem): TransformedEditLogItem => {
  const date = new Date(item.createdAt);
  const categoryMapping = getCategoryMapping(item.category);
  
  return {
    id: item.id,
    category: item.category,
    categoryLabel: categoryMapping.label,
    categoryIcon: categoryMapping.icon,
    categoryBgColor: categoryMapping.bgColor,
    categoryIconColor: categoryMapping.iconColor,
    categoryBorderColor: categoryMapping.borderColor,
    categoryTextColor: categoryMapping.textColor,
    reason: item.reason,
    date: item.createdAt,
    formattedDate: format(date, 'MMM dd, yyyy'),
    formattedTime: format(date, 'HH:mm'),
  };
};

export const transformEditLogs = (items: EditLogItem[]): TransformedEditLogItem[] => {
  return items.map(transformEditLogItem);
};