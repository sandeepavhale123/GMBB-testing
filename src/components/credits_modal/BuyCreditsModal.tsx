import React, { useState } from "react";
import { X, Minus, Plus, Lock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BuyCreditsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ open, onOpenChange }) => {
  const [credits, setCredits] = useState(1000);
  const PRICE_PER_CREDIT = 0.005; // $0.005 per credit

  const handleIncrement = () => setCredits((prev) => prev + 1000);
  const handleDecrement = () => setCredits((prev) => Math.max(1000, prev - 1000));
  const totalPrice = (credits * PRICE_PER_CREDIT).toFixed(2);

  const handleBuyNow = () => {
    // TODO: Integrate with payment system
    console.log(`Purchasing ${credits} credits for $${totalPrice}`);
    onOpenChange(false);
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
          <span className="sr-only">Close</span>
        </button>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-foreground">Buy Top-Up Credits</DialogTitle>
          </DialogHeader>

          {/* Credits Input Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Credits</label>
            <div className="flex items-center justify-between bg-background border border-border rounded-lg px-4 py-3">
              <button
                onClick={handleDecrement}
                className="text-muted-foreground hover:text-foreground focus:outline-none transition-colors"
                type="button"
              >
                <Minus className="h-5 w-5" />
              </button>
              <span className="text-2xl font-semibold text-foreground">{credits}</span>
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
            <div className="text-sm text-muted-foreground mb-1">Price:</div>
            <div className="text-2xl font-bold text-primary">${totalPrice}</div>
          </div>

          {/* Buy Now Button */}
          <Button
            onClick={handleBuyNow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 text-base rounded-lg"
          >
            Buy Now
          </Button>

          {/* Cancel Button */}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full text-center text-muted-foreground hover:text-foreground font-medium transition-colors"
            type="button"
          >
            Cancel
          </button>

          {/* Stripe Footer */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
            <Lock className="h-3 w-3" />
            <span>Secure payment processed by Stripe</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
