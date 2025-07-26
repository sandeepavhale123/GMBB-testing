export interface ReplyTemplate {
  variations: boolean;
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
  id: string;
  listingId: number;
  starone_reply: string;
  startwo_reply: string;
  starthree_reply: string;
  starfour_reply: string;
  starfive_reply: string;
  starone_wreply: string;
  startwo_wreply: string;
  starthree_wreply: string;
  starfour_wreply: string;
  starfive_wreply: string;
}

export interface AutoAiSettings {
  id: string;
  listingId: number;
  text_reply: string;
  prompt: string;
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
  // New fields from API
  DNR?: boolean;
  autoSettings?: AutoReviewReplies;
  autoAiSettings?: AutoAiSettings;
  review?: LatestReview;
}
