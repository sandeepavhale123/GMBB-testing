import { Json } from '@/integrations/supabase/types';

export type BotIntent = 'support' | 'sales' | 'appointment' | 'custom';
export type BotStatus = 'draft' | 'published';
export type KnowledgeSourceType = 'website' | 'file' | 'qa' | 'company_info';
export type KnowledgeSourceStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ModelProvider = 'openai' | 'gemini';

// Embed settings type
export interface EmbedSettings {
  bubble_position: 'bottom-right' | 'bottom-left';
  bubble_color: string;
  welcome_message: string;
  chat_height: string;
  chat_width: string;
  // Appearance settings
  header_color?: string;
  user_message_color?: string;
  bot_message_color?: string;
  font_family?: string;
  border_radius?: string;
  show_bot_avatar?: boolean;
  bot_avatar_url?: string;
  display_name?: string;
  input_placeholder?: string;
  // Privacy Policy settings
  privacy_policy_url?: string;
  privacy_policy_name?: string;
}

export const DEFAULT_EMBED_SETTINGS: EmbedSettings = {
  bubble_position: 'bottom-right',
  bubble_color: '#3B82F6',
  welcome_message: 'Hi! How can I help you?',
  chat_height: '600px',
  chat_width: '400px',
  // Appearance defaults
  header_color: '#3B82F6',
  user_message_color: '#3B82F6',
  bot_message_color: '#F3F4F6',
  font_family: 'system-ui',
  border_radius: '12',
  show_bot_avatar: true,
  bot_avatar_url: '',
  display_name: '',
  input_placeholder: 'Type your message...',
  // Privacy Policy defaults
  privacy_policy_url: '',
  privacy_policy_name: 'Privacy Policy',
};

// Bot API Keys (for display only - never show actual keys)
export interface BotApiKeys {
  id?: string;
  bot_id: string;
  has_openai_key: boolean;
  has_gemini_key: boolean;
}

export interface Bot {
  id: string;
  project_id: string | null;
  owner_id: string | null;
  name: string;
  intent: BotIntent | null;
  system_prompt: string | null;
  user_message_template: string | null;
  model_provider: ModelProvider;
  model_name: string;
  is_active: boolean;
  status: BotStatus;
  // RAG configuration
  temperature: number;
  max_tokens: number;
  fallback_message: string | null;
  // Embed security
  allowed_domains: string[];
  is_public: boolean;
  embed_settings: EmbedSettings;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeSource {
  id: string;
  bot_id: string;
  source_type: KnowledgeSourceType;
  title: string;
  content: string | null;
  url: string | null;
  file_url: string | null;
  file_name: string | null;
  char_count: number;
  status: KnowledgeSourceStatus;
  error_message: string | null;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

export interface QAPair {
  id: string;
  knowledge_source_id: string;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface WizardStep {
  number: number;
  title: string;
  completed: boolean;
}

// Company Info structured fields
export interface CompanyInfo {
  id?: string;
  bot_id?: string;
  company_name: string;
  email: string;
  phone_number: string;
  contact_person: string;
  company_address: string;
  logo_url: string;
  company_profile: string;
  established_date: string;
  industry: string;
  product_description: string;
  service_description: string;
  website: string;
  business_hours: string;
  social_media_links: string;
  created_at?: string;
  updated_at?: string;
}

export const EMPTY_COMPANY_INFO: CompanyInfo = {
  company_name: '',
  email: '',
  phone_number: '',
  contact_person: '',
  company_address: '',
  logo_url: '',
  company_profile: '',
  established_date: '',
  industry: '',
  product_description: '',
  service_description: '',
  website: '',
  business_hours: '',
  social_media_links: '',
};

export interface BotWizardFormData {
  name: string;
  intent: BotIntent | null;
  systemPrompt: string;
  userMessageTemplate: string;
  modelProvider: ModelProvider;
  modelName: string;
  knowledgeSources: Partial<KnowledgeSource>[];
  qaPairs: Partial<QAPair>[];
  companyInfo: CompanyInfo;
  // RAG configuration
  temperature: number;
  maxTokens: number;
  fallbackMessage: string;
  // Embed security
  allowedDomains: string[];
  isPublic: boolean;
  embedSettings: EmbedSettings;
  // API Keys (for saving - actual values)
  openaiApiKey?: string;
  geminiApiKey?: string;
}

// System Template interface for saved templates
export interface SystemTemplate {
  id: string;
  project_id?: string;
  name: string;
  systemMessage: string;
  userMessageTemplate: string;
  description: string;
  isDefault?: boolean;
  isBuiltIn?: boolean;
}

// Built-in system templates
export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  {
    id: 'custom',
    name: 'Custom Template',
    systemMessage: '',
    userMessageTemplate: 'Context:\n{context}\n\nUser Question:\n{question}',
    description: 'Write your own custom system message',
    isBuiltIn: true,
  },
  {
    id: 'conversational_lead',
    name: 'Conversational Lead',
    systemMessage: `You are Justin, a sales consultant. Your client interaction strategy consists of three key steps to provide personalized and engaging service:
1st (Inquiry): Begin by asking open-ended questions about the customer's interests and requirements to gather detailed information and understand their needs.
2nd (Tailored Recommendations): Offer recommendations or solutions tailored to the user's specific needs based on their responses.
3rd (Engagement): Keep the conversation flowing by asking for more details, seeking clarification, or suggesting related topics or services.

Important: Ask the user's name, email or phone number, and user's intent at the beginning of the session.
Response Format: Return the response in Markdown format for easy reading by users.`,
    userMessageTemplate: 'Context:\n{context}\n\nUser Question:\n{question}',
    description: 'Sales-focused bot that collects lead information',
    isBuiltIn: true,
  },
  {
    id: 'appointment_booking',
    name: 'Appointment Booking',
    systemMessage: `Your specialized role is as an AI customer service agent, with an additional focus on keeping the conversation flowing by always asking questions or leaving a hook after each answer.

Key responsibilities:
- Help customers book, reschedule, or cancel appointments
- Provide information about available time slots and services
- Collect necessary contact information for appointment confirmation
- Use the provided knowledge base to give accurate responses about services and scheduling

Always maintain a helpful, professional tone and guide users toward booking.`,
    userMessageTemplate: 'Available Services & Schedule:\n{context}\n\nCustomer Request:\n{question}',
    description: 'Appointment scheduling with engagement focus',
    isBuiltIn: true,
  },
  {
    id: 'customer_service',
    name: 'Customer Service',
    systemMessage: `You are a customer service assistant. Answer questions ONLY using the provided business information. 

Guidelines:
- If the answer is not present in the context, say you don't have that information and suggest contacting the business directly
- Do not guess prices, hours, or policies
- Provide concise and accurate answers
- Maintain a helpful and professional tone
- If multiple related pieces of information are available, present them clearly`,
    userMessageTemplate: 'Business Information:\n{context}\n\nCustomer Question:\n{question}',
    description: 'Data-driven support with brief, accurate answers',
    isBuiltIn: true,
  },
  {
    id: 'sales_service',
    name: 'Sales Service',
    systemMessage: `You are a sales consultant. Your approach to client interaction is built on three fundamental steps designed to provide personalized and engaging service:

1. Inquiry: Ask about customer needs, preferences, and budget to understand their requirements
2. Recommendations: Provide tailored product/service suggestions based on their responses
3. Lead Capture: Collect name, email, and purchase intent for follow-up

Always maintain a friendly, professional tone. Focus on understanding customer needs before recommending solutions.
Response Format: Use Markdown for better readability.`,
    userMessageTemplate: 'Products/Services:\n{context}\n\nCustomer Inquiry:\n{question}',
    description: 'Full sales process with lead capture',
    isBuiltIn: true,
  },
];

// Legacy INTENT_TEMPLATES for backward compatibility
export const INTENT_TEMPLATES: Record<BotIntent, { name: string; prompt: string; userMessageTemplate: string; icon: string }> = {
  support: {
    name: 'Customer Support',
    prompt: SYSTEM_TEMPLATES.find(t => t.id === 'customer_service')!.systemMessage,
    userMessageTemplate: SYSTEM_TEMPLATES.find(t => t.id === 'customer_service')!.userMessageTemplate,
    icon: 'Headphones',
  },
  sales: {
    name: 'Sales Assistant',
    prompt: SYSTEM_TEMPLATES.find(t => t.id === 'sales_service')!.systemMessage,
    userMessageTemplate: SYSTEM_TEMPLATES.find(t => t.id === 'sales_service')!.userMessageTemplate,
    icon: 'TrendingUp',
  },
  appointment: {
    name: 'Appointment Booking',
    prompt: SYSTEM_TEMPLATES.find(t => t.id === 'appointment_booking')!.systemMessage,
    userMessageTemplate: SYSTEM_TEMPLATES.find(t => t.id === 'appointment_booking')!.userMessageTemplate,
    icon: 'Calendar',
  },
  custom: {
    name: 'Custom Bot',
    prompt: '',
    userMessageTemplate: 'Context:\n{context}\n\nUser Question:\n{question}',
    icon: 'Bot',
  },
};

export const MODEL_OPTIONS: { provider: ModelProvider; models: { value: string; label: string }[] }[] = [
  {
    provider: 'openai',
    models: [
      { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
      { value: 'gpt-4o', label: 'GPT-4o (Powerful)' },
    ],
  },
  {
    provider: 'gemini',
    models: [
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (Fast)' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (Powerful)' },
    ],
  },
];

export const DEFAULT_USER_MESSAGE_TEMPLATE = 'Context:\n{context}\n\nUser Question:\n{question}';

// ============================================
// Phase 5 & 6: Lead Capture & Appointments
// ============================================

export type LeadTriggerType = 'pre_chat' | 'manual';

export interface LeadFormSettings {
  id?: string;
  bot_id: string;
  enabled: boolean;
  trigger_type: LeadTriggerType;
  form_title: string;
  form_description: string | null;
  collect_name: boolean;
  collect_email: boolean;
  collect_phone: boolean;
  collect_message: boolean;
  name_required: boolean;
  email_required: boolean;
  phone_required: boolean;
  message_required: boolean;
  privacy_policy_url: string | null;
  submit_button_text: string;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_LEAD_SETTINGS: LeadFormSettings = {
  bot_id: '',
  enabled: false,
  trigger_type: 'pre_chat',
  form_title: 'Contact Us',
  form_description: 'Please provide your details to start the conversation.',
  collect_name: true,
  collect_email: true,
  collect_phone: false,
  collect_message: false,
  name_required: true,
  email_required: true,
  phone_required: false,
  message_required: false,
  privacy_policy_url: null,
  submit_button_text: 'Start Chat',
};

export interface BotLead {
  id: string;
  bot_id: string;
  session_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  conversation_snapshot: { role: 'user' | 'assistant'; content: string }[];
  source_url: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface CalendarSettings {
  id?: string;
  bot_id: string;
  enabled: boolean;
  booking_link: string | null;
  trigger_keywords: string[];
  booking_instruction: string | null;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_CALENDAR_SETTINGS: CalendarSettings = {
  bot_id: '',
  enabled: false,
  booking_link: null,
  trigger_keywords: [],
  booking_instruction: 'Would you like to schedule an appointment? Click the link below to book a time that works for you.',
};

export interface BotAppointment {
  id: string;
  bot_id: string;
  session_id: string;
  lead_id: string | null;
  booking_link_clicked: boolean;
  triggered_by_keyword: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  // Joined lead data (optional)
  lead?: BotLead | null;
}
