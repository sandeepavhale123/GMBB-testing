import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface UpgradeNowConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  planName: string;
  isProcessing: boolean;
}

export const UpgradeNowConfirmationModal: React.FC<
  UpgradeNowConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, planName, isProcessing }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upgrade Plan</DialogTitle>
          <DialogDescription>
            Are you sure you want to upgrade to the {planName} plan?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Yes, Upgrade"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
