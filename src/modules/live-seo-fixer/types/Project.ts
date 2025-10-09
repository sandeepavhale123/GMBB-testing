export interface Project {
  id: string;
  subdomain_id: string;
  user_id: string;
  name: string;
  website: string;
  address: string;
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

export interface ProjectStats {
  total_audits: number;
  issues_found: number;
  issues_fixed: number;
}

export interface ProjectDetail extends Project {
  stats?: ProjectStats;
}

export interface CreateProjectRequest {
  name: string;
  website: string;
  address?: string;
  phone?: string;
}
