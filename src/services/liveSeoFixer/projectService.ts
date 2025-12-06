import axios from "@/api/axiosInstance";
import { ProjectsResponse } from "@/modules/live-seo-fixer/types/Project";

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

// Sitemap and Audit APIs
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
  options?: { category?: string; fix_ids?: string[] },
): Promise<{
  code: number;
  message: string;
  data: {
    applied_count: number;
    success: boolean;
    js_snippet_required: boolean;
    js_snippet?: string;
    results: Array<{
      issue_id: string;
      status: string;
      message: string;
    }>;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/apply-fixes-bulk`, {
    fix_mode: fixMode,
    ...options,
  });
  return response.data;
};

export const getAuditEmailStatus = async (
  projectId: string,
  auditId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    email_sent: boolean;
    email_timestamp: string;
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/audit-email-status`, {
    params: { audit_id: auditId },
  });
  return response.data;
};

// Grouped Audit Results - Category Management APIs
export const getAuditCategories = async (
  projectId: string,
  auditId: string,
): Promise<{
  code: number;
  message: string;
  data: {
    categories: Array<{
      type: string;
      total_issues: number;
      severity_breakdown: {
        critical: number;
        warning: number;
        info: number;
      };
      fix_status: {
        approved: number;
        applied: number;
        pending: number;
      };
    }>;
  };
}> => {
  const response = await axios.get(`/live-seo-fixer/projects/${projectId}/audits/${auditId}/audit-categories`);
  return response.data;
};

export const getCategoryIssues = async (
  projectId: string,
  auditId: string,
  type: string,
  page: number = 1,
  perPage: number = 10,
  filter: "all" | "approved" | "pending" = "all",
): Promise<{
  code: number;
  message: string;
  data: {
    issues: Array<{
      id: number;
      type: string;
      severity: string;
      message: string;
      suggestion: string;
      current_value: string;
      suggested_value: string;
      element: string;
      sub_issues: any;
      page: {
        url: string;
        title: string | null;
        type: string;
        target_keyword: string;
      };
      fix: {
        id: number;
        type: string;
        content: string;
        approved: boolean;
        applied: boolean;
        element: string;
      } | null;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total_items: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
    filter: string;
    category: string;
    audit_id: string;
    value_stats: {
      current: {
        min: number;
        max: number;
        avg: number;
        count: number;
      };
      suggested: {
        min: number;
        max: number;
        avg: number;
        count: number;
      };
      recommended: {
        min: number;
        max: number;
        optimal_min: number;
        optimal_max: number;
        description: string;
      };
    };
  };
}> => {
  const response = await axios.get(
    `/live-seo-fixer/projects/${projectId}/audits/${auditId}/audit-categories/${type}/issues`,
    {
      params: {
        page,
        per_page: perPage,
        filter,
      },
    },
  );
  return response.data;
};

export const updateIssueFix = async (
  projectId: string,
  auditId: string,
  issueId: string,
  fixValue: string,
  approved: boolean,
): Promise<{
  code: number;
  message: string;
  data: {
    id: number;
    type: string;
    content: string;
    approved: boolean;
    applied: boolean;
    element: string;
  };
}> => {
  const response = await axios.put(`/live-seo-fixer/projects/${projectId}/audits/${auditId}/issues/${issueId}/fix`, {
    fix_value: fixValue,
    approved,
  });
  return response.data;
};

export const bulkApproveCategory = async (
  projectId: string,
  auditId: string,
  type: string,
  approved: boolean,
): Promise<{
  code: number;
  message: string;
  data: {
    type: string;
    affected_issues: number;
    approved: boolean;
  };
}> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${projectId}/audits/${auditId}/audit-categories/${type}/approve-all`,
    { approved },
  );
  return response.data;
};

export const regenerateIssueFix = async (
  projectId: string,
  issueId: string,
  forceRegenerate: boolean = true,
): Promise<{
  code: number;
  message: string;
  data: {
    issue_id: string;
    suggested_fix: string;
    ai_generations_used: number;
    ai_generations_limit: number;
  };
}> => {
  const response = await axios.post(`/live-seo-fixer/projects/${projectId}/issues/${issueId}/regenerate`, {
    force_regenerate: forceRegenerate,
  });
  return response.data;
};

export const rollbackCategoryFixes = async (
  projectId: string,
  auditId: string,
  type: string,
  approved: boolean = true,
): Promise<{
  code: number;
  message: string;
  data: {
    type: string;
    affected_issues: number;
    reset_to_original: boolean;
    fixes_removed: number;
  };
}> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${projectId}/audits/${auditId}/audit-categories/${type}/rollback-all`,
    { approved },
  );
  return response.data;
};
