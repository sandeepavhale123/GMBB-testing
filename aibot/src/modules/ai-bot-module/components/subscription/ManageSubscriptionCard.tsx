import React, { useState } from 'react';
import { CreditCard, Plus, XCircle, RefreshCw, ExternalLink, Loader2, Infinity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PlanWithUsage } from '../../types/subscription';

interface ManageSubscriptionCardProps {
  planWithUsage: PlanWithUsage | null;
  onRefresh: () => void;
}

const ManageSubscriptionCard: React.FC<ManageSubscriptionCardProps> = ({
  planWithUsage,
  onRefresh,
}) => {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  if (!planWithUsage) return null;

  const { plan } = planWithUsage;
  const isFreePlan = plan.plan_type === 'free';
  const isLtdPlan = plan.plan_type === 'ltd';
  const isRecurringPlan = plan.plan_type === 'recurring';
  const isCancelled = plan.subscription_status === 'cancelled';

  const handleAction = async (action: string, quantity?: number) => {
    setIsLoading(action);
    try {
      const { data, error } = await supabase.functions.invoke('ab-manage-subscription', {
        body: { action, quantity },
      });

      if (error) throw error;

      if (action === 'portal' && data?.url) {
        window.open(data.url, '_blank');
      } else {
        toast.success(data?.message || 'Action completed successfully');
        onRefresh();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to perform action');
    } finally {
      setIsLoading(null);
    }
  };

  if (isFreePlan) {
    return null; // Don't show management card for free plan
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Manage Subscription
        </CardTitle>
        <CardDescription>
          {isLtdPlan ? 'Your lifetime subscription details' : 'Manage your recurring subscription'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Plan Summary */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">{plan.plan_name}</span>
            <Badge variant={isCancelled ? 'destructive' : 'default'}>
              {isCancelled ? 'Cancelling' : 'Active'}
            </Badge>
          </div>
          
          {isRecurringPlan && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bots included</span>
              <span className="font-medium">{plan.quantity} {plan.quantity === 1 ? 'bot' : 'bots'}</span>
            </div>
          )}
          
          {isLtdPlan && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Max bots</span>
              <span className="font-medium flex items-center gap-1">
                {plan.max_bots >= 999999 ? <Infinity className="h-4 w-4" /> : plan.max_bots}
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-2">
          {/* Add Bots - Recurring only */}
          {isRecurringPlan && !isCancelled && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAction('add_bots', 1)}
              disabled={!!isLoading}
            >
              {isLoading === 'add_bots' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add More Bots
            </Button>
          )}

          {/* Billing Portal */}
          {!isLtdPlan && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAction('portal')}
              disabled={!!isLoading}
            >
              {isLoading === 'portal' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ExternalLink className="h-4 w-4 mr-2" />
              )}
              Billing Portal
            </Button>
          )}

          {/* Resume Subscription */}
          {isRecurringPlan && isCancelled && (
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => handleAction('resume')}
              disabled={!!isLoading}
            >
              {isLoading === 'resume' ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Resume Subscription
            </Button>
          )}

          {/* Cancel Subscription */}
          {isRecurringPlan && !isCancelled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  disabled={!!isLoading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Subscription
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your subscription will remain active until the end of your current billing period.
                    After that, you'll be moved to the Free plan with limited features.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleAction('cancel')}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isLoading === 'cancel' ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : null}
                    Cancel Subscription
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {isLtdPlan && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            Lifetime deals cannot be cancelled or refunded.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageSubscriptionCard;
