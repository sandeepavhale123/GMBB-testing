import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export interface PageTypeDescription {
  [key: string]: string;
}

export interface SupportedPageTypesResponse {
  code: number;
  message: string;
  data: {
    supported_types: string[];
    descriptions: PageTypeDescription;
  };
}

export interface PageTypeOption {
  value: string;
  label: string;
  description?: string;
}

/**
 * Fetch supported page types from the API
 */
export const getSupportedPageTypes = async (): Promise<SupportedPageTypesResponse> => {
  const response = await axios.get<SupportedPageTypesResponse>(
    `${API_BASE_URL}/live-seo-fixer/supported-page-types`
  );
  return response.data;
};

/**
 * Transform API response to page type options for UI components
 */
export const transformToPageTypeOptions = (data: SupportedPageTypesResponse['data']): PageTypeOption[] => {
  return data.supported_types.map(type => ({
    value: type,
    label: data.descriptions[type] || type.charAt(0).toUpperCase() + type.slice(1).replace(/-/g, ' '),
    description: data.descriptions[type]
  }));
};
