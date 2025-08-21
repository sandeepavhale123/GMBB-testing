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
      console.log(
        "🌐 businessListingsService.getActiveListings: Making request with payload:",
        payload
      );

      const response = await axiosInstance.post<BusinessListingsApiResponse>(
        "/get-active-listings",
        payload
      );

      // console.log(
      //   "🌐 businessListingsService.getActiveListings: API response status:",
      //   response.status
      // );
      // console.log(
      //   "🌐 businessListingsService.getActiveListings: Response code:",
      //   response.data.code
      // );
      // console.log(
      //   "🌐 businessListingsService.getActiveListings: Raw data count:",
      //   response.data.data?.length || 0
      // );

      if (response.data.code === 200 && response.data.data) {
        const transformedData = response.data.data.map(
          transformBusinessListing
        );
        // console.log(
        //   "🌐 businessListingsService.getActiveListings: Successfully transformed",
        //   transformedData.length,
        //   "listings"
        // );
        // console.log(
        //   "🌐 businessListingsService.getActiveListings: Listing names:",
        //   transformedData.map((item) => item.name)
        // );
        return transformedData;
      }

      console.warn(
        "🌐 businessListingsService.getActiveListings: API returned non-200 code or no data:",
        response.data
      );
      return [];
    } catch (error: any) {
      console.error(
        "🌐 businessListingsService.getActiveListings: Error:",
        error
      );

      if (error.response) {
        console.error(
          "🌐 businessListingsService.getActiveListings: Response error:",
          error.response.status,
          error.response.data
        );
      } else if (error.request) {
        console.error(
          "🌐 businessListingsService.getActiveListings: Request error - no response received"
        );
      } else {
        console.error(
          "🌐 businessListingsService.getActiveListings: Setup error:",
          error.message
        );
      }

      throw error;
    }
  },

  async searchListings(
    query: string,
    limit: number = 20
  ): Promise<BusinessListing[]> {
    // console.log(
    //   "🔍 businessListingsService.searchListings: Searching with query:",
    //   query,
    //   "limit:",
    //   limit
    // );

    // Use the same API endpoint but with search query
    const result = await this.getActiveListings({ query, limit });
    // console.log(
    //   "🔍 businessListingsService.searchListings: Search completed, found",
    //   result.length,
    //   "results"
    // );
    // console.log(
    //   "🔍 businessListingsService.searchListings: Result names:",
    //   result.map((r) => r.name)
    // );

    return result;
  },
};
