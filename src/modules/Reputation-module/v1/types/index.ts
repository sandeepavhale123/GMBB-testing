export interface FeedbackForm {
  id: string;
  name: string;
  created_at: string;
  feedback_count: number;
  form_url: string;
  logo?: string;
  title: string;
  subtitle: string;
  positive_feedback_url: string;
  positive_feedback_title: string;
  success_title: string;
  success_subtitle: string;
}

export interface FeedbackResponse {
  id: string;
  form_id: string;
  name: string;
  email_or_phone: string;
  comment: string;
  submitted_at: string;
}
