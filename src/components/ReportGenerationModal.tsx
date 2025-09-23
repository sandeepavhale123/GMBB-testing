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
import { Loader2, Copy, ExternalLink, CheckCircle2, XCircle, X } from "lucide-react";
import { toast } from "sonner";

export type ReportType = 'gmb-health' | 'gmb-prospect' | 'citation-audit' | 'geo-ranking';

interface ReportGenerationModalProps {
  open: boolean;
  onClose: () => void;
  reportType: ReportType;
  state: 'loading' | 'success' | 'error';
  reportUrl?: string;
  errorMessage?: string;
  onRetry?: () => void;
}

const reportTypeLabels: Record<ReportType, string> = {
  'gmb-health': 'GMB Health Report',
  'gmb-prospect': 'GMB Prospect Report', 
  'citation-audit': 'Citation Audit Report',
  'geo-ranking': 'GEO Ranking Report',
};

export const ReportGenerationModal: React.FC<ReportGenerationModalProps> = ({
  open,
  onClose,
  reportType,
  state,
  reportUrl,
  errorMessage,
  onRetry,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  
  const reportLabel = reportTypeLabels[reportType];

  const handleCopyUrl = async () => {
    if (!reportUrl) return;
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(reportUrl);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = reportUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      
      setCopySuccess(true);
      toast.success("Report URL copied to clipboard!");
      
      // Reset success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      toast.error("Failed to copy URL to clipboard");
    }
  };

  const handleOpenReport = () => {
    if (reportUrl) {
      window.open(reportUrl, '_blank');
    }
  };

  const handleClose = () => {
    setCopySuccess(false);
    onClose();
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Generating {reportLabel}...</h3>
              <p className="text-sm text-muted-foreground">
                Please wait while we generate your report. This may take a few moments.
              </p>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-green-900">Report Generated Successfully!</h3>
                <p className="text-sm text-muted-foreground">
                  Your {reportLabel.toLowerCase()} has been generated and is ready to view.
                </p>
              </div>
            </div>

            {reportUrl && (
              <div className="space-y-3">
                <Label htmlFor="report-url" className="text-sm font-medium">
                  Report URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="report-url"
                    value={reportUrl}
                    readOnly
                    className="flex-1 font-mono text-xs"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopyUrl}
                    className="px-3"
                  >
                    {copySuccess ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              {reportUrl && (
                <Button onClick={handleOpenReport} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open Report
                </Button>
              )}
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center py-4 space-y-4">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-semibold text-red-900">Report Generation Failed</h3>
                <p className="text-sm text-muted-foreground">
                  {errorMessage || `Failed to generate ${reportLabel.toLowerCase()}. Please try again.`}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              {onRetry && (
                <Button onClick={onRetry} variant="default">
                  Try Again
                </Button>
              )}
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </DialogFooter>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{reportLabel}</DialogTitle>
              <DialogDescription>
                {state === 'loading' && 'Generating your report...'}
                {state === 'success' && 'Your report is ready!'}
                {state === 'error' && 'Something went wrong'}
              </DialogDescription>
            </div>
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

        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};