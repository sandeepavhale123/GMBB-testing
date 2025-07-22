
export interface ReplyTemplate {
  id: string;
  starRating: number;
  content: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AutoResponseSettings {
  enabled: boolean;
  templates: ReplyTemplate[];
}

export interface CreateTemplateRequest {
  starRating: number;
  content: string;
}

export interface UpdateTemplateRequest {
  id: string;
  content: string;
  enabled: boolean;
}
