
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

// Base interfaces without circular references
export interface QAFilters {
  search: string;
  status: 'all' | 'answered' | 'unanswered';
  dateRange: {
    startDate: string;
    endDate: string;
  };
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

export interface QARequest {
  listingId: number;
  pagination: QAPagination;
  filters: QAFilters;
  sorting: QASorting;
}

export interface Question {
  id: string;
  question: string;
  listingId: string;
  timestamp: string;
  status: 'answered' | 'unanswered';
  answer?: string;
  answerTimestamp?: string;
}

export interface QASummary {
  totalQuestions: number;
  answeredQuestions: number;
  unansweredQuestions: number;
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

export const qaApi = createApi({
  reducerPath: 'qaApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['QA'],
  endpoints: (builder) => ({
    getQASummary: builder.query<QAResponse, QARequest>({
      query: (params) => ({
        url: '/get-qa-summary',
        method: 'POST',
        data: params,
      }),
      providesTags: ['QA'],
    }),
  }),
});

export const { useGetQASummaryQuery, useLazyGetQASummaryQuery } = qaApi;
