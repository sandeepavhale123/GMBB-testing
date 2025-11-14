import React, { useEffect, useRef, useState } from "react";
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
import { useCreateReport, useAllReports } from "@/hooks/useReports";
import { useReportSections, ReportSectionId } from "@/types/reportTypes";
import { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CreateReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
  open,
  onOpenChange,
}) => {
  const REPORT_SECTIONS = useReportSections();
  const { t } = useI18nNamespace("Reports/createReportModal");
  const { selectedListing } = useListingContext();
  const { mutateAsync: createReport, isPending } = useCreateReport();
  const navigate = useNavigate();

  // Get citation and geo report status
  const { data: reportsData } = useAllReports(selectedListing?.id || "", 1, 10);

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
    "citation",
  ]);
  const [individualDate, setIndividualDate] = useState<DateRange | undefined>();
  const [period1Date, setPeriod1Date] = useState<DateRange | undefined>();
  const [period2Date, setPeriod2Date] = useState<DateRange | undefined>();
  const formatDateForAPI = (date: Date) => format(date, "yyyy-MM-dd");
  const ln = localStorage.getItem("i18nextLng");
  // Get report availability flags
  const isCitationAvailable = reportsData?.data?.isCitation === 1;
  const isGeoAvailable = reportsData?.data?.isGeo === 1;

  // Remove unavailable sections from selected sections automatically
  useEffect(() => {
    if (reportsData?.data) {
      setSelectedSections((prev) =>
        prev.filter((sectionId) => {
          if (sectionId === "citation" && !isCitationAvailable) return false;
          if (sectionId === "geo-ranking" && !isGeoAvailable) return false;
          return true;
        })
      );
    }
  }, [isCitationAvailable, isGeoAvailable, reportsData]);

  const handleSectionToggle = (sectionId: ReportSectionId) => {
    // Prevent toggling disabled sections
    if (
      (sectionId === "citation" && !isCitationAvailable) ||
      (sectionId === "geo-ranking" && !isGeoAvailable)
    ) {
      return;
    }

    setSelectedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleNavigateToReport = (reportType: "citation" | "geo-ranking") => {
    const listingId = selectedListing?.id;
    if (!listingId) return;

    if (reportType === "citation") {
      navigate(`/citation/${listingId}?lang=${ln}`);
    } else if (reportType === "geo-ranking") {
      navigate(`/geo-ranking-report/${listingId}?lang=${ln}`);
    }
    onOpenChange(false);
  };

  // Track previous type
  const prevType = useRef<"Individual" | "Compare">("Individual");

  useEffect(() => {
    if (
      reportType === "Compare" &&
      prevType.current === "Individual" &&
      individualDate
    ) {
      // Moving from Individual → Compare: copy individualDate to period1
      setPeriod1Date(individualDate);
    } else if (
      reportType === "Individual" &&
      prevType.current === "Compare" &&
      period1Date
    ) {
      // Moving from Compare → Individual: copy period1Date to individualDate
      setIndividualDate(period1Date);
    }

    prevType.current = reportType;
  }, [reportType, individualDate, period1Date]);

  // close button
  const handleClose = () => {
    onOpenChange(false);
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
      "citation",
    ]);
    setIndividualDate(undefined);
    setPeriod1Date(undefined);
    setPeriod2Date(undefined);
  };
  const handleGenerate = async () => {
    if (!selectedListing?.id) return;
    if (selectedSections.length === 0) return;

    let dateRange;
    if (reportType === "Individual") {
      if (!individualDate?.from || !individualDate?.to) return;
      dateRange = {
        from: formatDateForAPI(individualDate.from),
        to: formatDateForAPI(individualDate.to),
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
          from: formatDateForAPI(period1Date.from),
          to: formatDateForAPI(period1Date.to),
        },
        period2: {
          from: formatDateForAPI(period2Date.from),
          to: formatDateForAPI(period2Date.to),
        },
      };
    }

    try {
      await createReport({
        name: reportName,
        type: reportType,
        dateRange,
        domain: window.location.hostname,
        sections: selectedSections,
        listingId: selectedListing.id,
        lang: ln,
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
        "citation",
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
      <DialogContent className="max-w-2xl max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("createReportModal.title")}.</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Name Field */}
          <div className="space-y-2">
            <Label htmlFor="reportName" className="text-sm font-medium">
              {t("createReportModal.fields.reportName.label")}
            </Label>
            <Input
              id="reportName"
              type="text"
              placeholder={t("createReportModal.fields.reportName.placeholder")}
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>

          {/* Report Type Toggle */}
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              {t("createReportModal.fields.reportType.label")}
            </Label>
            <div className="flex items-center space-x-2">
              <Switch
                checked={reportType === "Compare"}
                onCheckedChange={(checked) =>
                  setReportType(checked ? "Compare" : "Individual")
                }
              />
              <Label>
                {reportType === "Individual"
                  ? t("createReportModal.fields.reportType.compareLabel")
                  : t("createReportModal.fields.reportType.compareLabel")}
              </Label>
            </div>
          </div>

          {/* Date Range Pickers */}
          <div className="space-y-4">
            {reportType === "Individual" ? (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  {t("createReportModal.fields.dateRange.label")}
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
                        <span>
                          {t("createReportModal.fields.dateRange.select")}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 z-[100]" align="start">
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
                    {t("createReportModal.fields.dateRange.period1.label")}
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
                          <span>
                            {t(
                              "createReportModal.fields.dateRange.period1.select"
                            )}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 z-[100]"
                      align="start"
                    >
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
                    {t("createReportModal.fields.dateRange.period2.label")}
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
                          <span>
                            {t(
                              "createReportModal.fields.dateRange.period2.select"
                            )}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0 z-[100]"
                      align="start"
                    >
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
            <Label>{t("createReportModal.fields.sectionsToggle.label")}</Label>
          </div>

          {/* Report Sections */}
          {showSections && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("createReportModal.fields.sections.label")}
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {REPORT_SECTIONS.map((section) => {
                  const isDisabled =
                    (section.id === "citation" && !isCitationAvailable) ||
                    (section.id === "geo-ranking" && !isGeoAvailable);

                  return (
                    <div
                      key={section.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={section.id}
                          checked={selectedSections.includes(section.id)}
                          onCheckedChange={() =>
                            handleSectionToggle(section.id)
                          }
                          disabled={isDisabled}
                        />
                        <Label
                          htmlFor={section.id}
                          className={cn(
                            "text-sm",
                            isDisabled && "text-muted-foreground"
                          )}
                        >
                          {section.name}
                        </Label>
                      </div>

                      {isDisabled && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleNavigateToReport(
                              section.id as "citation" | "geo-ranking"
                            )
                          }
                          className="text-xs h-7"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {t(
                            "createReportModal.fields.sections.generateReport"
                          )}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              {t("createReportModal.buttons.close")}
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={
                isPending ||
                !selectedListing?.id ||
                !reportName.trim() ||
                selectedSections.length === 0
              }
            >
              {isPending
                ? t("createReportModal.buttons.generating")
                : t("createReportModal.buttons.generate")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
