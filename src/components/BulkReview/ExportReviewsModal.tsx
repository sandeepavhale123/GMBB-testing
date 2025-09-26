import React, { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { useToast } from "@/hooks/use-toast";
import { reviewService } from "@/services/reviewService";
import { listingsGroupsApi } from "@/api/listingsGroupsApi";
import { downloadFileFromUrl } from "@/utils/downloadUtils";
import { formatDateForBackend } from "@/utils/dateUtils";

interface ExportReviewsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Listing {
  id: number;
  name: string;
  zipCode?: string;
}

const STAR_RATINGS = [
  { id: "ONE", label: "1 Star", value: "ONE" },
  { id: "TWO", label: "2 Star", value: "TWO" },
  { id: "THREE", label: "3 Star", value: "THREE" },
  { id: "FOUR", label: "4 Star", value: "FOUR" },
  { id: "FIVE", label: "5 Star", value: "FIVE" },
];

export const ExportReviewsModal: React.FC<ExportReviewsModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [getAllListings] = listingsGroupsApi.useGetAllListingsMutation();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedListings, setSelectedListings] = useState<number[]>([]);
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isExporting, setIsExporting] = useState(false);
  const [isLoadingListings, setIsLoadingListings] = useState(false);

  // Load listings when modal opens
  useEffect(() => {
    if (open) {
      loadListings();
    }
  }, [open]);

  const loadListings = async () => {
    setIsLoadingListings(true);
    try {
      const response = await getAllListings().unwrap();
      if (response.code === 200 && response.data?.locationLists) {
        // Map LocationsList to Listing interface
        const mappedListings: Listing[] = response.data.locationLists.map((location) => ({
          id: parseInt(location.id),
          name: location.locationName,
          zipCode: location.zipCode,
        }));
        setListings(mappedListings);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load listings",
        variant: "destructive",
      });
    } finally {
      setIsLoadingListings(false);
    }
  };

  const handleListingToggle = (listingId: number) => {
    setSelectedListings(prev => 
      prev.includes(listingId)
        ? prev.filter(id => id !== listingId)
        : [...prev, listingId]
    );
  };

  const handleStarToggle = (starValue: string) => {
    setSelectedStars(prev =>
      prev.includes(starValue)
        ? prev.filter(star => star !== starValue)
        : [...prev, starValue]
    );
  };

  const handleSelectAllListings = () => {
    if (selectedListings.length === listings.length) {
      setSelectedListings([]);
    } else {
      setSelectedListings(listings.map(listing => listing.id));
    }
  };

  const handleSelectAllStars = () => {
    if (selectedStars.length === STAR_RATINGS.length) {
      setSelectedStars([]);
    } else {
      setSelectedStars(STAR_RATINGS.map(star => star.value));
    }
  };

  const handleExport = async () => {
    // Validation
    if (selectedListings.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one listing",
        variant: "destructive",
      });
      return;
    }

    if (selectedStars.length === 0) {
      toast({
        title: "Validation Error", 
        description: "Please select at least one star rating",
        variant: "destructive",
      });
      return;
    }

    if (!dateRange?.from || !dateRange?.to) {
      toast({
        title: "Validation Error",
        description: "Please select a date range",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    try {
      const params = {
        listingId: selectedListings,
        reviewOpt: 1,
        reviewByStar: selectedStars,
        customDate: {
          fromDate: formatDateForBackend(dateRange.from),
          toDate: formatDateForBackend(dateRange.to),
        },
      };

      const response = await reviewService.exportReviews(params);
      
      if (response.code === 200 && response.data?.fileUrl) {
        // Trigger download
        downloadFileFromUrl(response.data.fileUrl, response.data.fileName);
        
        toast({
          title: "Success",
          description: "CSV file generated and download started",
        });
        
        // Close modal
        onOpenChange(false);
        
        // Reset form
        setSelectedListings([]);
        setSelectedStars([]);
        setDateRange(undefined);
      } else {
        throw new Error(response.message || "Failed to generate CSV");
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "An error occurred during export",
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
            Export Review Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Listings Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Listings</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllListings}
                disabled={isLoadingListings}
              >
                {selectedListings.length === listings.length ? "Deselect All" : "Select All"}
              </Button>
            </div>
            
            {isLoadingListings ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading listings...
              </div>
            ) : (
              <div className="max-h-48 overflow-y-auto border rounded-lg p-3 space-y-2">
                {listings.map((listing) => (
                  <div key={listing.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`listing-${listing.id}`}
                      checked={selectedListings.includes(listing.id)}
                      onCheckedChange={() => handleListingToggle(listing.id)}
                    />
                    <Label
                      htmlFor={`listing-${listing.id}`}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span>{listing.name}</span>
                        {listing.zipCode && (
                          <span className="text-xs text-muted-foreground">
                            {listing.zipCode}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            )}
            <p className="text-sm text-muted-foreground">
              {selectedListings.length} of {listings.length} listings selected
            </p>
          </div>

          {/* Star Ratings Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Star Ratings</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSelectAllStars}
              >
                {selectedStars.length === STAR_RATINGS.length ? "Deselect All" : "Select All"}
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
              {selectedStars.length} of {STAR_RATINGS.length} star ratings selected
            </p>
          </div>

          {/* Date Range Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Select Date Range</Label>
            <DateRangePicker
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Select date range for reviews"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedListings.length === 0 || selectedStars.length === 0}
            className="min-w-[120px]"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};