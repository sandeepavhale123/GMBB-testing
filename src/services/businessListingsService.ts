import axiosInstance from "@/api/axiosInstance";
import {
  BusinessListingsApiResponse,
  BusinessListing,
  transformBusinessListing,
} from "@/components/Header/types";

export interface BusinessListingsSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}

export const businessListingsService = {
  async getActiveListings(
    params: BusinessListingsSearchParams = {}
  ): Promise<BusinessListing[]> {
    const payload = {
      query: params.query || "",
      limit: params.limit || 10,
      offset: params.offset || 0,
    };

    try {
      const response = await axiosInstance.post<BusinessListingsApiResponse>(
        "/get-active-listings",
        payload
      );

      if (response.data.code === 200 && response.data.data) {
        const transformedData = response.data.data.map(
          transformBusinessListing
        );

        return transformedData;
      }

      // console.warn(
      //   "🌐 businessListingsService.getActiveListings: API returned non-200 code or no data:",
      //   response.data
      // );
      return [];
    } catch (error: any) {
      // console.error(
      //   "🌐 businessListingsService.getActiveListings: Error:",
      //   error
      // );

      if (error.response) {
        // console.error(
        //   "🌐 businessListingsService.getActiveListings: Response error:",
        //   error.response.status,
        //   error.response.data
        // );
      } else if (error.request) {
        // console.error(
        //   "🌐 businessListingsService.getActiveListings: Request error - no response received"
        // );
      } else {
        // console.error(
        //   "🌐 businessListingsService.getActiveListings: Setup error:",
        //   error.message
        // );
      }

      throw error;
    }
  },

  async searchListings(
    query: string,
    limit: number = 20
  ): Promise<BusinessListing[]> {
    // Use the same API endpoint but with search query
    const result = await this.getActiveListings({ query, limit });

    return result;
  },
};
