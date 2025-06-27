
import React, { useState } from 'react';
import { Check, X, Crown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface PlanFeature {
  name: string;
  business: boolean | number | string;
  pro: boolean | number | string;
  agency: boolean | number | string;
  enterprise: boolean | number | string;
}

const planFeatures: PlanFeature[] = [
  {
    name: "No.GMB Listings Allowed",
    business: 40,
    pro: 100,
    agency: 200,
    enterprise: 400
  },
  {
    name: "KW Rank Check P/day",
    business: 600,
    pro: 1000,
    agency: 1500,
    enterprise: 2000
  },
  {
    name: "Organic KW listing",
    business: 20,
    pro: 20,
    agency: 20,
    enterprise: 20
  },
  {
    name: "GEO KW Check",
    business: "Unlimited",
    pro: "Unlimited",
    agency: "Unlimited",
    enterprise: "Unlimited"
  },
  {
    name: "Add Team",
    business: true,
    pro: true,
    agency: true,
    enterprise: true
  },
  {
    name: "White Label Report",
    business: false,
    pro: true,
    agency: true,
    enterprise: true
  },
  {
    name: "White Label Subdomain",
    business: false,
    pro: true,
    agency: true,
    enterprise: true
  }
];

const plans = [
  {
    id: 'business',
    name: 'Business',
    price: 99,
    color: 'bg-blue-500',
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    color: 'bg-blue-600',
    popular: true
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 299,
    color: 'bg-blue-700',
    popular: false
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 560,
    color: 'bg-blue-800',
    popular: false
  }
];

export const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const renderFeatureValue = (value: boolean | number | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-red-400" />
      );
    }
    return <span className="text-sm font-medium">{value}</span>;
  };

  const handlePayNow = (planId: string) => {
    setSelectedPlan(planId);
    // Here you would integrate with your payment system
    console.log(`Selected plan: ${planId}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Subscription Plans
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Choose the perfect plan for your business needs. Upgrade or downgrade at any time.
        </p>
      </div>

      <Tabs defaultValue="pricing-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="pricing-plan">Pricing Plan</TabsTrigger>
          <TabsTrigger value="payment-history">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing-plan" className="space-y-6">
          {/* Pricing Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Header Row */}
            <div className="grid grid-cols-6 bg-gray-50 border-b border-gray-200">
              <div className="p-4 font-semibold text-gray-900">
                Features
              </div>
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 text-center relative">
                  <div className={`${plan.color} text-white py-2 px-4 rounded-t-lg -mx-4 -mt-4 mb-2`}>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-semibold">{plan.name}</span>
                      {plan.popular && <Crown className="w-4 h-4" />}
                    </div>
                  </div>
                  {plan.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs">
                      Most Popular
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-6 border-b border-gray-200 bg-white">
              <div className="p-4 font-medium text-gray-700">
                Price/PM
              </div>
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">/PM</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            {planFeatures.map((feature, index) => (
              <div key={index} className="grid grid-cols-6 border-b border-gray-200 hover:bg-gray-50">
                <div className="p-4 text-sm text-gray-700">
                  {feature.name}
                </div>
                <div className="p-4 text-center">
                  {renderFeatureValue(feature.business)}
                </div>
                <div className="p-4 text-center">
                  {renderFeatureValue(feature.pro)}
                </div>
                <div className="p-4 text-center">
                  {renderFeatureValue(feature.agency)}
                </div>
                <div className="p-4 text-center">
                  {renderFeatureValue(feature.enterprise)}
                </div>
              </div>
            ))}

            {/* Action Buttons Row */}
            <div className="grid grid-cols-6 bg-gray-50">
              <div className="p-4"></div>
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 text-center">
                  <Button
                    onClick={() => handlePayNow(plan.id)}
                    className={`w-full ${plan.color} hover:opacity-90 text-white`}
                    disabled={selectedPlan === plan.id}
                  >
                    {selectedPlan === plan.id ? 'Processing...' : 'Pay Now'}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Need Help Choosing?
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Contact our sales team to find the perfect plan for your business needs.
            </p>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
              Contact Sales
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="payment-history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Crown className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Payment History
                </h3>
                <p className="text-gray-600 text-sm">
                  Your payment history will appear here once you make your first payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
