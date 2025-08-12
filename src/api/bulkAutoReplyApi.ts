import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface BulkReplyGroupsList {
  id: string;
  labelName: string;
  google_locid: string;
  locCount: number;
}

export interface BulkReplyLocationsList {
  id: string;
  locationName: string;
  zipCode: string;
  google_account_id: string;
  name: string;
  setting: string;
  setting_type: string;
}

export interface CreateBulkTemplateProjectRequest {
  listingIds: string[];
  project_name: string;
  type: 'template' | 'ai' | 'dnr';
}

export interface CreateBulkTemplateProjectResponse {
  code: number;
  message: string;
  data: {
    projectId: number;
  };
}

export interface BulkReplyDetailsResponse {
  code: number;
  message: string;
  data: {
    groupsLists: BulkReplyGroupsList[];
    locationLists: BulkReplyLocationsList[];
  };
}

export const bulkAutoReplyApi = createApi({
  reducerPath: 'bulkAutoReplyApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getBulkReplyDetails: builder.mutation<BulkReplyDetailsResponse, void>({
      query: () => ({
        url: '/get-bulk-reply-details',
        method: 'POST',
      }),
    }),
    createBulkTemplateProject: builder.mutation<CreateBulkTemplateProjectResponse, CreateBulkTemplateProjectRequest>({
      query: (data) => ({
        url: '/create-bulk-template-project',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useGetBulkReplyDetailsMutation, useCreateBulkTemplateProjectMutation } = bulkAutoReplyApi;