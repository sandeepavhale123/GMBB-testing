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