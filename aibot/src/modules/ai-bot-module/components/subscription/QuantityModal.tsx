import React, { useState } from 'react';
import { Minus, Plus, Bot } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AbPlan } from '../../types/subscription';

interface QuantityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: AbPlan | null;
  onConfirm: (quantity: number) => void;
  isLoading?: boolean;
}

const QuantityModal: React.FC<QuantityModalProps> = ({
  open,
  onOpenChange,
  plan,
  onConfirm,
  isLoading = false,
}) => {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    onConfirm(quantity);
  };

  const incrementQuantity = () => {
    setQuantity((q) => Math.min(q + 1, 100));
  };

  const decrementQuantity = () => {
    setQuantity((q) => Math.max(q - 1, 1));
  };

  if (!plan) return null;

  const pricePerBot = plan.price_cents / 100;
  const totalPrice = pricePerBot * quantity;
  const billingLabel = plan.billing_period === 'yearly' ? '/year' : '/month';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Select Number of Bots
          </DialogTitle>
          <DialogDescription>
            Choose how many AI chatbots you want to include in your subscription.
            You can add more bots later.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Quantity Selector */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-5 w-5" />
            </Button>
            
            <div className="text-center">
              <span className="text-5xl font-bold">{quantity}</span>
              <p className="text-sm text-muted-foreground mt-1">
                {quantity === 1 ? 'bot' : 'bots'}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 rounded-full"
              onClick={incrementQuantity}
              disabled={quantity >= 100}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Price Breakdown */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per bot</span>
              <span>${pricePerBot.toFixed(2)}{billingLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantity</span>
              <span>×{quantity}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary">${totalPrice.toFixed(2)}{billingLabel}</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Continue to Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default QuantityModal;
