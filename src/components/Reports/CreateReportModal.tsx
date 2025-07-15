import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useListingContext } from "@/context/ListingContext";
import { useCreateReport } from "@/hooks/useReports";
import { REPORT_SECTIONS, ReportSectionId } from "@/types/reportTypes";
import { DateRange } from "react-day-picker";

interface CreateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { selectedListing } = useListingContext();
  const { mutateAsync: createReport, isPending } = useCreateReport();

  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState<"Individual" | "Compare">(
    "Individual"
  );
  const [showSections, setShowSections] = useState(false);
  const [selectedSections, setSelectedSections] = useState<ReportSectionId[]>([
    "gmb-health",
    "insights",
    "reviews",
    "posts",
    "media",
    "geo-ranking",
  ]);
  const [individualDate, setIndividualDate] = useState<DateRange | undefined>();
  const [period1Date, setPeriod1Date] = useState<DateRange | undefined>();
  const [period2Date, setPeriod2Date] = useState<DateRange | undefined>();

  const handleSectionToggle = (sectionId: ReportSectionId) => {
    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerate = async () => {
    console.log("generate is clicked with id", selectedListing?.id);
    if (!selectedListing?.id) return;

    let dateRange;
    if (reportType === "Individual") {
      if (!individualDate?.from || !individualDate?.to) return;
      dateRange = {
        from: individualDate.from,
        to: individualDate.to,
      };
    } else {
      if (
        !period1Date?.from ||
        !period1Date?.to ||
        !period2Date?.from ||
        !period2Date?.to
      )
        return;
      dateRange = {
        period1: {
          from: period1Date.from,
          to: period1Date.to,
        },
        period2: {
          from: period2Date.from,
          to: period2Date.to,
        },
      };
    }

    try {
      await createReport({
        name: reportName,
        type: reportType,
        dateRange,
        sections: selectedSections,
        listingId: selectedListing.id,
        domain: window.location.hostname,
      });
      onOpenChange(false);
      // Reset form
      setReportName("");
      setReportType("Individual");
      setShowSections(false);
      setSelectedSections([
        "gmb-health",
        "insights",
        "reviews",
        "posts",
        "media",
        "geo-ranking",
      ]);
      setIndividualDate(undefined);
      setPeriod1Date(undefined);
      setPeriod2Date(undefined);
    } catch (error) {
      console.error("Failed to create report:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Performance Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Name Field */}
          <div className="space-y-2">
            <Label htmlFor="reportName" className="text-sm font-medium">
              Report Name
            </Label>
            <Input
              id="reportName"
              type="text"
              placeholder="Enter report name"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          {/* Report Type Toggle */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Report Type</Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={reportType === "Compare"}
                onCheckedChange={(checked) =>
                  setReportType(checked ? "Compare" : "Individual")
                }
              />
              <Label>
                {reportType === "Individual"
                  ? "Compare Report"
                  : "Compare Report"}
              </Label>
            </div>
          </div>

          {/* Date Range Pickers */}
          <div className="space-y-4">
            {reportType === "Individual" ? (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Date Range
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !individualDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {individualDate?.from ? (
                        individualDate.to ? (
                          <>
                            {format(individualDate.from, "LLL dd, y")} -{" "}
                            {format(individualDate.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(individualDate.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Select date range</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={individualDate?.from}
                      selected={individualDate}
                      onSelect={setIndividualDate}
                      numberOfMonths={2}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Period 1
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !period1Date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {period1Date?.from ? (
                          period1Date.to ? (
                            <>
                              {format(period1Date.from, "LLL dd, y")} -{" "}
                              {format(period1Date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(period1Date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select first period</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={period1Date?.from}
                        selected={period1Date}
                        onSelect={setPeriod1Date}
                        numberOfMonths={2}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Period 2
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !period2Date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {period2Date?.from ? (
                          period2Date.to ? (
                            <>
                              {format(period2Date.from, "LLL dd, y")} -{" "}
                              {format(period2Date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(period2Date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Select second period</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={period2Date?.from}
                        selected={period2Date}
                        onSelect={setPeriod2Date}
                        numberOfMonths={2}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            )}
          </div>

          {/* Section Toggle */}
          <div className="flex items-center space-x-2">
            <Switch checked={showSections} onCheckedChange={setShowSections} />
            <Label>Toggle to show or hide sections of the report</Label>
          </div>

          {/* Report Sections */}
          {showSections && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Report Sections</Label>
              <div className="grid grid-cols-2 gap-3">
                {REPORT_SECTIONS.map((section) => (
                  <div key={section.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={section.id}
                      checked={selectedSections.includes(section.id)}
                      onCheckedChange={() => handleSectionToggle(section.id)}
                    />
                    <Label htmlFor={section.id} className="text-sm">
                      {section.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isPending || !selectedListing?.id || !reportName.trim()}
            >
              {isPending ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
