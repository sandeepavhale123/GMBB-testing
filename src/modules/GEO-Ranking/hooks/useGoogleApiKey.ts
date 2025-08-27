import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { GoogleApiKeyData } from '../types';

// Mock API functions - replace with actual API calls
const fetchApiKeyData = async (): Promise<GoogleApiKeyData | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Return null if no API key is set, or return mock data
  return {
    id: '1',
    apiKey: 'AIza***************xyz',
    isValid: true,
    lastValidated: '2024-01-20',
    quotaUsed: 45,
    quotaLimit: 1000,
  };
};

const saveApiKey = async (apiKey: string): Promise<GoogleApiKeyData> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock validation - in real implementation, validate with Google API
  const isValid = apiKey.startsWith('AIza') && apiKey.length > 20;
  
  if (!isValid) {
    throw new Error('Invalid Google Places API key format');
  }

  return {
    id: '1',
    apiKey: apiKey.substring(0, 4) + '***************' + apiKey.slice(-3),
    isValid: true,
    lastValidated: new Date().toISOString().split('T')[0],
    quotaUsed: 0,
    quotaLimit: 1000,
  };
};

const validateApiKey = async (apiKey: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Mock validation logic
  return apiKey.startsWith('AIza') && apiKey.length > 20;
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

  const validateMutation = useMutation({
    mutationFn: validateApiKey,
    onSuccess: (isValid) => {
      if (isValid) {
        toast.success('API key is valid');
      } else {
        toast.error('API key is invalid');
      }
    },
    onError: () => {
      toast.error('Failed to validate API key');
    },
  });

  return {
    apiKeyData: apiKeyQuery.data,
    isLoading: apiKeyQuery.isLoading,
    error: apiKeyQuery.error,
    saveApiKey: saveMutation.mutate,
    validateApiKey: validateMutation.mutate,
    isSaving: saveMutation.isPending,
    isValidating: validateMutation.isPending,
  };
};