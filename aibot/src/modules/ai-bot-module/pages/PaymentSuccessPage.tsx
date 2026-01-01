import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto-redirect after 5 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/module/ai-bot/subscription');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background to-muted/50">
      <Card className="max-w-md w-full text-center shadow-lg">
        <CardHeader className="pb-2">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription className="text-base mt-2">
            Thank you for your purchase. Your subscription is now active.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="text-muted-foreground">
              A confirmation email has been sent to your inbox with your invoice details.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              size="lg"
              onClick={() => navigate('/module/ai-bot/dashboard')}
            >
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/module/ai-bot/subscription')}
            >
              View Subscription Details
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Redirecting to subscription page in {countdown} seconds...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
