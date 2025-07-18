import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

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
  const [feedback, setFeedback] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const isConfirmationValid = confirmationText === 'DELETE';

  const handleConfirm = async () => {
    if (isConfirmationValid) {
      await onConfirm(feedback);
      handleClose();
    }
  };

  const handleClose = () => {
    setFeedback('');
    setConfirmationText('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Cancel Subscription
          </DialogTitle>
          <DialogDescription>
            We're sorry to see you go. Please help us improve by providing feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feedback Section */}
          <div className="space-y-3">
            <Label htmlFor="feedback" className="text-sm font-medium">
              Let us know what made you terminate your server. May be there is something that GMB Briefcase can fix.
            </Label>
            <Textarea
              id="feedback"
              placeholder="Your feedback helps us improve..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {feedback.length}/500 characters
            </p>
          </div>

          {/* Confirmation Section */}
          <div className="space-y-3 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-destructive">
                  Please be sure before deleting your server as all your server data can be lost. The process is irreversible.
                </p>
                <div className="space-y-2">
                  <Label htmlFor="confirmation" className="text-sm">
                    Type <span className="font-mono font-bold">DELETE</span> to confirm:
                  </Label>
                  <Input
                    id="confirmation"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    placeholder="Type DELETE to confirm"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Close
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Unsubscription'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};