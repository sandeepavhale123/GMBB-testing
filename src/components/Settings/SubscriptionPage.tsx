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
import { UnsubscriptionModal } from "./UnsubscriptionModal";
import { useProfile } from "@/hooks/useProfile";
import { useAppDispatch } from "@/hooks/useRedux";
import { fetchUserProfile } from "@/store/slices/profileSlice";
import { PaymentHistoryTable } from "./PaymentHistory/PaymentHistoryTable";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface PlanFeature {
  name: string;
  business: boolean | number | string;
  pro: boolean | number | string;
  agency: boolean | number | string;
  enterprise: boolean | number | string;
}

export const SubscriptionPage: React.FC = () => {
  const { t } = useI18nNamespace("Settings/subscriptionPage");

  const planFeatures: PlanFeature[] = [
    {
      name: t("subscriptionPage.planFeature.name1"),
      business: 40,
      pro: 100,
      agency: 200,
      enterprise: 400,
    },
    {
      name: t("subscriptionPage.planFeature.name2"),
      business: 600,
      pro: 1000,
      agency: 1500,
      enterprise: 2000,
    },
    {
      name: t("subscriptionPage.planFeature.name3"),
      business: 20,
      pro: 20,
      agency: 20,
      enterprise: 20,
    },
    {
      name: t("subscriptionPage.planFeature.name4"),
      business: t("subscriptionPage.planFeature.unlmited"),
      pro: t("subscriptionPage.planFeature.unlmited"),
      agency: t("subscriptionPage.planFeature.unlmited"),
      enterprise: t("subscriptionPage.planFeature.unlmited"),
    },
    {
      name: t("subscriptionPage.planFeature.name5"),
      business: true,
      pro: true,
      agency: true,
      enterprise: true,
    },
    {
      name: t("subscriptionPage.planFeature.name6"),
      business: false,
      pro: true,
      agency: true,
      enterprise: true,
    },
    {
      name: t("subscriptionPage.planFeature.name7"),
      business: false,
      pro: true,
      agency: true,
      enterprise: true,
    },
  ];

  const plans = [
    {
      id: "52",
      name: t("subscriptionPage.plans.business"),
      price: 99,
      color: "bg-primary",
      popular: false,
    },
    {
      id: "53",
      name: t("subscriptionPage.plans.pro"),
      price: 199,
      color: "bg-primary",
      popular: true,
    },
    {
      id: "54",
      name: t("subscriptionPage.plans.agency"),
      price: 299,
      color: "bg-primary",
      popular: false,
    },
    {
      id: "55",
      name: t("subscriptionPage.plans.enterprise"),
      price: 560,
      color: "bg-primary",
      popular: false,
    },
  ];

  // Map plan IDs to their corresponding feature keys
  const planIdToFeatureKey: Record<string, keyof PlanFeature> = {
    "52": "business",
    "53": "pro",
    "54": "agency",
    "55": "enterprise",
  };

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [planExpDate, setPlanExpDate] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [selectedUpgradePlan, setSelectedUpgradePlan] = useState<string | null>(
    null
  );
  const [showUnsubscribeModal, setShowUnsubscribeModal] =
    useState<boolean>(false);
  const [isUnsubscribing, setIsUnsubscribing] = useState<boolean>(false);

  // Get profile refresh functions
  const dispatch = useAppDispatch();
  const { profileData } = useProfile();
  const refreshProfileData = async () => {
    // Trigger immediate profile data refresh in Redux store
    dispatch(fetchUserProfile());
  };
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
        const { planId, planExpDate, planName } =
          response.data.data.profileDetails;
        if (planId) {
          setActivePlanId(planId);
        }
        if (planExpDate) {
          setPlanExpDate(planExpDate);
          const expired = isSubscriptionExpired(planExpDate);
          setIsExpired(expired);
        }
      } catch (error) {
        // console.error("Failed to fetch user plan:", error);
      }
    };
    fetchUserPlan();
  }, []);

  // Check for successful payment return and refresh profile data
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get("payment_success");
    if (paymentSuccess === "true") {
      // Payment was successful, refresh profile data immediately
      refreshProfileData();

      // Clean up URL parameters
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);
  const isPlanActive = (planId: string) => {
    return activePlanId === planId && !isExpired;
  };

  const paynowId = ["50", "51", "0", "34", "68", "69", "70"];
  const hasActivePlan = () => {
    return (
      typeof activePlanId === "string" &&
      !paynowId.includes(activePlanId) &&
      !isExpired
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = String(date.getFullYear()); // Last 2 digits
    return `${day}/${month}/${year}`;
  };
  const getButtonText = (planId: string) => {
    if (isPlanActive(planId)) {
      return "Active";
    }
    if (isProcessing === planId) {
      return "Processing...";
    }

    // Show "Pay Now" if no active plan, "Upgrade Now" if there's an active plan
    return hasActivePlan()
      ? isPlanActive(planId)
        ? "Active"
        : t("subscriptionPage.upgrade")
      : t("subscriptionPage.pay");
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

      if (data.id) {
        // Lazy load Stripe only when needed
        const stripe = await loadStripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
        );

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
      // console.error("Payment error:", error);
      toast({
        title: t("subscriptionPage.toast.paymentError.title"),
        description:
          error instanceof Error
            ? error.message
            : t("subscriptionPage.toast.paymentError.description"),
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
      // Send upgrade request to backend
      const response = await axiosInstance.post("/update-subscription", {
        planId: selectedUpgradePlan,
      });

      toast({
        title: t("subscriptionPage.toast.upgradeSuccess.title"),
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

      // Trigger immediate profile refresh for sidebar update
      await refreshProfileData();
    } catch (error) {
      // console.error("Upgrade error:", error);
      toast({
        title: t("subscriptionPage.toast.upgradeError.title"),
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("subscriptionPage.toast.upgradeError.description"),
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
  const handleCancelSubscription = async (feedback: string) => {
    setIsUnsubscribing(true);
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/cancel-subscription`,
        {
          isDelete: "delete",
          feedback: feedback,
        }
      );
      toast({
        title: t("subscriptionPage.toast.subscriptionCancelled.title"),
        description:
          response.data?.message ||
          t("subscriptionPage.toast.subscriptionCancelled.description"),
      });

      // Optionally refresh state
      setActivePlanId(null);
      setPlanExpDate(null);
      setIsExpired(false);

      // Trigger immediate profile refresh for sidebar update
      await refreshProfileData();
    } catch (error: any) {
      // console.error("Cancel subscription error:", error);
      toast({
        title: t("subscriptionPage.toast.cancelError.title"),
        description:
          error?.response?.data?.message ||
          t("subscriptionPage.toast.cancelError.description"),
        variant: "destructive",
      });
    } finally {
      setIsUnsubscribing(false);
    }
  };
  const handleUnsubscribeClick = () => {
    setShowUnsubscribeModal(true);
  };
  const handleUnsubscribeCancel = () => {
    setShowUnsubscribeModal(false);
  };
  const getSelectedPlanName = () => {
    const plan = plans.find((p) => p.id === selectedUpgradePlan);
    return plan ? plan.name : "";
  };
  return (
    <div className="p-4 sm:p-6 xxl:max-w-6xl mx-auto pb-[100px] sm:pb-[100px]">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex gap-4  mb-2" style={{ alignItems: "center" }}>
            <h2 className="text-2xl l font-bold text-gray-900 mb-2">
              {t("subscriptionPage.title")}
            </h2>
            {/* Show expiration status if user has a plan */}
            {activePlanId && planExpDate && (
              <div
                className={` p-1 rounded-lg ${
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
                    ? t("subscriptionPage.expiredPlan")
                    : t("subscriptionPage.activePlan", {
                        date: formatDate(planExpDate),
                      })}
                </p>
              </div>
            )}
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            {t("subscriptionPage.description")}
          </p>
        </div>
        {hasActivePlan() && !isExpired && (
          <Button
            variant="destructive"
            onClick={handleUnsubscribeClick}
            className="mt-2 sm:mt-0"
          >
            {t("subscriptionPage.unsubscribe")}
          </Button>
        )}
      </div>

      <Tabs defaultValue="pricing-plan" className="w-full">
        <TabsList className="inline-flex h-auto w-full justify-start rounded-none border-b bg-transparent p-0 mb-6 sm:mb-8">
          <TabsTrigger value="pricing-plan" className="text-sm sm:text-base">
            {t("subscriptionPage.tabs.pricingPlan")}
          </TabsTrigger>
          <TabsTrigger value="payment-history" className="text-sm sm:text-base">
            {t("subscriptionPage.tabs.paymentHistory")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pricing-plan" className="space-y-6">
          {/* Mobile Plan Cards - visible on small screens */}
          <div className="block lg:hidden space-y-4">
            {plans.map((plan) => (
              <Card key={plan.id} className="relative overflow-hidden">
                {plan.popular && (
                  <Badge className="absolute top-4 right-4 bg-orange-500 text-white text-xs ">
                    {t("subscriptionPage.labels.mostPopular")}
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
                        <span className="text-sm font-normal opacity-80">
                          /PM
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 mb-6">
                    {planFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <span className="text-sm font-medium text-gray-700 max-w-[40%] lg:flex-1">
                          {feature.name}
                        </span>
                        <div className="ml-3">
                          {renderFeatureValue(
                            feature[planIdToFeatureKey[plan.id]]
                          )}
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
                {t("subscriptionPage.labels.features")}
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
                    <Badge className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs">
                      {t("subscriptionPage.labels.mostPopular")}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Price Row */}
            <div className="grid grid-cols-5 border-b border-gray-200 bg-white">
              <div className="p-4 font-medium text-gray-700">
                {t("subscriptionPage.labels.pricePerMonth")}
              </div>
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
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-primary mb-2">
              {t("subscriptionPage.help.title")}
            </h3>
            <p className="text-primary/80 text-sm mb-4">
              {t("subscriptionPage.help.description")}
            </p>
            <Button
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10"
              onClick={() =>
                window.open("https://gmbbriefcase.com/contact/", "_blank")
              }
            >
              {t("subscriptionPage.buttons.contactSales")}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="payment-history" className="space-y-6">
          <PaymentHistoryTable />
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

      {/* Unsubscription Modal */}
      <UnsubscriptionModal
        isOpen={showUnsubscribeModal}
        onClose={handleUnsubscribeCancel}
        onConfirm={handleCancelSubscription}
        isLoading={isUnsubscribing}
      />
    </div>
  );
};
