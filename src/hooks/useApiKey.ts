import { useApiKeyContext } from '@/contexts/ApiKeyContext';

export const useApiKey = () => {
  const { apiKey, isLoading, error } = useApiKeyContext();
  
  return {
    apiKey,
    isLoading,
    error,
    hasApiKey: !!apiKey
  };
};