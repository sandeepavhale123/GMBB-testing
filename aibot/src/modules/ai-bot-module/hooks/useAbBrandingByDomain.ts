import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AbUserBranding } from '../types/branding';

export function useAbBrandingByDomain(domain: string | null) {
  return useQuery({
    queryKey: ['ab-branding-by-domain', domain],
    queryFn: async (): Promise<AbUserBranding | null> => {
      if (!domain) return null;

      // Skip for localhost and lovable.app domains
      if (domain === 'localhost' || domain.endsWith('.lovable.app')) {
        return null;
      }

      const { data, error } = await supabase
        .rpc('get_ab_branding_by_domain', { _domain: domain });

      if (error) {
        console.error('Error fetching branding by domain:', error);
        return null;
      }

      // RPC returns an array, get first item
      const branding = Array.isArray(data) ? data[0] : data;
      return branding as AbUserBranding | null;
    },
    enabled: !!domain,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export function useAbBrandingByUserId(userId: string | null) {
  return useQuery({
    queryKey: ['ab-branding-by-user', userId],
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
}
