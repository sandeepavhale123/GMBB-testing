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
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  const { t } = useI18nNamespace("Settings/upgradeNowConfirmationModal");
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("upgradeNowConfirmationModal.title")}</DialogTitle>
          <DialogDescription>
            {t("upgradeNowConfirmationModal.description", { planName })}
            {/* Are you sure you want to upgrade to the {planName} plan? */}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            {t("upgradeNowConfirmationModal.cancelButton")}
          </Button>
          <Button onClick={onConfirm} disabled={isProcessing}>
            {isProcessing
              ? t("upgradeNowConfirmationModal.processing")
              : t("upgradeNowConfirmationModal.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
