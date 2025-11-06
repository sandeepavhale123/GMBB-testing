export interface WordPressConnection {
  connected: boolean;
  api_key?: string;
  wordpress_url?: string;
  last_sync?: string | null;
  total_fixes_synced?: number;
  sync_status?: 'pending' | 'success' | 'error' | null;
  errors?: string[];
}

export interface Project {
  id: string;
  subdomain_id: string;
  user_id: string;
  name: string;
  website: string;
  address: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  place_id?: string;
  latitude?: string;
  longitude?: string;
  phone: string;
  status: 'active' | 'paused' | 'completed';
  issues_found: string;
  issues_fixed: string;
  created_date: string;
  last_updated: string;
  
  // WordPress Integration - nested structure (new)
  wordpress_connection?: WordPressConnection;
  
  // WordPress Integration - flat structure (deprecated, for backwards compatibility)
  wordpress_connected?: boolean;
  wordpress_url?: string;
  wordpress_last_sync?: string;
  wordpress_sync_status?: 'pending' | 'success' | 'error';
  wordpress_fixes_synced?: number;
}

export interface ProjectsResponse {
  code: number;
  message: string;
  data: {
    projects: Project[];
    total: number;
    active_count: number;
    issues_found: number;
    issues_fixed: number;
    page: number;
    limit: number;
  };
}