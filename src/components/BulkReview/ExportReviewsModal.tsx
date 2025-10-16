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
import { MultiListingSelector } from "@/components/Posts/CreatePostModal/MultiListingSelector";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface ExportReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ExportReviewsModal: React.FC<ExportReviewsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { t } = useI18nNamespace("BulkReview/exportReviewsModal");

  const EXPORT_TYPE_OPTIONS = [
    { id: 1, label: t("exportReviewsModal.exportTypeOptions.1"), value: 1 },
    {
      id: 2,
      label: t("exportReviewsModal.exportTypeOptions.2"),
      value: 2,
    },
    {
      id: 3,
      label: t("exportReviewsModal.exportTypeOptions.3"),
      value: 3,
    },
  ];

  const STAR_RATINGS = [
    { id: "ONE", label: t("exportReviewsModal.rating.rating1"), value: "ONE" },
    { id: "TWO", label: t("exportReviewsModal.rating.rating2"), value: "TWO" },
    {
      id: "THREE",
      label: t("exportReviewsModal.rating.rating3"),
      value: "THREE",
    },
    {
      id: "FOUR",
      label: t("exportReviewsModal.rating.rating4"),
      value: "FOUR",
    },
    {
      id: "FIVE",
      label: t("exportReviewsModal.rating.rating5"),
      value: "FIVE",
    },
  ];

  const { toast } = useToast();

  const [selectedListings, setSelectedListings] = useState<string[]>([]);
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
    if (selectedListings.length === 0) {
      toast({
        title: t("exportReviewsModal.toast.validation.title"),
        description: t("exportReviewsModal.toast.validation.noListing"),
        variant: "destructive",
      });
      return;
    }

    if (selectedStars.length === 0) {
      toast({
        title: t("exportReviewsModal.toast.validation.title"),
        description: t("exportReviewsModal.toast.validation.noStar"),
        variant: "destructive",
      });
      return;
    }

    if (
      (exportType === 2 || exportType === 3) &&
      (!dateRange?.from || !dateRange?.to)
    ) {
      toast({
        title: t("exportReviewsModal.toast.validation.title"),
        description: t("exportReviewsModal.toast.validation.noDateRange"),
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const params: any = {
        listingId: selectedListings.map((id) => parseInt(id)),
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
          title: t("exportReviewsModal.toast.success.title"),
          description: t("exportReviewsModal.toast.success.description"),
        });

        // Close modal
        onOpenChange(false);

        // Reset form
        setSelectedListings([]);
        setSelectedStars([]);
        setDateRange(undefined);
        setExportType(1);
      } else {
        throw new Error(response.message || "Failed to generate CSV");
      }
    } catch (error) {
      toast({
        title: t("exportReviewsModal.toast.error.title"),
        description:
          error instanceof Error
            ? error.message
            : t("exportReviewsModal.toast.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            {t("exportReviewsModal.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listings Selection */}
          <MultiListingSelector
            selectedListings={selectedListings}
            onListingsChange={setSelectedListings}
            error={
              selectedListings.length === 0
                ? t("exportReviewsModal.toast.validation.noListing")
                : undefined
            }
            label={t("exportReviewsModal.selectListingsLabel")}
            placeholder={t("exportReviewsModal.selectListingsPlaceholder")}
          />

          {/* Export Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">
              {t("exportReviewsModal.exportTypeLabel")}
            </Label>
            <Select
              value={exportType.toString()}
              onValueChange={(value) => setExportType(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("exportReviewsModal.exportPlaceholder")}
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
                {t("exportReviewsModal.starRatingsLabel")}
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
              {t("exportReviewsModal.starsSelected", {
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
                {t("exportReviewsModal.dateRangeLabel")}
              </Label>
              <DateRangePicker
                date={dateRange}
                onDateChange={setDateRange}
                placeholder={t("exportReviewsModal.dateRangePlaceholder")}
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
            {t("exportReviewsModal.buttons.cancel")}
          </Button>
          <Button
            onClick={handleExport}
            disabled={
              isExporting ||
              selectedListings.length === 0 ||
              selectedStars.length === 0 ||
              ((exportType === 2 || exportType === 3) &&
                (!dateRange?.from || !dateRange?.to))
            }
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                {t("exportReviewsModal.buttons.exporting")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t("exportReviewsModal.buttons.export")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
