import React, { useState } from "react";
import { Copy, ExternalLink, Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CopyUrlModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportUrl: string;
}

export const CopyUrlModal: React.FC<CopyUrlModalProps> = ({
  open,
  onOpenChange,
  reportUrl,
}) => {
  const [copied, setCopied] = useState(false);
  const pathname = location.pathname;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(reportUrl, "_blank");
  };

  const handleClose = () => {
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Report Generated Successfully</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="report-url">Shareable Report URL</Label>
            <div className="flex gap-2">
              <Input
                id="report-url"
                value={reportUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleOpenInNewTab}
              className="flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open in New Tab
            </Button>
            <Button onClick={handleClose}>Done</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
