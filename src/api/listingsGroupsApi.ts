import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface GroupsList {
  id: string;
  groupName: string;
  google_locid: string;
  created_at: string;
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

export interface GetGroupsRequest {
  page: number;
  limit: number;
  search: string;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetGroupsResponse {
  code: number;
  message: string;
  data: {
    groupsLists: GroupsList[];
    pagination: PaginationData;
  };
}

export interface CreateGroupRequest {
  groupName: string;
  google_locid: number[];
}

export interface UpdateGroupRequest {
  groupId: string;
  groupName: string;
  google_locid: number[];
}

export interface DeleteGroupRequest {
  groupId: string;
}

export interface DeleteGroupsRequest {
  groupIds: number[];
}

export interface DeleteGroupsResponse {
  code: number;
  message: string;
  data: {
    deletedCount: number;
  };
}

// Remove GroupDetailsLocation and use LocationGroup instead

export interface GetGroupDetailsRequest {
  groupId: number;
  page: number;
  limit: number;
  search: string;
}

export interface GetGroupDetailsResponse {
  code: number;
  message: string;
  data: {
    groupName: string;
    listings: LocationGroup[];
    pagination: PaginationData;
  };
}

export interface LocationGroup {
  id: string;
  locationName: string;
  zipCode: string;
  google_account_id: string;
  name: string;
  email?: string;
}

export interface GetGroupsListingResponse {
  code: number;
  message: string;
  data: {
    locationGroups: {
      [email: string]: LocationGroup[];
    };
  };
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
    getGroupsListing: builder.mutation<GetGroupsListingResponse, void>({
      query: () => ({
        url: '/get-groups-listing',
        method: 'POST',
      }),
      invalidatesTags: ['Groups'],
    }),
    getGroups: builder.query<GetGroupsResponse, GetGroupsRequest>({
      query: (data) => ({
        url: '/get-groups',
        method: 'POST',
        data,
      }),
      providesTags: ['Groups'],
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
    deleteGroups: builder.mutation<DeleteGroupsResponse, DeleteGroupsRequest>({
      query: (data) => ({
        url: '/delete-groups',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Groups'],
    }),
  }),
});

export const { 
  useGetAllListingsMutation,
  useGetGroupsListingMutation,
  // useGetGroupsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
  useDeleteGroupsMutation
} = listingsGroupsApi;