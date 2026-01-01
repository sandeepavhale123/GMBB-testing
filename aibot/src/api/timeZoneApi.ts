import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/api/axiosBaseQuery";

export const timeZoneApi = createApi({
  reducerPath: "timeZoneApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAllTimeZone: builder.query<string[], void>({
      query: () => ({ url: "/get-timezone", method: "GET" }),
      transformResponse: (response: any) => {
        if (response.data.timezones) {
          return response.data.timezones;
        } else {
          console.error(
            "Unexpected API response format:",
            response.data.timezones
          );
          return [];
        }
      },
    }),
  }),
});

export const { useGetAllTimeZoneQuery } = timeZoneApi;
