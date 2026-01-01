import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AbPlan, AbSubscription, UserPlanLimits, UsageStats, PlanWithUsage } from '../types/subscription';

// Fetch all available plans
export function useAbPlans() {
  return useQuery({
    queryKey: ['ab-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ab_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as AbPlan[];
    },
  });
}

// Fetch user's subscription with plan details
export function useAbSubscription() {
  return useQuery({
    queryKey: ['ab-subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('ab_subscriptions')
        .select(`
          *,
          plan:ab_plans(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      return data as (AbSubscription & { plan: AbPlan }) | null;
    },
  });
}

// Get user's current plan limits using database function
export function useAbPlanLimits() {
  return useQuery({
    queryKey: ['ab-plan-limits'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_user_ab_plan', { p_user_id: user.id });

      if (error) throw error;
      
      // RPC returns an array, get first item or null
      const result = Array.isArray(data) ? data[0] : data;
      return result as UserPlanLimits | null;
    },
  });
}

// Get user's current usage stats
export function useAbUsageStats() {
  return useQuery({
    queryKey: ['ab-usage-stats'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_ab_usage_stats', { p_user_id: user.id });

      if (error) throw error;
      
      const result = Array.isArray(data) ? data[0] : data;
      return result as UsageStats | null;
    },
  });
}

// Combined hook for plan + usage with calculated limits
export function useAbPlanWithUsage(): { 
  data: PlanWithUsage | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const { data: plan, isLoading: planLoading, error: planError, refetch: refetchPlan } = useAbPlanLimits();
  const { data: usage, isLoading: usageLoading, error: usageError, refetch: refetchUsage } = useAbUsageStats();

  const refetch = async () => {
    await Promise.all([refetchPlan(), refetchUsage()]);
  };

  if (planLoading || usageLoading) {
    return { data: null, isLoading: true, error: null, refetch };
  }

  if (planError || usageError) {
    return { data: null, isLoading: false, error: (planError || usageError) as Error, refetch };
  }

  if (!plan || !usage) {
    return { data: null, isLoading: false, error: null, refetch };
  }

  const calculatePercentage = (used: number, max: number) => {
    if (max === 999999 || max === -1) return 0; // Unlimited
    if (max === 0) return 100;
    return Math.min(100, Math.round((used / max) * 100));
  };

  const data: PlanWithUsage = {
    plan,
    usage,
    limits: {
      bots: {
        used: usage.total_bots,
        max: plan.max_bots,
        percentage: calculatePercentage(usage.total_bots, plan.max_bots),
      },
      messages: {
        used: Number(usage.total_messages_this_month),
        max: plan.max_messages_monthly,
        percentage: calculatePercentage(Number(usage.total_messages_this_month), plan.max_messages_monthly),
      },
      training: {
        used: Number(usage.total_training_chars),
        max: plan.max_training_chars_per_bot * plan.max_bots,
        percentage: calculatePercentage(
          Number(usage.total_training_chars), 
          plan.max_training_chars_per_bot * plan.max_bots
        ),
      },
      teamMembers: {
        used: usage.total_team_members,
        max: plan.max_team_members,
        percentage: calculatePercentage(usage.total_team_members, plan.max_team_members),
      },
      workspaces: {
        used: usage.total_workspaces,
        max: plan.max_workspaces,
        percentage: calculatePercentage(usage.total_workspaces, plan.max_workspaces),
      },
    },
  };

  return { data, isLoading: false, error: null, refetch };
}

// Check specific permissions
export function useCanCustomizeAppearance() {
  const { data: plan } = useAbPlanLimits();
  return plan?.can_customize_appearance ?? false;
}

export function useCanRemoveBranding() {
  const { data: plan } = useAbPlanLimits();
  return plan?.can_remove_branding ?? false;
}

export function useIsIntegrationAllowed(integration: string) {
  const { data: plan } = useAbPlanLimits();
  return plan?.allowed_integrations?.includes(integration) ?? false;
}

export function useCanCreateBot() {
  const { data } = useAbPlanWithUsage();
  if (!data) return false;
  return data.usage.total_bots < data.plan.max_bots;
}
