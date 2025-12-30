import axios from "@/api/axiosInstance";

// Inline type that was previously imported from @/modules/live-seo-fixer/types/Project
export interface ProjectsResponse {
  code: number;
  message: string;
  data: {
    projects: Array<{
      id: string;
      name: string;
      website: string;
      status: "active" | "paused" | "completed";
      issues_found: string;
      issues_fixed: string;
      created_date: string;
      last_updated: string;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}

interface FetchProjectsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export const fetchProjects = async (params: FetchProjectsParams = {}): Promise<ProjectsResponse> => {
  const { page = 1, limit = 10, search = "", status = "" } = params;

  const response = await axios.get<ProjectsResponse>("/live-seo-fixer/projects", {
    params: {
      page,
      limit,
      search,
      status,
    },
  });

  return response.data;
};

export const getSupportedSchemaTypes = async (): Promise<{
  code: number;
  message: string;
  data: {
    Organization: string[];
    Place: string[];
    LocalBusiness: {
      General: string[];
      Specific: string[];
      Retail: string[];
    };
  };
}> => {
  const response = await axios.get("/live-seo-fixer/supported-schema-types");
  return response.data;
};

export const createProject = async (data: {
  name: string;
  website: string;
  address?: string;
  street_address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  place_id?: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
  schema_types?: string[];
}): Promise<{ code: number; message: string; data: { project: any } }> => {
  const response = await axios.post("/live-seo-fixer/projects", data);
  return response.data;
};

export const updateProjectStatus = async (
  projectId: string,
  status: "active" | "paused" | "completed",
): Promise<{ code: number; message: string }> => {
  const response = await axios.patch(`/live-seo-fixer/projects/${projectId}/status`, {
    status,
  });
  return response.data;
};

export const getProjectDetails = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    id: string;
    subdomain_id: string;
    user_id: string;
    name: string;
    website: string;
    address?: string;
    phone?: string;
    status: "active" | "paused" | "completed";
    issues_found: string;
    issues_fixed: string;
    created_date: string;
    last_updated: string;
    total_pages: number;
    audited_pages: number;
    last_audit_date: string | null;
    has_active_audit: boolean;
    js_snippet_installed: boolean;
    js_snippet_code: string;
    wordpress_connection?: {
      connected: boolean;
      api_key?: string;
      wordpress_url?: string;
      last_sync?: string | null;
      total_fixes_synced?: number;
      sync_status?: "pending" | "success" | "error" | null;
      errors?: string[];
    };
    wordpress_connected?: boolean;
    wordpress_url?: string;
    wordpress_last_sync?: string;
    wordpress_sync_status?: "pending" | "success" | "error";
    wordpress_fixes_synced?: number;
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}`);
  return response.data;
};

export const updateProject = async (
  projectId: string,
  data: {
    name?: string;
    website?: string;
    address?: string;
    phone?: string;
  },
): Promise<{ code: number; message: string; data: any }> => {
  const response = await axios.patch(`/live-seo-fixer/projects/${projectId}`, data);
  return response.data;
};

export const deleteProject = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: any[];
}> => {
  const response = await axios.delete(`/live-seo-fixer/projects/${projectId}`);
  return response.data;
};

// Sitemap and Audit APIs.
export const submitSitemaps = async (
  projectId: string,
  sitemapUrls: string[],
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    total_pages_found: number;
    status: string;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/sitemaps`, {
    sitemap_urls: sitemapUrls,
  });
  return response.data;
};

export const getDiscoveredPages = async (
  projectId: string,
  auditId?: string,
  page: number = 1,
  limit: number = 50,
  search?: string,
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    pages: Array<{
      id: string;
      project_id: string;
      sitemap_id: string;
      url: string;
      title: string;
      discovered_from: string | null;
      last_crawled: string | null;
      created_date: string;
      sitemap_url: string;
      estimated_type: "home" | "service" | "contact" | "location" | "blog" | "other";
      suggested_keywords?: string[];
    }>;
    total_pages: number;
  };
}> => {
  const params: any = { page, limit };
  if (auditId) params.audit_id = auditId;
  if (search) params.search = search;

  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/discovered-pages`, {
    params,
  });
  return response.data;
};

// JavaScript Integration APIs
export const getJSCode = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    project_id: string;
    project_name: string;
    encoded_project_id: string;
    script_url: string;
    script_tag: string;
    stats: {
      total_approved_fixes: number;
      total_applied_fixes: number;
      pending_fixes: number;
      pages_with_fixes: number;
    };
    instructions: {
      step_1: string;
      step_2: string;
      step_3: string;
      step_4: string;
    };
    notes: string[];
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/js-code`);
  return response.data;
};

// Audit Management APIs.
export const startAudit = async (
  projectId: string,
  auditId: string,
  selectedPages: Array<{
    id: string;
    url: string;
    page_type: string;
    target_keyword: string;
  }>,
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    status: string;
    pages_count: number;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/start-audit`, {
    audit_id: auditId,
    selected_pages: selectedPages,
  });
  return response.data;
};

export const getAuditStatus = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    status: string;
    progress_percentage: number;
    pages_completed: number;
    pages_total: number;
    current_step: string;
    estimated_completion: string;
    created_date: string;
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/audit-status`);
  return response.data;
};

export const getAuditResults = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    completed_date: string;
    total_issues: number;
    issues_by_severity: {
      high: number;
      medium: number;
      low: number;
    };
    pages_audited: Array<{
      page_id: string;
      url: string;
      page_type: string;
      target_keyword: string;
      issues_count: number;
      status: string;
    }>;
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/audit-results`);
  return response.data;
};

export const getPageAuditDetails = async (
  projectId: string,
  pageId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    page_id: string;
    url: string;
    page_type: string;
    target_keyword: string;
    last_scanned: string;
    audit_status: string;
    project?: {
      name: string;
    };
    issues: Array<{
      issue_id: string;
      type: string;
      severity: "high" | "medium" | "low";
      message: string;
      current_value: string;
      suggested_fix: string;
      can_auto_fix: boolean;
      fix_status: "pending" | "applied" | "approved" | "rejected";
      fix_value?: string;
      approved?: number;
      content?: string;
      is_merged: boolean;
      sub_issues_count?: number;
      sub_issues?: Array<{
        message: string;
        severity: string;
        suggestion: string;
      }>;
    }>;
    scraped_data: {
      title: string;
      meta_description: string;
      h1_tags: string[];
      images_without_alt: number;
    };
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/pages/${pageId}/audit-details`);
  return response.data;
};

export const updateFixStatus = async (
  projectId: string,
  pageId: string,
  issueId: string,
  fixValue: string,
  approved: boolean,
): Promise<{
  code: number;
  message: string;
  data: {
    fix_id: string;
    issue_id: string;
    fix_value: string;
    approved: number;
    action: string;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/pages/${pageId}/update-fix-status`, {
    issue_id: issueId,
    fix_value: fixValue,
    approved: approved ? 1 : 0,
  });
  return response.data;
};

export const approveFixes = async (
  projectId: string,
  pageId: string,
  approvedFixes: Array<{
    issue_id: string;
    fix_value: string;
  }>,
): Promise<{
  code: number;
  message: string;
  data: {
    approved_count: number;
    applied_count: number;
    failed_count: number;
    results: Array<{
      issue_id: string;
      status: string;
      message: string;
    }>;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/pages/${pageId}/approve-fixes`, {
    approved_fixes: approvedFixes,
  });
  return response.data;
};

export const getProjectAudits = async (
  projectId: string,
  page: number = 1,
  limit: number = 10,
  status?: string,
): Promise<{
  code: number;
  message: string;
  data: {
    audits: Array<{
      id: string;
      project_id: string;
      status: "pending" | "in_progress" | "completed" | "failed";
      created_date: string;
      total_pages: string;
      pages_count: string;
      issues_count: string;
      fixes_count: string;
      approved_fixes_count: string;
      applied_fixes_count: string;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  };
}> => {
  const params: any = { page, limit };
  if (status) params.status = status;

  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/audits`, {
    params,
  });
  return response.data;
};

// New API endpoints for improved flow
export const autoSelectPages = async (
  projectId: string,
  sitemapUrls: string[],
  maxPages: number = 20,
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    selected_pages: Array<{
      page_id: string;
      url: string;
      priority: number;
      sitemap_url: string;
      estimated_type: string;
      suggested_keywords: string[];
    }>;
    total_available: number;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/sitemaps/auto-select`, {
    sitemap_urls: sitemapUrls,
    max_pages: maxPages,
  });
  return response.data;
};

export const getAuditResultsGrouped = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    audit_id: string;
    completed_date: string;
    total_issues: number;
    issues_by_severity: {
      high: number;
      medium: number;
      low: number;
    };
    issues_by_category: {
      title: Array<any>;
      "meta-description": Array<any>;
      h1: Array<any>;
      "alt-tags": Array<any>;
      images: Array<any>;
      schema: Array<any>;
      headings: Array<any>;
    };
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/audit-results-grouped`);
  return response.data;
};

export const applyFixesBulk = async (
  projectId: string,
  fixMode: "all" | "category" | "individual",
  category?: string,
  issueIds?: string[],
): Promise<{
  code: number;
  message: string;
  data: {
    approved_count: number;
    applied_count: number;
    failed_count: number;
    results: Array<{
      issue_id: string;
      status: string;
      message: string;
    }>;
  };
}> => {
  const payload: any = { fix_mode: fixMode };
  if (category) payload.category = category;
  if (issueIds) payload.issue_ids = issueIds;

  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/apply-fixes-bulk`, payload);
  return response.data;
};

export const generateSchemaForProject = async (
  projectId: string,
  pageId: string,
  schemaTypes: string[],
): Promise<{
  code: number;
  message: string;
  data: {
    schemas: Array<{
      type: string;
      schema: any;
      status: string;
    }>;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/pages/${pageId}/generate-schema`, {
    schema_types: schemaTypes,
  });
  return response.data;
};

export const getSchemaForPage = async (
  projectId: string,
  pageId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    page_id: string;
    url: string;
    schemas: Array<{
      id: string;
      type: string;
      schema: any;
      status: "pending" | "approved" | "applied";
      created_date: string;
    }>;
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/pages/${pageId}/schema`);
  return response.data;
};

export const updateSchemaStatus = async (
  projectId: string,
  pageId: string,
  schemaId: string,
  status: "approved" | "rejected",
  schemaData?: any,
): Promise<{
  code: number;
  message: string;
  data: {
    schema_id: string;
    status: string;
  };
}> => {
  const payload: any = { status };
  if (schemaData) payload.schema_data = schemaData;

  const response = await axios.patch(
    `/live-seo-fixer/projects/${projectId}/pages/${pageId}/schema/${schemaId}`,
    payload
  );
  return response.data;
};

// WordPress Integration APIs
export const connectWordPress = async (
  projectId: string,
  wordpressUrl: string,
  apiKey: string,
): Promise<{
  code: number;
  message: string;
  data: {
    connected: boolean;
    wordpress_url: string;
    connection_status: string;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/wordpress/connect`, {
    wordpress_url: wordpressUrl,
    api_key: apiKey,
  });
  return response.data;
};

export const disconnectWordPress = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
}> => {
  const response = await axios.delete(`/live-seo-fixer/projects/${projectId}/wordpress/disconnect`);
  return response.data;
};

export const syncToWordPress = async (
  projectId: string,
  fixIds?: string[],
): Promise<{
  code: number;
  message: string;
  data: {
    synced_count: number;
    failed_count: number;
    results: Array<{
      fix_id: string;
      status: string;
      message: string;
    }>;
  };
}> => {
  const payload: any = {};
  if (fixIds) payload.fix_ids = fixIds;

  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/wordpress/sync`, payload);
  return response.data;
};

export const getWordPressStatus = async (
  projectId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    connected: boolean;
    wordpress_url?: string;
    last_sync?: string;
    total_fixes_synced?: number;
    sync_status?: "pending" | "success" | "error";
    errors?: string[];
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/wordpress/status`);
  return response.data;
};
