import { v4 as uuidv4 } from "uuid";

// Keys for localStorage
const FEEDBACK_FORMS_KEY = "feedback_forms";
const FEEDBACK_RESPONSES_KEY = "feedback_responses";

export interface FeedbackFormData {
  id: string;
  name: string;
  logo: string;
  title: string;
  subtitle: string;
  positive_rating_threshold: number;
  positive_feedback_title: string;
  positive_feedback_urls: Record<string, string>;
  success_title: string;
  success_subtitle: string;
  form_fields: any[];
  created_at: string;
  feedback_count: number;
  form_url: string;
}

export interface FeedbackResponseData {
  id: string;
  form_id: string;
  star_rating: number;
  name: string;
  email_or_phone: string;
  comment: string;
  responses: Record<string, any>;
  submitted_at: string;
}

// Save feedback form template
export const saveFeedbackForm = (formData: Omit<FeedbackFormData, "id" | "created_at" | "feedback_count" | "form_url">): FeedbackFormData => {
  const forms = getFeedbackForms();
  const id = uuidv4();
  const newForm: FeedbackFormData = {
    id,
    ...formData,
    created_at: new Date().toISOString(),
    feedback_count: 0,
    form_url: `${window.location.origin}/review/feedback-form/${id}`,
  };
  forms.push(newForm);
  localStorage.setItem(FEEDBACK_FORMS_KEY, JSON.stringify(forms));
  return newForm;
};

// Get all feedback forms
export const getFeedbackForms = (): FeedbackFormData[] => {
  const forms = localStorage.getItem(FEEDBACK_FORMS_KEY);
  return forms ? JSON.parse(forms) : [];
};

// Get single feedback form by ID
export const getFeedbackFormById = (id: string): FeedbackFormData | undefined => {
  const forms = getFeedbackForms();
  return forms.find((form) => form.id === id);
};

// Save feedback response
export const saveFeedbackResponse = (
  formId: string,
  responseData: Omit<FeedbackResponseData, "id" | "form_id" | "submitted_at">
): FeedbackResponseData => {
  const responses = getFeedbackResponses();
  const newResponse: FeedbackResponseData = {
    id: uuidv4(),
    form_id: formId,
    ...responseData,
    submitted_at: new Date().toISOString(),
  };
  responses.push(newResponse);
  localStorage.setItem(FEEDBACK_RESPONSES_KEY, JSON.stringify(responses));

  // Update form's feedback_count
  updateFeedbackCount(formId);
  return newResponse;
};

// Get all responses or responses for specific form
export const getFeedbackResponses = (formId?: string): FeedbackResponseData[] => {
  const responses = localStorage.getItem(FEEDBACK_RESPONSES_KEY);
  const allResponses: FeedbackResponseData[] = responses ? JSON.parse(responses) : [];
  return formId ? allResponses.filter((r) => r.form_id === formId) : allResponses;
};

// Update feedback count for a form
const updateFeedbackCount = (formId: string): void => {
  const forms = getFeedbackForms();
  const formIndex = forms.findIndex((f) => f.id === formId);
  if (formIndex !== -1) {
    forms[formIndex].feedback_count = getFeedbackResponses(formId).length;
    localStorage.setItem(FEEDBACK_FORMS_KEY, JSON.stringify(forms));
  }
};

// Delete feedback form
export const deleteFeedbackForm = (id: string): void => {
  const forms = getFeedbackForms().filter((f) => f.id !== id);
  localStorage.setItem(FEEDBACK_FORMS_KEY, JSON.stringify(forms));
  
  // Also delete associated responses
  const responses = getFeedbackResponses().filter((r) => r.form_id !== id);
  localStorage.setItem(FEEDBACK_RESPONSES_KEY, JSON.stringify(responses));
};
