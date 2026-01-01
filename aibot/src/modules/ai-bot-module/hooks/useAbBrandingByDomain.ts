import { useQuery } from '@tanstack/react-query';
import { AbUserBranding } from '../types/branding';

// TODO: Re-enable when ab_user_branding table and get_ab_branding_by_domain function are created
// This hook is temporarily stubbed to fix build errors

export function useAbBrandingByDomain(domain: string | null) {
  return useQuery({
    queryKey: ['ab-branding-by-domain', domain],
    queryFn: async (): Promise<AbUserBranding | null> => {
      // Return null - branding feature not yet available
      return null;
    },
    enabled: !!domain && domain !== 'localhost' && !domain.endsWith('.lovable.app'),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAbBrandingByUserId(userId: string | null) {
  return useQuery({
    queryKey: ['ab-branding-by-user', userId],
    queryFn: async (): Promise<AbUserBranding | null> => {
      // Return null - branding feature not yet available
      return null;
    },
    enabled: !!userId,
  });
}
