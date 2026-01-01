import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ExternalLink, Download, CheckCircle, XCircle, Clock, Receipt } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface PaymentRecord {
  id: string;
  amount_cents: number;
  currency: string;
  status: string;
  plan_name: string | null;
  plan_type: string | null;
  description: string | null;
  stripe_invoice_url: string | null;
  stripe_receipt_url: string | null;
  created_at: string;
}

const statusConfig: Record<string, { icon: React.ReactNode; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  succeeded: { icon: <CheckCircle className="h-3 w-3" />, variant: 'default' },
  pending: { icon: <Clock className="h-3 w-3" />, variant: 'secondary' },
  failed: { icon: <XCircle className="h-3 w-3" />, variant: 'destructive' },
};

const PaymentHistory: React.FC = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['ab-payment-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ab_payment_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as PaymentRecord[];
    },
  });

  const formatAmount = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>Your payment history will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No payments yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Payment History
        </CardTitle>
        <CardDescription>Your recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {payments.map((payment) => {
            const statusInfo = statusConfig[payment.status] || statusConfig.pending;
            
            return (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {payment.plan_name || payment.description || 'Payment'}
                    </span>
                    <Badge variant={statusInfo.variant} className="gap-1">
                      {statusInfo.icon}
                      {payment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(payment.created_at)}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="font-semibold">
                    {formatAmount(payment.amount_cents, payment.currency)}
                  </span>
                  
                  <div className="flex gap-1">
                    {payment.stripe_invoice_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(payment.stripe_invoice_url!, '_blank')}
                        title="View Invoice"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    {payment.stripe_receipt_url && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => window.open(payment.stripe_receipt_url!, '_blank')}
                        title="Download Receipt"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;
