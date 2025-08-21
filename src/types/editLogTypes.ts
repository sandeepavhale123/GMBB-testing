export interface EditLogRequest {
  listingId: number;
  page: number;
  limit: number;
  search: string;
}

export interface EditLogItem {
  id: number;
  category: string;
  reason: string;
  createdAt: string;
}

export interface EditLogPagination {
  total: number;
  page: number;
  limit: number;
}

export interface EditLogData {
  items: EditLogItem[];
  pagination: EditLogPagination;
}

export interface EditLogResponse {
  code: number;
  message: string;
  data: EditLogData;
}

export interface TransformedEditLogItem {
  id: number;
  category: string;
  categoryLabel: string;
  categoryIcon: any;
  categoryBgColor: string;
  categoryIconColor: string;
  categoryBorderColor: string;
  categoryTextColor: string;
  reason: string;
  date: string;
  formattedDate: string;
  formattedTime: string;
}