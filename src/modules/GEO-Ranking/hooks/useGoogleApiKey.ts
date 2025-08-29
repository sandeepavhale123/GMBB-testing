import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getMapApiKey, updateApiKey, deleteApiKey } from '@/api/geoRankingApi';
import type { GoogleApiKeyData } from '../types';

// Real API functions
const fetchApiKeyData = async (): Promise<GoogleApiKeyData | null> => {
  try {
    const response = await getMapApiKey();
    if (response.code === 200 && response.data.apiKey) {
      return {
        id: '1',
        apiKey: response.data.apiKey,
        isValid: true,
        lastValidated: new Date().toISOString().split('T')[0],
        quotaUsed: 0,
        quotaLimit: 1000,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

const saveApiKey = async (apiKey: string): Promise<GoogleApiKeyData> => {
  const response = await updateApiKey({ apiKey });
  
  if (response.code !== 200) {
    throw new Error(response.message || 'Failed to save API key');
  }

  return {
    id: '1',
    apiKey: response.data.apiKey,
    isValid: true,
    lastValidated: new Date().toISOString().split('T')[0],
    quotaUsed: 0,
    quotaLimit: 1000,
  };
};

const removeApiKey = async (): Promise<void> => {
  const response = await deleteApiKey({ isDelete: 'delete' });
  
  if (response.code !== 200) {
    throw new Error(response.message || 'Failed to delete API key');
  }
};

export const useGoogleApiKey = () => {
  const queryClient = useQueryClient();

  const apiKeyQuery = useQuery({
    queryKey: ['google-api-key'],
    queryFn: fetchApiKeyData,
  });

  const saveMutation = useMutation({
    mutationFn: saveApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-api-key'] });
      toast.success('Google Places API key saved successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save API key');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: removeApiKey,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['google-api-key'] });
      toast.success('Google Places API key deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete API key');
    },
  });

  return {
    apiKeyData: apiKeyQuery.data,
    isLoading: apiKeyQuery.isLoading,
    error: apiKeyQuery.error,
    saveApiKey: saveMutation.mutate,
    deleteApiKey: deleteMutation.mutate,
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};