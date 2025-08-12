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

export interface ListingDetail {
  id: string;
  locationName: string;
  zipCode: string;
  google_account_id: string;
  name: string;
  setting: string;
  setting_type: string;
}

export interface AutoSettings {
  starone_reply: string;
  startwo_reply: string;
  starthree_reply: string;
  starfour_reply: string;
  starfive_reply: string;
  starone_wreply: string;
  startwo_wreply: string;
  starthree_wreply: string;
  starfour_wreply: string;
  starfive_wreply: string;
  newStatus: string;
  oldStatus: string;
  oneTextStatus: number;
  twoTextStatus: number;
  threeTextStatus: number;
  fourTextStatus: number;
  fiveTextStatus: number;
  oneStarStatus: number;
  twoStarStatus: number;
  threeStarStatus: number;
  fourStarStatus: number;
  fiveStarStatus: number;
}

export interface ProjectInfo {
  id: string;
  listingIds: string;
  projectName: string;
  type: string;
  date: string;
}

export interface BulkProjectDetailsResponse {
  code: number;
  message: string;
  data: {
    listingDetails: ListingDetail[];
    autoSettings: AutoSettings;
    project: ProjectInfo;
  };
}

export interface UpdateBulkTemplateAutoReplyRequest {
  projectId: number;
  type: string;
  status: number;
  text: string;
  rating: number;
}

export interface UpdateBulkTemplateAutoReplyResponse {
  code: number;
  message: string;
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
    getBulkProjectDetails: builder.mutation<BulkProjectDetailsResponse, { projectId: string }>({
      query: ({ projectId }) => ({
        url: '/get-bulk-project-details',
        method: 'POST',
        data: { projectId: parseInt(projectId) },
      }),
    }),
    updateBulkTemplateAutoReply: builder.mutation<UpdateBulkTemplateAutoReplyResponse, UpdateBulkTemplateAutoReplyRequest>({
      query: (data) => ({
        url: '/update-bulk-template-autoreply',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { 
  useGetBulkReplyDetailsMutation, 
  useCreateBulkTemplateProjectMutation, 
  useGetBulkProjectDetailsMutation,
  useUpdateBulkTemplateAutoReplyMutation 
} = bulkAutoReplyApi;