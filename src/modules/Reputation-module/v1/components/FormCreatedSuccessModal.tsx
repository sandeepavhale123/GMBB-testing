import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface FormCreatedSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formUrl: string;
  formName: string;
}

export const FormCreatedSuccessModal: React.FC<FormCreatedSuccessModalProps> = ({
  open,
  onOpenChange,
  formUrl,
  formName,
}) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Form URL has been copied to clipboard",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToDashboard = () => {
    onOpenChange(false);
    navigate("/module/reputation/v1/dashboard");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">
            🎉 Feedback Form Created Successfully!
          </DialogTitle>
          <DialogDescription>
            Your form "{formName}" has been created. Share the link below with your customers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="form-url">Form URL</Label>
            <div className="flex gap-2">
              <Input
                id="form-url"
                value={formUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => window.open(formUrl, "_blank")}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Click the copy icon to copy the form URL to your clipboard
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCopyUrl}
            className="flex-1"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Link
          </Button>
          <Button
            onClick={handleGoToDashboard}
            className="flex-1"
          >
            Go to Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
