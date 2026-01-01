// AI Bot Subscription Types

export type PlanType = 'free' | 'ltd' | 'recurring';
export type BillingPeriod = 'monthly' | 'yearly' | null;
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'past_due' | 'trialing';

export interface AbPlan {
  id: string;
  name: string;
  slug: string;
  plan_type: PlanType;
  billing_period: BillingPeriod;
  price_cents: number;
  stripe_price_id: string | null;
  
  // Limits
  max_bots: number;
  max_training_chars_per_bot: number;
  max_messages_monthly: number;
  max_team_members: number;
  max_workspaces: number;
  
  // Features
  allowed_integrations: string[];
  can_customize_appearance: boolean;
  can_remove_branding: boolean;
  
  // Metadata
  description: string | null;
  features: string[] | null;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface AbSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  
  // Stripe fields
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  
  // LTD fields
  purchased_at: string | null;
  lifetime_access: boolean;
  
  // Quantity
  quantity: number;
  
  created_at: string;
  updated_at: string;
  
  // Joined data
  plan?: AbPlan;
}

export interface UserPlanLimits {
  plan_id: string;
  plan_name: string;
  plan_type: PlanType;
  max_bots: number;
  max_training_chars_per_bot: number;
  max_messages_monthly: number;
  max_team_members: number;
  max_workspaces: number;
  allowed_integrations: string[];
  can_customize_appearance: boolean;
  can_remove_branding: boolean;
  subscription_status: SubscriptionStatus;
  quantity: number;
}

export interface UsageStats {
  total_bots: number;
  total_messages_this_month: number;
  total_training_chars: number;
  total_team_members: number;
  total_workspaces: number;
}

export interface PlanWithUsage {
  plan: UserPlanLimits;
  usage: UsageStats;
  limits: {
    bots: { used: number; max: number; percentage: number };
    messages: { used: number; max: number; percentage: number };
    training: { used: number; max: number; percentage: number };
    teamMembers: { used: number; max: number; percentage: number };
    workspaces: { used: number; max: number; percentage: number };
  };
}

// Integration names for display
export const INTEGRATION_NAMES: Record<string, string> = {
  webhook: 'Webhook',
  zapier: 'Zapier',
  pabbly: 'Pabbly Connect',
  api: 'REST API',
  woocommerce: 'WooCommerce',
  gohighlevel: 'GoHighLevel',
  'google-sheets': 'Google Sheets',
};

export const ALL_INTEGRATIONS = Object.keys(INTEGRATION_NAMES);
