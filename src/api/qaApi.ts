
import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';
import type {
  QARequest,
  QAResponse,
  Question,
  QAFilters,
  QAPagination,
  QASorting,
  QASummary,
} from '../types/qaTypes';

// Re-export types for convenience
export type {
  QARequest,
  QAResponse,
  Question,
  QAFilters,
  QAPagination,
  QASorting,
  QASummary,
};

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
