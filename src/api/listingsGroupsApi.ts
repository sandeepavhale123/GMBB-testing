import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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