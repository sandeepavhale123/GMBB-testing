import React, { useState } from "react";
import { X, Minus, Plus, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "@/api/axiosInstance";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useI18nNamespace("credits_modal/buyCreditsModal");
  const [credits, setCredits] = useState(2000);
  const [loading, setLoading] = useState(false);
  const PRICE_PER_CREDIT = 0.005; // $0.005 per credit

  const MIN_CREDITS = 2000; // Minimum $10 worth of credits
  const handleIncrement = () => setCredits((prev) => prev + 1000);
  const handleDecrement = () =>
    setCredits((prev) => Math.max(MIN_CREDITS, prev - 1000));
  const totalPrice = (credits * PRICE_PER_CREDIT).toFixed(2);

  const handleBuyNow = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/purchase-topup-credits`,
        {
          quantity: credits,
          successUrl: `${window.location.origin}/verify-topup-credits`,
          cancelUrl: `${window.location.origin}/module/geo-ranking`,
        }
      );

      // ✅ Expecting backend to return Stripe Checkout URL
      const data = response.data;

      if (data.id) {
        // Lazy load Stripe only when needed
        const stripe = await loadStripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
        );

        if (!stripe) {
          throw new Error(t("buyCreditsModal.alert.stripeInitFailed"));
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
        throw new Error(t("buyCreditsModal.alert.noSessionUrl"));
      }
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert(
        error.response?.data?.message ||
          t("buyCreditsModal.alert.paymentFailed")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] p-0">
        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-50"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">
            {t("buyCreditsModal.placeholder.close")}
          </span>
        </button>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-foreground">
              {t("buyCreditsModal.title")}
            </DialogTitle>
          </DialogHeader>

          {/* Credits Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              {t("buyCreditsModal.creditsLabel")}
            </label>
            <div className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3">
              <button
                onClick={handleDecrement}
                disabled={credits <= MIN_CREDITS}
                className={`text-muted-foreground hover:text-foreground focus:outline-none transition-colors ${
                  credits <= MIN_CREDITS ? "opacity-50 cursor-not-allowed" : ""
                }`}
                type="button"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-2xl font-semibold text-foreground">
                {credits}
              </span>
              <button
                onClick={handleIncrement}
                className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                type="button"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-muted/30 border border-dashed border-border rounded-lg py-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">
              {t("buyCreditsModal.priceLabel")}
            </div>
            <div className="text-2xl font-bold text-primary">${totalPrice}</div>
          </div>

          {/* Buy Now Button */}
          <Button
            onClick={handleBuyNow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base rounded-lg"
          >
            {t("buyCreditsModal.buyNowButton")}
          </Button>

          {/* Cancel Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full text-center text-muted-foreground hover:text-foreground font-medium transition-colors"
            type="button"
          >
            {t("buyCreditsModal.cancelButton")}
          </button>

          {/* Stripe Footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Lock className="h-3 w-3" />
            <span>{t("buyCreditsModal.securePayment")}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
