import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AbUserBranding, AbBrandingFormData, DEFAULT_BRANDING } from '../types/branding';
import { toast } from 'sonner';
import { useState } from 'react';

// TODO: Re-enable when ab_user_branding table is created in database
// This hook is temporarily stubbed to fix build errors

export function useAbUserBranding() {
  const queryClient = useQueryClient();
  const [userId] = useState<string | null>(null);

  // Return stub data - no actual database calls
  const query = {
    data: null as AbUserBranding | null,
    isLoading: false,
    error: null,
  };

  const upsertBranding = useMutation({
    mutationFn: async (_input: AbBrandingFormData): Promise<AbUserBranding> => {
      toast.error('Branding feature is not yet available');
      throw new Error('ab_user_branding table does not exist');
    },
  });

  const verifyDomain = useMutation({
    mutationFn: async (): Promise<boolean> => {
      toast.error('Domain verification is not yet available');
      throw new Error('ab_user_branding table does not exist');
    },
  });

  return {
    branding: query.data,
    isLoading: query.isLoading,
    error: query.error,
    upsertBranding,
    verifyDomain,
    getBrandingWithDefaults: (): AbUserBranding => ({
      id: '',
      user_id: userId || '',
      ...DEFAULT_BRANDING,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }),
  };
}
