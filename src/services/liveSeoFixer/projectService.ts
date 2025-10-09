import axiosInstance from "@/api/axiosInstance";
import type {
  Project,
  ProjectsResponse,
  ProjectDetail,
  CreateProjectRequest,
  SitemapRequest,
  PageSelection,
  AuditProgress,
  AuditCategory,
  GroupedIssue,
  DiscoveredPage,
  AuditHistoryItem,
} from "@/modules/live-seo-fixer/types";

const BASE_PATH = "/live-seo-fixer";

export const projectService = {
  async fetchProjects(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<ProjectsResponse> {
    const { data } = await axiosInstance.get(`${BASE_PATH}/projects`, { params });
    return data;
  },

  async createProject(projectData: CreateProjectRequest): Promise<Project> {
    const { data } = await axiosInstance.post(`${BASE_PATH}/projects`, projectData);
    return data.data;
  },

  async getProjectDetails(projectId: string): Promise<ProjectDetail> {
    const { data } = await axiosInstance.get(`${BASE_PATH}/projects/${projectId}`);
    return data.data;
  },

  async updateProjectStatus(projectId: string, status: string): Promise<void> {
    await axiosInstance.patch(`${BASE_PATH}/projects/${projectId}/status`, { status });
  },

  async deleteProject(projectId: string): Promise<void> {
    await axiosInstance.delete(`${BASE_PATH}/projects/${projectId}`);
  },

  async submitSitemaps(projectId: string, sitemaps: string[]): Promise<{ audit_id: string }> {
    const { data } = await axiosInstance.post(`${BASE_PATH}/projects/${projectId}/sitemaps`, {
      sitemaps,
    });
    return data.data;
  },

  async getDiscoveredPages(
    projectId: string,
    auditId: string,
    page: number = 1,
    limit: number = 20,
    search?: string
  ): Promise<{ pages: DiscoveredPage[]; total: number }> {
    const { data } = await axiosInstance.get(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/discovered-pages`,
      {
        params: { page, limit, search },
      }
    );
    return data.data;
  },

  async startAudit(
    projectId: string,
    auditId: string,
    selectedPages: PageSelection[]
  ): Promise<void> {
    await axiosInstance.post(`${BASE_PATH}/projects/${projectId}/audits/${auditId}/start-audit`, {
      pages: selectedPages,
    });
  },

  async getAuditStatus(projectId: string): Promise<AuditProgress> {
    const { data } = await axiosInstance.get(`${BASE_PATH}/projects/${projectId}/audit-status`);
    return data.data;
  },

  async getAuditResults(projectId: string, auditId: string): Promise<GroupedIssue[]> {
    const { data } = await axiosInstance.get(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/audit-results`
    );
    return data.data;
  },

  async getProjectAudits(
    projectId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ): Promise<{ audits: AuditHistoryItem[]; total: number }> {
    const { data } = await axiosInstance.get(`${BASE_PATH}/projects/${projectId}/audits`, {
      params: { page, limit, status },
    });
    return data.data;
  },

  async getAuditCategories(projectId: string, auditId: string): Promise<AuditCategory[]> {
    const { data } = await axiosInstance.get(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/audit-categories`
    );
    return data.data;
  },

  async getCategoryIssues(
    projectId: string,
    auditId: string,
    type: string,
    page: number = 1,
    perPage: number = 10,
    filter?: string
  ): Promise<{ issues: GroupedIssue[]; total: number }> {
    const { data } = await axiosInstance.get(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/audit-categories/${type}/issues`,
      {
        params: { page, per_page: perPage, filter },
      }
    );
    return data.data;
  },

  async updateIssueFix(
    projectId: string,
    auditId: string,
    issueId: string,
    fixValue: string,
    approved: number
  ): Promise<void> {
    await axiosInstance.patch(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/issues/${issueId}/fix`,
      {
        fix_value: fixValue,
        approved,
      }
    );
  },

  async bulkApproveCategory(
    projectId: string,
    auditId: string,
    type: string,
    approved: number
  ): Promise<void> {
    await axiosInstance.post(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/categories/${type}/bulk-approve`,
      { approved }
    );
  },

  async applyFixesBulk(
    projectId: string,
    mode: string,
    options?: { audit_id?: string; category?: string }
  ): Promise<{ applied_count: number }> {
    const { data } = await axiosInstance.post(`${BASE_PATH}/projects/${projectId}/apply-fixes-bulk`, {
      mode,
      ...options,
    });
    return data.data;
  },

  async regenerateIssueFix(
    projectId: string,
    issueId: string,
    forceRegenerate: boolean = false
  ): Promise<{ suggested_value: string }> {
    const { data } = await axiosInstance.post(
      `${BASE_PATH}/projects/${projectId}/issues/${issueId}/regenerate`,
      { force_regenerate: forceRegenerate }
    );
    return data.data;
  },

  async getJSCode(projectId: string): Promise<{ js_code: string }> {
    const { data } = await axiosInstance.get(`${BASE_PATH}/projects/${projectId}/js-code`);
    return data.data;
  },

  async rollbackCategoryFixes(
    projectId: string,
    auditId: string,
    type: string,
    approved: number = 0
  ): Promise<void> {
    await axiosInstance.post(
      `${BASE_PATH}/projects/${projectId}/audits/${auditId}/categories/${type}/rollback`,
      { approved }
    );
  },
};
