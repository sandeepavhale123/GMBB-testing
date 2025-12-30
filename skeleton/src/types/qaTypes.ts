
// Base Q&A type definitions
export interface QAFilters {
  search: string;
  status: 'all' | 'answered' | 'unanswered';
}

export interface QAPagination {
  page: number;
  limit: number;
  offset: number;
}

export interface QASorting {
  sortBy: 'timestamp';
  sortOrder: 'asc' | 'desc';
}

export interface Question {
  id: string;
  question: string;
  listingId: string;
  timestamp: string;
  status: 'answered' | 'unanswered';
  answer?: string;
  answerTimestamp?: string;
  name?: string;
  photo?: string;
}

export interface QASummary {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
}

export interface QARequest {
  listingId: number;
  pagination: QAPagination;
  filters: QAFilters;
  sorting: QASorting;
}

export interface QAResponsePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface QAData {
  questions: Question[];
  pagination: QAResponsePagination;
  summary: QASummary;
}

export interface QAResponse {
  code: number;
  message: string;
  data: QAData;
}
