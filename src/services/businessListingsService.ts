
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
      console.log('Making request to business listings API with payload:', payload);
      
      const response = await axiosInstance.post<BusinessListingsApiResponse>(
        '/v1/get-active-listings', // Corrected endpoint without /api prefix
        payload
      );

      console.log('Business listings API response:', response.data);

      if (response.data.code === 200 && response.data.data) {
        const transformedData = response.data.data.map(transformBusinessListing);
        console.log('Transformed business listings:', transformedData);
        return transformedData;
      }

      console.warn('API returned non-200 code or no data:', response.data);
      return [];
    } catch (error: any) {
      console.error('Error fetching business listings:', error);
      
      // Add more specific error logging
      if (error.response) {
        console.error('Response error:', error.response.status, error.response.data);
        console.error('Request URL was:', error.config?.url);
        console.error('Base URL:', error.config?.baseURL);
      } else if (error.request) {
        console.error('Request error - no response received:', error.request);
      } else {
        console.error('Setup error:', error.message);
      }
      
      throw error;
    }
  },

  async searchListings(query: string, limit: number = 20): Promise<BusinessListing[]> {
    return this.getActiveListings({ query, limit });
  }
};
