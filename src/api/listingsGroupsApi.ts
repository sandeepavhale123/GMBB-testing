import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from './axiosBaseQuery';

export interface GroupsList {
  id: string;
  labelName: string;
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

export const listingsGroupsApi = createApi({
  reducerPath: 'listingsGroupsApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAllListings: builder.mutation<ListingsGroupsResponse, void>({
      query: () => ({
        url: '/get-all-listings',
        method: 'POST',
      }),
    }),
  }),
});

export const { useGetAllListingsMutation } = listingsGroupsApi;