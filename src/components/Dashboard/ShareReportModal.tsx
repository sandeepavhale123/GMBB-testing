import React, { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MultiListingSelector } from '@/components/Posts/CreatePostModal/MultiListingSelector';
import { generateShareableReport } from '@/api/dashboardApi';
import { toast } from '@/hooks/use-toast';

interface ShareReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dashboardFilterType: number;
  onReportGenerated: (reportId: string) => void;
}

export const ShareReportModal: React.FC<ShareReportModalProps> = ({
  open,
  onOpenChange,
  dashboardFilterType,
  onReportGenerated,
}) => {
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string>('');

  const handleGenerateReport = async () => {
    if (selectedListings.length === 0) {
      setError('Please select at least one listing or group');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await generateShareableReport({
        listingId: selectedListings,
        dashbaordFilterType: dashboardFilterType,
      });

      if (response.code === 200) {
        onReportGenerated(response.data.reportId);
        onOpenChange(false);
        // Reset state
        setSelectedListings([]);
        setError('');
      } else {
        setError(response.message || 'Failed to generate report');
      }
    } catch (err) {
      setError('Failed to generate report. Please try again.');
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setSelectedListings([]);
      setError('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Share Report</DialogTitle>
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
          <div>
            <MultiListingSelector
              selectedListings={selectedListings}
              onListingsChange={setSelectedListings}
              error={error}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGenerateReport}
              disabled={isGenerating || selectedListings.length === 0}
            >
              {isGenerating && (
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
              )}
              Generate Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};