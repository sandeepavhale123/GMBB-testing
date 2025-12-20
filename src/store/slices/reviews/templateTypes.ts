export interface ReplyTemplate {
  status: number;
  variations: string[];
  isSystem: boolean;
  id: string;
  starRating: number;
  content: string;
  enabled: boolean;
  isRatingOnly?: boolean;
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
  isRatingOnly?: boolean;
}

export interface UpdateTemplateRequest {
  id: string;
  content: string;
  enabled: boolean;
}
export interface AutoReviewReplies {
  enabled: boolean;
  templates: ReplyTemplate[];
  DNR?: boolean;
  autoSettings?: any; // API response type, not ReplyTemplate
  autoAiSettings?: AutoAiSettings;
  review?: LatestReview;
}

export interface AutoAiSettings {
  id: string;
  listingId: number;
  text_reply: string;
  prompt: string;
  customPrompt?: string;
  newStatus: number | string;
  oldStatus: number | string;
  specific_star: string[];
  tone: string;
}

export interface LatestReview {
  id: string;
  pro_photo: string;
  display_name: string;
  star_rating: string;
  review_cdate: string;
  comment: string;
}
export interface AutoResponseSettings {
  enabled: boolean;
  templates: ReplyTemplate[];
  // New fields from API
  DNR?: boolean;
  autoSettings?: AutoReviewReplies;
  autoAiSettings?: AutoAiSettings;
  review?: LatestReview;
}
