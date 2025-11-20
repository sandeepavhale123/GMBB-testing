import React, { useState } from "react";
import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { reviewService } from "@/services/reviewService";
import { downloadFileFromUrl } from "@/utils/downloadUtils";
import { formatDateForBackend } from "@/utils/dateUtils";
import { useListingContext } from "@/context/ListingContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface SingleListingExportReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SingleListingExportReviewsModal: React.FC<
  SingleListingExportReviewsModalProps
> = ({ open, onOpenChange }) => {
  const { t } = useI18nNamespace("Reviews/SingleListingExportReviewsModal");

  const EXPORT_TYPE_OPTIONS = [
    { id: 1, label: t("exportReviewsModal.export1"), value: 1 },
    { id: 2, label: t("exportReviewsModal.export2"), value: 2 },
    { id: 3, label: t("exportReviewsModal.export3"), value: 3 },
  ];

  const STAR_RATINGS = [
    {
      id: "ONE",
      label: t("exportReviewsModal.starLabel1"),
      value: t("exportReviewsModal.satrValue1"),
    },
    {
      id: "TWO",
      label: t("exportReviewsModal.starLabel2"),
      value: t("exportReviewsModal.satrValue2"),
    },
    {
      id: "THREE",
      label: t("exportReviewsModal.starLabel3"),
      value: t("exportReviewsModal.satrValue3"),
    },
    {
      id: "FOUR",
      label: t("exportReviewsModal.starLabel4"),
      value: t("exportReviewsModal.satrValue4"),
    },
    {
      id: "FIVE",
      label: t("exportReviewsModal.starLabel5"),
      value: t("exportReviewsModal.satrValue5"),
    },
  ];
  const { toast } = useToast();
  const { selectedListing } = useListingContext();

  const [selectedStars, setSelectedStars] = useState<string[]>(
    STAR_RATINGS.map((star) => star.value)
  );
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [exportType, setExportType] = useState<number>(1);
  const [isExporting, setIsExporting] = useState(false);

  const handleStarToggle = (starValue: string) => {
    setSelectedStars((prev) =>
      prev.includes(starValue)
        ? prev.filter((star) => star !== starValue)
        : [...prev, starValue]
    );
  };

  const handleSelectAllStars = () => {
    if (selectedStars.length === STAR_RATINGS.length) {
      setSelectedStars([]);
    } else {
      setSelectedStars(STAR_RATINGS.map((star) => star.value));
    }
  };

  const handleExport = async () => {
    // Validation
    if (!selectedListing?.id) {
      toast({
        title: t("exportReviewsModal.error"),
        description: t("exportReviewsModal.errorNoListing"),
        variant: "destructive",
      });
      return;
    }

    if (selectedStars.length === 0) {
      toast({
        title: t("exportReviewsModal.validation"),
        description: t("exportReviewsModal.errorNoStars"),
        variant: "destructive",
      });
      return;
    }

    if (
      (exportType === 2 || exportType === 3) &&
      (!dateRange?.from || !dateRange?.to)
    ) {
      toast({
        title: t("exportReviewsModal.validation"),
        description: t("exportReviewsModal.errorNoDateRange"),
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const params: any = {
        listingId: [parseInt(selectedListing.id)],
        reviewOpt: exportType,
        reviewByStar: selectedStars,
      };

      // Only add customDate if export type requires it (2 or 3)
      if (exportType === 2 || exportType === 3) {
        params.customDate = {
          fromDate: formatDateForBackend(dateRange!.from),
          toDate: formatDateForBackend(dateRange!.to),
        };
      }

      const response = await reviewService.exportReviews(params);

      if (response.code === 200 && response.data?.fileUrl) {
        // Trigger download
        downloadFileFromUrl(response.data.fileUrl, response.data.fileName);

        toast({
          title: t("exportReviewsModal.successTitle"),
          description: t("exportReviewsModal.success"),
        });

        // Close modal
        onOpenChange(false);

        // Reset form
        setSelectedStars([]);
        setDateRange(undefined);
        setExportType(1);
      } else {
        throw new Error(response.message || "Failed to generate CSV");
      }
    } catch (error) {
      toast({
        title: t("exportReviewsModal.exportFailed"),
        description:
          error instanceof Error
            ? error.message
            : t("exportReviewsModal.exportDesc"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {t("exportReviewsModal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t("exportReviewsModal.chooseExportType")}
            </Label>
            <Select
              value={exportType.toString()}
              onValueChange={(value) => setExportType(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    "exportReviewsModal.selectExportTypePlaceholder"
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {EXPORT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Star Ratings Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">
                {t("exportReviewsModal.selectStarRatings")}
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllStars}
              >
                {selectedStars.length === STAR_RATINGS.length
                  ? t("exportReviewsModal.deselectAll")
                  : t("exportReviewsModal.selectAll")}
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {STAR_RATINGS.map((star) => (
                <div key={star.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`star-${star.id}`}
                    checked={selectedStars.includes(star.value)}
                    onCheckedChange={() => handleStarToggle(star.value)}
                  />
                  <Label htmlFor={`star-${star.id}`} className="cursor-pointer">
                    {star.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {t("exportReviewsModal.starRatingsSelected", {
                selected: selectedStars.length,
                total: STAR_RATINGS.length,
              })}
              {/* {selectedStars.length} of {STAR_RATINGS.length} star ratings
              selected */}
            </p>
          </div>

          {/* Date Range Selection - Only show for export types 2 and 3 */}
          {(exportType === 2 || exportType === 3) && (
            <div className="space-y-3">
              <Label className="text-base font-medium">
                {t("exportReviewsModal.selectDateRange")}
              </Label>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                placeholder={t("exportReviewsModal.selectDateRangePlaceholder")}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            {t("exportReviewsModal.cancel")}
          </Button>
          <Button
            onClick={handleExport}
            disabled={
              isExporting ||
              selectedStars.length === 0 ||
              !selectedListing?.id ||
              ((exportType === 2 || exportType === 3) &&
                (!dateRange?.from || !dateRange?.to))
            }
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                {t("exportReviewsModal.exporting")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t("exportReviewsModal.exportCSV")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
