import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface UnsubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => Promise<void>;
  isLoading?: boolean;
}

export const UnsubscriptionModal: React.FC<UnsubscriptionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const { t } = useI18nNamespace("Settings/unsubscriptionModal");
  const [feedback, setFeedback] = useState("");
  const [confirmationText, setConfirmationText] = useState("");

  const isConfirmationValid = confirmationText === "DELETE";

  const handleConfirm = async () => {
    if (isConfirmationValid) {
      await onConfirm(feedback);
      handleClose();
    }
  };

  const handleClose = () => {
    setFeedback("");
    setConfirmationText("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {t("unsubscriptionModal.title")}
          </DialogTitle>
          <DialogDescription>
            {t("unsubscriptionModal.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feedback Section */}
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-sm font-medium">
              {t("unsubscriptionModal.feedbackLabel")}
            </Label>
            <Textarea
              id="feedback"
              placeholder={t("unsubscriptionModal.feedbackPlaceholder")}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {t("unsubscriptionModal.feedbackCounter", {
                count: feedback.length,
              })}
              {/* {feedback.length}/500 characters */}
            </p>
          </div>

          {/* Confirmation Section */}
          <div className="space-y-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">
                  {t("unsubscriptionModal.warningMessage")}
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirmation" className="text-sm">
                    {t("unsubscriptionModal.confirmationLabelp1")}{" "}
                    <span className="font-mono font-bold">
                      {t("unsubscriptionModal.confirmationLabelp2")}
                    </span>
                    {t("unsubscriptionModal.confirmationLabelp3")}
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder={t(
                      "unsubscriptionModal.confirmationPlaceholder"
                    )}
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t("unsubscriptionModal.closeButton")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
          >
            {isLoading
              ? t("unsubscriptionModal.processing")
              : t("unsubscriptionModal.confirmButton")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
