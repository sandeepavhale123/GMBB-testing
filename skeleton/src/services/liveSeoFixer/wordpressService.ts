import axios from "@/api/axiosInstance";

export interface WordPressApiKeyResponse {
  api_key: string;
  expires_at: string | null;
  instructions: string;
}

export interface WordPressConnectionTestResponse {
  success: boolean;
  wordpress_version: string;
  plugin_version: string;
  site_name: string;
}

export interface WordPressConnectionResponse {
  success: boolean;
  connection_id: number;
  status: string;
}

export interface WordPressStatusResponse {
  connected: boolean;
  wordpress_url?: string;
  last_sync?: string;
  total_fixes_synced?: number;
  sync_status?: string;
  errors?: string[];
}

export interface WordPressSyncIssue {
  issue_id: string;
  page_url: string;
  issue_type: string;
  fix_content: string;
  element?: string;
  approved: boolean;
}

export interface WordPressSyncResponse {
  success: boolean;
  synced?: number;
  updated?: number;
  new?: number;
  message: string;
}

export const generateWordPressApiKey = async (projectId: string): Promise<WordPressApiKeyResponse> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${projectId}/wordpress/generate-key`
  );
  // Handle both { data: { api_key } } and { api_key } response structures
  return response.data.data || response.data;
};

export const testWordPressConnection = async (
  projectId: string,
  wordpressUrl: string,
  apiKey: string
): Promise<WordPressConnectionTestResponse> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${projectId}/wordpress/test-connection`,
    { wordpress_url: wordpressUrl, api_key: apiKey }
  );
  return response.data;
};

export const connectWordPress = async (
  projectId: string,
  wordpressUrl: string,
  apiKey: string
): Promise<WordPressConnectionResponse> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${projectId}/wordpress/connect`,
    { wordpress_url: wordpressUrl, api_key: apiKey }
  );
  return response.data;
};

export const disconnectWordPress = async (projectId: string, apiKey: string): Promise<{ success: boolean }> => {
  const response = await axios.delete(
    `/live-seo-fixer/projects/${projectId}/wordpress/disconnect`,
    {
      headers: {
        'X-SEO-Fixer-Key': apiKey
      }
    }
  );
  return response.data;
};

export const getWordPressStatus = async (projectId: string): Promise<WordPressStatusResponse> => {
  const response = await axios.get(
    `/live-seo-fixer/projects/${projectId}/wordpress/status`
  );
  return response.data;
};

export const syncFixToWordPress = async (data: {
  projectId: string;
  auditId: string;
  issue: WordPressSyncIssue;
}): Promise<WordPressSyncResponse> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${data.projectId}/wordpress/sync-fix`,
    {
      audit_id: data.auditId,
      fixes: [data.issue],
    }
  );
  return response.data;
};

export const syncBulkFixesToWordPress = async (data: {
  projectId: string;
  auditId: string;
  categoryType?: string;
}): Promise<WordPressSyncResponse> => {
  const response = await axios.post(
    `/live-seo-fixer/projects/${data.projectId}/wordpress/sync-bulk`,
    {
      audit_id: data.auditId,
      category_type: data.categoryType,
    }
  );
  return response.data;
};
