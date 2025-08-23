import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface GroupsList {
  id: string;
  labelName: string;
  locCount: number;
}

export interface LocationsList {
  id: string;
  locationName: string;
  zipCode: string;
}

export interface ListingsGroupsResponse {
  code: number;
  message: string;
  data: {
    groupsLists: GroupsList[];
    locationLists: LocationsList[];
  };
}

export interface CreateGroupRequest {
  groupName: string;
  locationIds: string[];
}

export interface UpdateGroupRequest {
  groupId: string;
  groupName: string;
  locationIds: string[];
}

export interface DeleteGroupRequest {
  groupId: string;
}

export interface GroupResponse {
  code: number;
  message: string;
  data?: any;
}

export const listingsGroupsApi = createApi({
  reducerPath: 'listingsGroupsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Groups'],
  endpoints: (builder) => ({
    getAllListings: builder.mutation<ListingsGroupsResponse, void>({
      query: () => ({
        url: '/get-all-listings',
        method: 'POST',
      }),
      invalidatesTags: ['Groups'],
    }),
    createGroup: builder.mutation<GroupResponse, CreateGroupRequest>({
      query: (data) => ({
        url: '/create-group',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Groups'],
    }),
    updateGroup: builder.mutation<GroupResponse, UpdateGroupRequest>({
      query: (data) => ({
        url: '/update-group',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Groups'],
    }),
    deleteGroup: builder.mutation<GroupResponse, DeleteGroupRequest>({
      query: (data) => ({
        url: '/delete-group',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Groups'],
    }),
  }),
});

export const { 
  useGetAllListingsMutation,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation
} = listingsGroupsApi;