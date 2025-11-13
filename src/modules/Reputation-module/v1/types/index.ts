// API Request/Response Types
export interface GetAllFeedbackFormsRequest {
  search: string;
  page: number;
  limit: number;
}

export interface FeedbackFormApiResponse {
  id: string;
  formName: string;
  formId: string;
  totalResponses: string;
  avgRating: string;
  created_at: string;
  formUrl: string;
}

export interface GetAllFeedbackFormsResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    per_page: number;
    total_records: number;
    total_pages: number;
    data: FeedbackFormApiResponse[];
    summary?: {
      total_forms: number;
      total_feedback: number;
      total_feedback_this_month: number;
      average_rating: number;
    };
  };
}

export interface FeedbackForm {
  id: string;
  form_id?: string;
  name: string;
  created_at: string;
  feedback_count: number;
  avg_rating?: number;
  form_url: string;
  logo?: string;
  title?: string;
  subtitle?: string;
  positive_feedback_url?: string;
  positive_feedback_title?: string;
  success_title?: string;
  success_subtitle?: string;
}

export interface FeedbackResponse {
  id: string;
  form_id: string;
  name: string;
  email_or_phone: string;
  comment: string;
  star_rating: number;
  submitted_at: string;
}

export interface DeleteFeedbackFormRequest {
  formId: string;
}

export interface DeleteFeedbackFormResponse {
  code: number;
  message: string;
  data: {
    formId: string;
    responsesDeleted: number;
    status: string;
  };
}

// Feedback Response Stats API Types
export interface GetFeedbackResponseStatsRequest {
  formId: string;
}

export interface GetFeedbackResponseStatsResponse {
  code: number;
  message: string;
  data: {
    feedbackForm: {
      id: string;
      formName: string;
      formId: string;
      formUrl: string;
      logo: string;
      title: string;
      subtitle: string;
      positiveThreshold: number;
      totalResponses: number;
      avgRating: number;
    };
    sentiment: {
      total: number;
      positive: {
        count: number;
        percent: number;
      };
      neutral: {
        count: number;
        percent: number;
      };
      negative: {
        count: number;
        percent: number;
      };
    };
  };
}

// Feedback Details API Types (Table Data Only)
export interface GetFeedbackDetailsRequest {
  formId: string;
  search: string;
  starRating: string;
  page: number;
  limit: number;
}

export interface FeedbackDetailResponse {
  id: string;
  name: string;
  email: string;
  starRating: string;
  form_data: {
    name: string;
    email: string;
    comment: string;
    [key: string]: any;
  };
  created_at: string;
}

export interface GetFeedbackDetailsResponse {
  code: number;
  message: string;
  data: {
    pagination: {
      current_page: number;
      per_page: number;
      total_records: number;
      total_pages: number;
    };
    feedbackResponses: FeedbackDetailResponse[];
  };
}
