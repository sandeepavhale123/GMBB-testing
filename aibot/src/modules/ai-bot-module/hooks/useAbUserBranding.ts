import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AbUserBranding, AbBrandingFormData, DEFAULT_BRANDING } from '../types/branding';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function useAbUserBranding() {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const query = useQuery({
    queryKey: ['ab-user-branding', userId],
    queryFn: async (): Promise<AbUserBranding | null> => {
      if (!userId) return null;

      const { data, error } = await supabase
        .from('ab_user_branding')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data as AbUserBranding | null;
    },
    enabled: !!userId,
  });

  const upsertBranding = useMutation({
    mutationFn: async (input: AbBrandingFormData): Promise<AbUserBranding> => {
      if (!userId) throw new Error('Not authenticated');

      // Check if branding exists
      const { data: existing } = await supabase
        .from('ab_user_branding')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('ab_user_branding')
          .update(input)
          .eq('user_id', userId)
          .select()
          .single();

        if (error) throw error;
        return data as AbUserBranding;
      } else {
        // Insert new with verification token
        const verificationToken = crypto.randomUUID().replace(/-/g, '').slice(0, 16);
        const { data, error } = await supabase
          .from('ab_user_branding')
          .insert({
            user_id: userId,
            domain_verification_token: verificationToken,
            ...input,
          })
          .select()
          .single();

        if (error) throw error;
        return data as AbUserBranding;
      }
    },
    onSuccess: () => {
      toast.success('Branding settings saved');
      queryClient.invalidateQueries({ queryKey: ['ab-user-branding', userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save branding');
    },
  });

  const verifyDomain = useMutation({
    mutationFn: async (): Promise<boolean> => {
      if (!userId) throw new Error('Not authenticated');

      // In a real implementation, you would call an edge function
      // to verify DNS records. For now, we'll simulate verification.
      const { data: branding } = await supabase
        .from('ab_user_branding')
        .select('custom_domain, domain_verification_token')
        .eq('user_id', userId)
        .single();

      if (!branding?.custom_domain) {
        throw new Error('No domain configured');
      }

      // Mark as verified (in production, this would be done after DNS check)
      const { error } = await supabase
        .from('ab_user_branding')
        .update({ domain_verified: true })
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      toast.success('Domain verified successfully');
      queryClient.invalidateQueries({ queryKey: ['ab-user-branding', userId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Domain verification failed');
    },
  });

  return {
    branding: query.data,
    isLoading: query.isLoading,
    error: query.error,
    upsertBranding,
    verifyDomain,
    // Helper to get branding with defaults
    getBrandingWithDefaults: (): AbUserBranding => {
      if (query.data) return query.data;
      return {
        id: '',
        user_id: userId || '',
        ...DEFAULT_BRANDING,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    },
  };
}
