export interface AbUserBranding {
  id: string;
  user_id: string;
  logo_url: string | null;
  favicon_url: string | null;
  company_name: string | null;
  primary_color: string;
  secondary_color: string;
  background_color: string;
  custom_domain: string | null;
  domain_verified: boolean;
  domain_verification_token: string | null;
  show_powered_by: boolean;
  powered_by_text: string;
  powered_by_url: string;
  login_title: string;
  login_description: string;
  created_at: string;
  updated_at: string;
}

export interface AbBrandingFormData {
  logo_url?: string | null;
  favicon_url?: string | null;
  company_name?: string | null;
  primary_color?: string;
  secondary_color?: string;
  background_color?: string;
  custom_domain?: string | null;
  show_powered_by?: boolean;
  powered_by_text?: string;
  powered_by_url?: string;
  login_title?: string;
  login_description?: string;
}

export const DEFAULT_BRANDING: Omit<AbUserBranding, 'id' | 'user_id' | 'created_at' | 'updated_at'> = {
  logo_url: null,
  favicon_url: null,
  company_name: null,
  primary_color: '#3B82F6',
  secondary_color: '#1E40AF',
  background_color: '#FFFFFF',
  custom_domain: null,
  domain_verified: false,
  domain_verification_token: null,
  show_powered_by: true,
  powered_by_text: 'Powered by GMBBriefcase',
  powered_by_url: 'https://gmbbriefcase.com',
  login_title: 'AI Bot',
  login_description: 'Sign in to manage your AI bots',
};
