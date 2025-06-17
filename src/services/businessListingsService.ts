
import axiosInstance from '@/api/axiosInstance';
import { BusinessListingsApiResponse, BusinessListing, transformBusinessListing } from '@/components/Header/types';

export interface BusinessListingsSearchParams {
  query?: string;
  limit?: number;
  offset?: number;
}

export const businessListingsService = {
  async getActiveListings(params: BusinessListingsSearchParams = {}): Promise<BusinessListing[]> {
    const payload = {
      query: params.query || "",
      limit: params.limit || 10,
      offset: params.offset || 0
    };

    try {
      const response = await axiosInstance.post<BusinessListingsApiResponse>(
        '/api/v1/get-active-listings',
        payload
      );

      console.log('Business listings API response:', response.data);

      if (response.data.code === 200 && response.data.data) {
        return response.data.data.map(transformBusinessListing);
      }

      return [];
    } catch (error) {
      console.error('Error fetching business listings:', error);
      throw error;
    }
  },

  async searchListings(query: string, limit: number = 20): Promise<BusinessListing[]> {
    return this.getActiveListings({ query, limit });
  }
};
