
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
      console.log('🌐 businessListingsService.getActiveListings: Making request with payload:', payload);
      
      const response = await axiosInstance.post<BusinessListingsApiResponse>(
        '/v1/get-active-listings',
        payload
      );

      console.log('🌐 businessListingsService.getActiveListings: API response:', response.data);
      console.log('🌐 businessListingsService.getActiveListings: Response code:', response.data.code);
      console.log('🌐 businessListingsService.getActiveListings: Raw data:', response.data.data);

      if (response.data.code === 200 && response.data.data) {
        const transformedData = response.data.data.map(transformBusinessListing);
        console.log('🌐 businessListingsService.getActiveListings: Transformed data:', transformedData);
        console.log('🌐 businessListingsService.getActiveListings: Transformed names:', transformedData.map(item => item.name));
        return transformedData;
      }

      console.warn('🌐 businessListingsService.getActiveListings: API returned non-200 code or no data:', response.data);
      return [];
    } catch (error: any) {
      console.error('🌐 businessListingsService.getActiveListings: Error:', error);
      
      // Add more specific error logging
      if (error.response) {
        console.error('🌐 businessListingsService.getActiveListings: Response error:', error.response.status, error.response.data);
        console.error('🌐 businessListingsService.getActiveListings: Request URL:', error.config?.url);
        console.error('🌐 businessListingsService.getActiveListings: Base URL:', error.config?.baseURL);
      } else if (error.request) {
        console.error('🌐 businessListingsService.getActiveListings: Request error - no response received:', error.request);
      } else {
        console.error('🌐 businessListingsService.getActiveListings: Setup error:', error.message);
      }
      
      throw error;
    }
  },

  async searchListings(query: string, limit: number = 20): Promise<BusinessListing[]> {
    console.log('🔍 businessListingsService.searchListings: Searching with query:', query, 'limit:', limit);
    const result = await this.getActiveListings({ query, limit });
    console.log('🔍 businessListingsService.searchListings: Search result:', result);
    return result;
  }
};
