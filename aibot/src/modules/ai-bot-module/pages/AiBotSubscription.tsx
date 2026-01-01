import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles, Zap, Building2, Crown, ArrowLeft, Infinity, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAbPlans, useAbPlanWithUsage } from '../hooks/useAbSubscription';
import { AbPlan, INTEGRATION_NAMES } from '../types/subscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PaymentHistory from '../components/subscription/PaymentHistory';
import QuantityModal from '../components/subscription/QuantityModal';
import ManageSubscriptionCard from '../components/subscription/ManageSubscriptionCard';

const formatPrice = (cents: number, billingPeriod?: string | null) => {
  const amount = cents / 100;
  if (cents === 0) return 'Free';
  if (billingPeriod === 'yearly') return `$${amount}/year`;
  if (billingPeriod === 'monthly') return `$${amount}/month`;
  return `$${amount}`;
};

const formatLimit = (value: number) => {
  if (value === -1 || value >= 999999) return <Infinity className="h-4 w-4 inline" />;
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
  return value.toString();
};

const getPlanIcon = (planType: string, slug: string) => {
  if (slug.includes('agency')) return <Crown className="h-5 w-5" />;
  if (slug.includes('pro')) return <Sparkles className="h-5 w-5" />;
  if (planType === 'ltd') return <Zap className="h-5 w-5" />;
  if (planType === 'recurring') return <Building2 className="h-5 w-5" />;
  return null;
};

const PlanCard: React.FC<{ 
  plan: AbPlan; 
  isCurrentPlan: boolean;
  onSelect: (plan: AbPlan) => void;
  isProcessing?: boolean;
}> = ({ plan, isCurrentPlan, onSelect, isProcessing }) => {
  return (
    <Card className={`relative ${plan.is_popular ? 'border-primary shadow-lg' : ''} ${isCurrentPlan ? 'ring-2 ring-primary' : ''}`}>
      {plan.is_popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
          Most Popular
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 right-4" variant="secondary">
          Current Plan
        </Badge>
      )}
      
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-center gap-2 text-primary">
          {getPlanIcon(plan.plan_type, plan.slug)}
          <CardTitle className="text-lg">{plan.name}</CardTitle>
        </div>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-3xl font-bold">
            {formatPrice(plan.price_cents, plan.billing_period)}
          </span>
          {plan.plan_type === 'ltd' && plan.price_cents > 0 && (
            <span className="text-sm text-muted-foreground ml-1">one-time</span>
          )}
          {plan.plan_type === 'recurring' && (
            <span className="text-sm text-muted-foreground ml-1">per bot</span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Separator />
        
        {/* Limits */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Chatbots</span>
            <span className="font-medium">{formatLimit(plan.max_bots)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Training chars/bot</span>
            <span className="font-medium">{formatLimit(plan.max_training_chars_per_bot)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Messages/month</span>
            <span className="font-medium">{formatLimit(plan.max_messages_monthly)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Team members</span>
            <span className="font-medium">{formatLimit(plan.max_team_members)}</span>
          </div>
        </div>
        
        <Separator />
        
        {/* Features */}
        <ul className="space-y-2 text-sm">
          {plan.features?.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
          {plan.can_customize_appearance && (
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Custom appearance</span>
            </li>
          )}
          {plan.can_remove_branding && (
            <li className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Remove branding</span>
            </li>
          )}
        </ul>
        
        <Button 
          className="w-full" 
          variant={isCurrentPlan ? 'outline' : plan.is_popular ? 'default' : 'secondary'}
          disabled={isCurrentPlan || isProcessing}
          onClick={() => onSelect(plan)}
        >
          {isProcessing ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
          ) : isCurrentPlan ? 'Current Plan' : plan.price_cents === 0 ? 'Get Started' : 'Upgrade'}
        </Button>
      </CardContent>
    </Card>
  );
};

const UsageCard: React.FC<{ 
  title: string; 
  used: number; 
  max: number; 
  percentage: number;
  unit?: string;
}> = ({ title, used, max, percentage, unit = '' }) => {
  const isUnlimited = max === 999999 || max === -1;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{title}</span>
        <span className="font-medium">
          {used.toLocaleString()}{unit} / {isUnlimited ? '∞' : max.toLocaleString()}{unit}
        </span>
      </div>
      <Progress value={isUnlimited ? 0 : percentage} className="h-2" />
    </div>
  );
};

const AiBotSubscription: React.FC = () => {
  const navigate = useNavigate();
  const { data: plans, isLoading: plansLoading } = useAbPlans();
  const { data: planWithUsage, isLoading: usageLoading, refetch } = useAbPlanWithUsage();
  const [processingPlanId, setProcessingPlanId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<AbPlan | null>(null);
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const handleSelectPlan = async (plan: AbPlan) => {
    if (plan.price_cents === 0) {
      toast.info('You are already on the Free plan');
      return;
    }

    // For recurring plans, show quantity modal
    if (plan.plan_type === 'recurring') {
      setSelectedPlan(plan);
      setShowQuantityModal(true);
      return;
    }

    // For LTD plans, go straight to checkout
    await createCheckout(plan.id, 1);
  };

  const createCheckout = async (planId: string, quantity: number) => {
    setProcessingPlanId(planId);
    try {
      const { data, error } = await supabase.functions.invoke('ab-create-checkout', {
        body: { plan_id: planId, quantity },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to start checkout');
      setProcessingPlanId(null);
    }
  };

  const handleQuantityConfirm = (quantity: number) => {
    if (selectedPlan) {
      setShowQuantityModal(false);
      createCheckout(selectedPlan.id, quantity);
    }
  };

  const isLoading = plansLoading || usageLoading;

  // Group plans by type
  const ltdPlans = plans?.filter(p => p.plan_type === 'ltd') || [];
  const recurringPlans = plans?.filter(p => p.plan_type === 'recurring') || [];
  const freePlan = plans?.find(p => p.plan_type === 'free');

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-32 bg-muted rounded" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-96 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">AI Bot Subscription</h1>
          <p className="text-muted-foreground">Manage your plan and usage</p>
        </div>
      </div>

      {/* Current Usage */}
      {planWithUsage && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Plan: {planWithUsage.plan.plan_name}</CardTitle>
                <CardDescription>
                  {planWithUsage.plan.plan_type === 'free' 
                    ? 'Upgrade to unlock more features' 
                    : 'Your subscription is active'}
                </CardDescription>
              </div>
              <Badge variant={planWithUsage.plan.plan_type === 'free' ? 'secondary' : 'default'}>
                {planWithUsage.plan.plan_type.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <UsageCard 
                title="Chatbots" 
                used={planWithUsage.limits.bots.used}
                max={planWithUsage.limits.bots.max}
                percentage={planWithUsage.limits.bots.percentage}
              />
              <UsageCard 
                title="Messages this month" 
                used={planWithUsage.limits.messages.used}
                max={planWithUsage.limits.messages.max}
                percentage={planWithUsage.limits.messages.percentage}
              />
              <UsageCard 
                title="Training characters" 
                used={planWithUsage.limits.training.used}
                max={planWithUsage.limits.training.max}
                percentage={planWithUsage.limits.training.percentage}
              />
              <UsageCard 
                title="Team members" 
                used={planWithUsage.limits.teamMembers.used}
                max={planWithUsage.limits.teamMembers.max}
                percentage={planWithUsage.limits.teamMembers.percentage}
              />
              <UsageCard 
                title="Workspaces" 
                used={planWithUsage.limits.workspaces.used}
                max={planWithUsage.limits.workspaces.max}
                percentage={planWithUsage.limits.workspaces.percentage}
              />
            </div>
            
            {/* Feature access */}
            <div className="mt-6 pt-4 border-t flex flex-wrap gap-3">
              <Badge variant={planWithUsage.plan.can_customize_appearance ? 'default' : 'outline'}>
                {planWithUsage.plan.can_customize_appearance ? '✓' : '✗'} Appearance Customization
              </Badge>
              <Badge variant={planWithUsage.plan.can_remove_branding ? 'default' : 'outline'}>
                {planWithUsage.plan.can_remove_branding ? '✓' : '✗'} Remove Branding
              </Badge>
              {planWithUsage.plan.allowed_integrations?.map(integration => (
                <Badge key={integration} variant="secondary">
                  {INTEGRATION_NAMES[integration] || integration}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Choose Your Plan</h2>
          <p className="text-muted-foreground">Select the plan that best fits your needs</p>
        </div>

        <Tabs defaultValue="ltd" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="ltd">Lifetime Deals</TabsTrigger>
            <TabsTrigger value="recurring">Monthly/Yearly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ltd" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {freePlan && (
                <PlanCard 
                  plan={freePlan} 
                  isCurrentPlan={planWithUsage?.plan.plan_id === freePlan.id}
                  onSelect={handleSelectPlan}
                  isProcessing={processingPlanId === freePlan.id}
                />
              )}
              {ltdPlans.map(plan => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan}
                  isCurrentPlan={planWithUsage?.plan.plan_id === plan.id}
                  onSelect={handleSelectPlan}
                  isProcessing={processingPlanId === plan.id}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="recurring" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {freePlan && (
                <PlanCard 
                  plan={freePlan} 
                  isCurrentPlan={planWithUsage?.plan.plan_id === freePlan.id}
                  onSelect={handleSelectPlan}
                  isProcessing={processingPlanId === freePlan.id}
                />
              )}
              {recurringPlans.map(plan => (
                <PlanCard 
                  key={plan.id} 
                  plan={plan}
                  isCurrentPlan={planWithUsage?.plan.plan_id === plan.id}
                  onSelect={handleSelectPlan}
                  isProcessing={processingPlanId === plan.id}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Per-bot pricing: Purchase additional bots as you need them
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* Integrations comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations by Plan</CardTitle>
          <CardDescription>Connect your chatbot with your favorite tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Integration</th>
                  <th className="text-center py-2 font-medium">Free</th>
                  {ltdPlans.map(plan => (
                    <th key={plan.id} className="text-center py-2 font-medium">{plan.name}</th>
                  ))}
                  <th className="text-center py-2 font-medium">Monthly/Yearly</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(INTEGRATION_NAMES).map(([key, name]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2">{name}</td>
                    <td className="text-center py-2">
                      {freePlan?.allowed_integrations?.includes(key) 
                        ? <Check className="h-4 w-4 text-green-500 mx-auto" />
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                    {ltdPlans.map(plan => (
                      <td key={plan.id} className="text-center py-2">
                        {plan.allowed_integrations?.includes(key)
                          ? <Check className="h-4 w-4 text-green-500 mx-auto" />
                          : <span className="text-muted-foreground">—</span>}
                      </td>
                    ))}
                    <td className="text-center py-2">
                      {recurringPlans[0]?.allowed_integrations?.includes(key)
                        ? <Check className="h-4 w-4 text-green-500 mx-auto" />
                        : <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Manage Subscription */}
      <ManageSubscriptionCard planWithUsage={planWithUsage} onRefresh={refetch} />

      {/* Payment History */}
      <PaymentHistory />

      {/* Quantity Modal */}
      <QuantityModal
        open={showQuantityModal}
        onOpenChange={setShowQuantityModal}
        plan={selectedPlan}
        onConfirm={handleQuantityConfirm}
        isLoading={!!processingPlanId}
      />
    </div>
  );
};

export default AiBotSubscription;
