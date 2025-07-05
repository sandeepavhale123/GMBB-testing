import React, { useEffect, useState } from "react";
import { Check, X, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "@/hooks/use-toast";
import axiosInstance from "@/api/axiosInstance";
import { isSubscriptionExpired } from "@/utils/subscriptionUtil";
import { UpgradeNowConfirmationModal } from "./UpgradeConfirmationModal";

// ⚠️ Load Stripe publishable key from .env
const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);
console.log(
  "stripe promise......",
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);
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
    enterprise: 400,
  },
  {
    name: "KW Rank Check P/day",
    business: 600,
    pro: 1000,
    agency: 1500,
    enterprise: 2000,
  },
  {
    name: "Organic KW listing",
    business: 20,
    pro: 20,
    agency: 20,
    enterprise: 20,
  },
  {
    name: "GEO KW Check",
    business: "Unlimited",
    pro: "Unlimited",
    agency: "Unlimited",
    enterprise: "Unlimited",
  },
  {
    name: "Add Team",
    business: true,
    pro: true,
    agency: true,
    enterprise: true,
  },
  {
    name: "White Label Report",
    business: false,
    pro: true,
    agency: true,
    enterprise: true,
  },
  {
    name: "White Label Subdomain",
    business: false,
    pro: true,
    agency: true,
    enterprise: true,
  },
];
const plans = [
  {
    id: "52",
    name: "Business",
    price: 99,
    color: "bg-blue-500",
    popular: false,
  },
  {
    id: "53",
    name: "Pro",
    price: 199,
    color: "bg-blue-600",
    popular: true,
  },
  {
    id: "54",
    name: "Agency",
    price: 299,
    color: "bg-blue-700",
    popular: false,
  },
  {
    id: "55",
    name: "Enterprise",
    price: 560,
    color: "bg-blue-800",
    popular: false,
  },
];
export const SubscriptionPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [planExpDate, setPlanExpDate] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(
    null
  );
  const renderFeatureValue = (value: boolean | number | string) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-red-400 mx-auto" />
      );
    }
    return <span className="text-sm font-medium text-gray-900">{value}</span>;
  };
  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await axiosInstance.get("/get-user-profile");
        console.log(
          "user data from user profile",
          response.data.data.profileDetails
        );
        const { planId, planExpDate, planName } =
          response.data.data.profileDetails;
        if (planId) {
          setActivePlanId(planId);
        }
        if (planExpDate) {
          setPlanExpDate(planExpDate);
          const expired = isSubscriptionExpired(planExpDate);
          setIsExpired(expired);
          console.log("Plan expiration check:", {
            planExpDate,
            isExpired: expired,
            planId,
          });
        }
      } catch (error) {
        console.error("Failed to fetch user plan:", error);
      }
    };
    fetchUserPlan();
  }, []);
  const isPlanActive = (planId: string) => {
    return activePlanId === planId && !isExpired;
  };
  console.log("active plan id", activePlanId);
  const hasActivePlan = () => {
    return (
      typeof activePlanId === "string" && activePlanId !== "0" && !isExpired
    );
  };
  console.log("Has active plan", hasActivePlan());
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits
    return `${day}/${month}/${year}`;
  };
  const getButtonText = (planId: string) => {
    if (isPlanActive(planId)) {
      return "Active";
    }
    if (isProcessing === planId) {
      return "Processing...";
    }
    console.log("planid", planId);
    console.log("active plan ", isPlanActive(planId));
    // Show "Pay Now" if no active plan, "Upgrade Now" if there's an active plan
    return hasActivePlan()
      ? isPlanActive(planId)
        ? "Active"
        : "Upgrade Now"
      : "Pay Now";
  };
  const getButtonClass = (planId: string, planColor: string) => {
    if (isPlanActive(planId)) {
      return "w-full bg-green-700 text-white";
    }
    return `w-full ${planColor} hover:opacity-90 text-white`;
  };
  const handleButtonClick = (planId: string) => {
    if (isPlanActive(planId)) return;
    if (hasActivePlan()) {
      // Show upgrade confirmation modal
      setSelectedUpgradePlan(planId);
      setShowUpgradeModal(true);
    } else {
      // Call pay now for new subscriptions
      handlePayNow(planId);
    }
  };
  const handlePayNow = async (planId: string) => {
    setIsProcessing(planId);
    setSelectedPlan(planId);
    try {
      // Here you would integrate with your payment system
      console.log(`Selected plan: ${planId}`);

      // Call custom backend API to create subscription
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/create-subscription`,
        {
          planId: planId,
          successUrl: `${window.location.origin}/verify-payment`,
          cancelUrl: `${window.location.origin}/settings/subscription`,
        }
      );
      const data = response.data;
      console.log("response from the backend", response.data);
      if (data.id) {
        // Get Stripe instance and redirect to checkout
        const stripe = await stripePromise;
        console.log("stripe key", stripe);
        if (!stripe) {
          throw new Error("Stripe failed to initialize");
        }
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });
        if (error) {
          throw new Error(error.message);
        }
      } else if (data.url) {
        // Fallback: Direct redirect to Stripe Checkout URL
        window.location.href = data.url;
      } else {
        throw new Error("No checkout session or URL received");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
      setSelectedPlan(null);
    }
  };
  const handleUpgradeConfirm = async () => {
    if (!selectedUpgradePlan) return;
    setIsProcessing(selectedUpgradePlan);
    setShowUpgradeModal(false);
    try {
      // console.log(`Upgrading to plan: ${selectedUpgradePlan}`);

      // Send upgrade request to backend
      const response = await axiosInstance.post("/update-subscription", {
        planId: selectedUpgradePlan,
      });
      console.log("response message on upgrade", response);

      toast({
        title: "Upgrade Successful",
        description: response.data?.message,
      });

      // Refresh user plan data
      const userResponse = await axiosInstance.get("/get-user-profile");
      const { planId, planExpDate } = userResponse.data.data.profileDetails;
      if (planId) {
        setActivePlanId(planId);
      }
      if (planExpDate) {
        setPlanExpDate(planExpDate);
        setIsExpired(isSubscriptionExpired(planExpDate));
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast({
        title: "Upgrade Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to upgrade plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
      setSelectedUpgradePlan(null);
    }
  };
  const handleUpgradeCancel = () => {
    setShowUpgradeModal(false);
    setSelectedUpgradePlan(null);
  };
  const getSelectedPlanName = () => {
    const plan = plans.find((p) => p.id === selectedUpgradePlan);
    return plan ? plan.name : "";
  };
  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Subscription Plans
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Choose the perfect plan for your business needs. Upgrade or downgrade
          at any time.
        </p>
        {/* Show expiration status if user has a plan */}
        {activePlanId && planExpDate && (
          <div
            className={`mt-4 p-3 rounded-lg ${
              isExpired
                ? "bg-red-50 border border-red-200"
                : "bg-green-50 border border-green-200"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                isExpired ? "text-red-800" : "text-green-800"
              }`}
            >
              {isExpired
                ? `Your plan expired on ${formatDate(
                    planExpDate
                  )}. Please renew to continue accessing features.`
                : `Your plan is active until ${formatDate(planExpDate)}.`}
            </p>
          </div>
        )}
      </div>

      <Tabs defaultValue="pricing-plan" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
          <TabsTrigger value="pricing-plan" className="text-sm sm:text-base">Pricing Plan</TabsTrigger>
          <TabsTrigger value="payment-history" className="text-sm sm:text-base">Payment History</TabsTrigger>
        </TabsList>

        <TabsContent value="pricing-plan" className="space-y-6">
          {/* Mobile Plan Cards - visible on small screens */}
          <div className="block lg:hidden space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden">
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-orange-500 text-white text-xs z-10">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className={`${plan.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                        {plan.name}
                        {plan.popular && <Crown className="w-4 h-4" />}
                      </CardTitle>
                      <div className="text-2xl sm:text-3xl font-bold mt-2">
                        ${plan.price}
                        <span className="text-sm font-normal opacity-80">/PM</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 mb-6">
                    {planFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-700 flex-1">
                          {feature.name}
                        </span>
                        <div className="ml-3">
                          {renderFeatureValue(feature[plan.name.toLowerCase() as keyof PlanFeature])}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={() => handleButtonClick(plan.id)}
                    className={getButtonClass(plan.id, plan.color)}
                    disabled={isPlanActive(plan.id) || isProcessing === plan.id}
                    size="lg"
                  >
                    {getButtonText(plan.id)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Pricing Table - hidden on small screens */}
          <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Header Row */}
            <div className="grid grid-cols-5 bg-gray-50 border-b border-gray-200">
              <div className="p-4 font-semibold text-gray-900 flex items-center">
                Features
              </div>
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  className="p-4 text-center relative min-h-[120px] flex flex-col justify-between"
                >
                  <div className="absolute inset-0 flex flex-col">
                    <div
                      className={`${plan.color} text-white py-3 px-4 flex-1 flex items-center justify-center`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="font-semibold text-lg">
                          {plan.name}
                        </span>
                        {plan.popular && <Crown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                  {plan.popular && (
                    <Badge className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs z-10">
                      Most Popular
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-5 border-b border-gray-200 bg-white">
              <div className="p-4 font-medium text-gray-700">Price/PM</div>
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-sm font-normal text-gray-500">
                      /PM
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Rows */}
            {planFeatures.map((feature, index) => (
              <div
                key={index}
                className="grid grid-cols-5 border-b border-gray-200 hover:bg-gray-50"
              >
                <div className="p-4 text-sm text-gray-700 font-medium">
                  {feature.name}
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  {renderFeatureValue(feature.business)}
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  {renderFeatureValue(feature.pro)}
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  {renderFeatureValue(feature.agency)}
                </div>
                <div className="p-4 text-center flex items-center justify-center">
                  {renderFeatureValue(feature.enterprise)}
                </div>
              </div>
            ))}

            {/* Action Buttons Row */}
            <div className="grid grid-cols-5 bg-gray-50">
              <div className="p-4"></div>
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 text-center">
                  <Button
                    onClick={() => handleButtonClick(plan.id)}
                    className={getButtonClass(plan.id, plan.color)}
                    disabled={isPlanActive(plan.id) || isProcessing === plan.id}
                  >
                    {getButtonText(plan.id)}
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
              Contact our sales team to find the perfect plan for your business
              needs.
            </p>
            <Button
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
              onClick={() => window.open('https://gmbbriefcase.com/contact/', '_blank')}
            >
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
                  Your payment history will appear here once you make your first
                  payment.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upgrade Confirmation Modal */}
      <UpgradeNowConfirmationModal
        isOpen={showUpgradeModal}
        onClose={handleUpgradeCancel}
        onConfirm={handleUpgradeConfirm}
        planName={getSelectedPlanName()}
        isProcessing={isProcessing === selectedUpgradePlan}
      />
    </div>
  );
};
