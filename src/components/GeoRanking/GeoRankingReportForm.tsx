import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Info, RotateCcw } from "lucide-react";
import { useGetMapApiKey } from "@/hooks/useIntegration";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";

interface GeoReportFormData {
  searchBusinessType: string;
  searchBusiness: string;
  searchDataEngine: string;
  keywords: string;
  mapPoint: string;
  distanceUnit: string;
  distanceValue: string;
  gridSize: string;
  scheduleCheck: string;
  language: string;
}

interface GeoRankingReportFormProps {
  formData: GeoReportFormData;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  getDistanceOptions: () => Array<{ value: string; label: string }>;
  languageOptions: Array<{ value: string; label: string }>;
  submittingRank?: boolean;
  pollingKeyword?: boolean;
  manualCoordinates?: string[];
  onClearManualCoordinates?: () => void;
  hasResults?: boolean;
}

const GeoRankingReportForm: React.FC<GeoRankingReportFormProps> = ({
  formData,
  onInputChange,
  onSubmit,
  onReset,
  getDistanceOptions,
  languageOptions,
  submittingRank = false,
  pollingKeyword = false,
  manualCoordinates = [],
  onClearManualCoordinates,
  hasResults = false,
}) => {
  const { t } = useI18nNamespace([
    "GeoRanking/geoRankingReportForm",
    "Validation/validation",
  ]);

  const keywordsSchema = z.object({
    keywords: z
      .string()
      .refine((val) => {
        if (!val.trim()) return false; // Keywords are required
        const keywordArray = val
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        return keywordArray.length <= 5;
      }, t("keywords.max"))
      .refine((val) => {
        const keywordArray = val
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k.length > 0);
        return keywordArray.length > 0;
      }, t("keywords.min")),
  });

  type KeywordsFormData = z.infer<typeof keywordsSchema>;
  const { data: mapApiKeyData } = useGetMapApiKey();
  const keywordsValidation = useFormValidation(keywordsSchema);

  // Helper function to count keywords
  const countKeywords = (keywordsString: string): number => {
    if (!keywordsString.trim()) return 0;
    return keywordsString
      .split(",")
      .map((keyword) => keyword.trim())
      .filter((keyword) => keyword.length > 0).length;
  };

  // Check if keyword limit is reached
  const keywordCount = countKeywords(formData.keywords);
  const isKeywordCountValid = keywordCount > 0 && keywordCount <= 5;
  const isKeywordLimitReached = keywordCount >= 5;

  // Check if reset button should be shown (only when user has entered keywords)
  const shouldShowResetButton = formData.keywords.trim() !== "";

  const handleSearchDataEngineChange = (value: string) => {
    // If Map API is selected, check if API key exists
    if (value === "Map API") {
      const apiKey = mapApiKeyData?.data?.apiKey;
      if (!apiKey || apiKey.trim() === "") {
        toast({
          title: t("geoRankingReportForm.searchDataEngine.missingApiKeyTitle"),
          description: t(
            "geoRankingReportForm.searchDataEngine.missingApiKeyDesc"
          ),
          variant: "destructive",
        });
        return; // Stop the current flow
      }
    }

    // Proceed with normal flow
    onInputChange("searchDataEngine", value);
  };

  const handleKeywordsChange = (value: string) => {
    // Clear any existing errors first
    if (keywordsValidation.hasFieldError("keywords")) {
      keywordsValidation.clearFieldError("keywords");
    }

    const newKeywordCount = countKeywords(value);

    // Always prevent more than 5 keywords regardless of input method
    if (newKeywordCount > 5) {
      // If pasting, trim to first 5 keywords
      const keywords = value
        .split(",")
        .map((keyword) => keyword.trim())
        .filter((keyword) => keyword.length > 0)
        .slice(0, 5) // Take only first 5 keywords
        .join(", ");

      toast({
        title: t("geoRankingReportForm.keywords.limitExceededToastTitle"),
        description: t("geoRankingReportForm.keywords.limitExceededToastDesc"),
        variant: "destructive",
      });

      // Update with trimmed keywords
      onInputChange("keywords", keywords);
      return;
    }

    // Validate keywords
    const validation = keywordsValidation.validate({ keywords: value });
    if (
      !validation.isValid &&
      validation.errors &&
      "keywords" in validation.errors
    ) {
      toast({
        title: t("geoRankingReportForm.keywords.invalidToastTitle"),
        description:
          validation.errors.keywords ||
          t("geoRankingReportForm.keywords.invalidToastDesc"),
        variant: "destructive",
      });
    }

    // Always update the form data (even if invalid, to show the user's input)
    onInputChange("keywords", value);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
          {t("geoRankingReportForm.title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 lg:space-y-5 overflow-y-auto flex-1 pb-4 sm:pb-6">
        <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
          {/* Keywords */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="keywords"
                className="text-sm font-medium text-gray-700"
              >
                {t("geoRankingReportForm.keywords.label")} ({keywordCount}/5)
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span
                      className="cursor-help"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Info className="w-4 h-4 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("geoRankingReportForm.keywords.tooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="keywords"
              placeholder={t("geoRankingReportForm.keywords.placeholder")}
              value={formData.keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="w-full"
            />
            {keywordCount === 5 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                {t("geoRankingReportForm.keywords.maxReached")}
              </p>
            )}
          </div>

          {/* Search Data Engine */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              {t("geoRankingReportForm.searchDataEngine.label")}
            </Label>
            <RadioGroup
              value={formData.searchDataEngine}
              onValueChange={handleSearchDataEngineChange}
              className="flex flex-row gap-4 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Map API" id="map-api" />
                <Label htmlFor="map-api" className="text-sm">
                  {t("geoRankingReportForm.searchDataEngine.mapApi")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Briefcase API" id="briefcase-api" />
                <Label htmlFor="briefcase-api" className="text-sm">
                  {t("geoRankingReportForm.searchDataEngine.briefcaseApi")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Map Point */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("geoRankingReportForm.mapPoint.label")}
            </Label>
            <Select
              value={formData.mapPoint}
              onValueChange={(value) => onInputChange("mapPoint", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">
                  {t("geoRankingReportForm.mapPoint.automatic")}
                </SelectItem>
                <SelectItem value="Manually">
                  {t("geoRankingReportForm.mapPoint.manually")}
                </SelectItem>
              </SelectContent>
            </Select>
            {formData.mapPoint === "Manually" && (
              <div className="space-y-2">
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  {t("geoRankingReportForm.mapPoint.manualInfo")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {t("geoRankingReportForm.mapPoint.pointsSelected", {
                      count: manualCoordinates.length,
                    })}
                    {/* Points selected: {manualCoordinates.length} */}
                  </span>
                  {manualCoordinates.length > 0 && onClearManualCoordinates && (
                    <button
                      type="button"
                      onClick={onClearManualCoordinates}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      {t("geoRankingReportForm.mapPoint.clearAllPoints")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {formData.mapPoint !== "Manually" && (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {/* Distance Unit */}
              <div className="space-y-2 col-span-1">
                <Label className="text-sm font-medium text-gray-700">
                  {t("geoRankingReportForm.distanceUnit.label")}
                </Label>
                <RadioGroup
                  value={formData.distanceUnit}
                  onValueChange={(val) => onInputChange("distanceUnit", val)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Meters" id="meters" />
                    <Label htmlFor="meters" className="text-sm">
                      {t("geoRankingReportForm.distanceUnit.meters")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Miles" id="miles" />
                    <Label htmlFor="miles" className="text-sm">
                      {t("geoRankingReportForm.distanceUnit.miles")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Distance Value */}
              <div className="space-y-2 col-span-1">
                <Label className="text-sm font-medium text-gray-700">
                  {t("geoRankingReportForm.distanceValue.label")}
                </Label>
                <Select
                  value={formData.distanceValue}
                  onValueChange={(val) => onInputChange("distanceValue", val)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t(
                        "geoRankingReportForm.distanceValue.placeholder"
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getDistanceOptions().map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Grid Size and Schedule Check */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("geoRankingReportForm.gridSize.label")}
              </Label>
              <Select
                value={formData.gridSize}
                onValueChange={(value) => onInputChange("gridSize", value)}
                disabled={formData.mapPoint === "Manually"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3x3</SelectItem>
                  <SelectItem value="5">5x5</SelectItem>
                  <SelectItem value="7">7x7</SelectItem>
                  <SelectItem value="9">9x9</SelectItem>
                  <SelectItem value="11">11x11</SelectItem>
                  <SelectItem value="13">13x13</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("geoRankingReportForm.scheduleCheck.label")}
              </Label>
              <Select
                value={formData.scheduleCheck}
                onValueChange={(value) => onInputChange("scheduleCheck", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onetime">
                    {" "}
                    {t("geoRankingReportForm.scheduleCheck.options.onetime")}
                  </SelectItem>
                  <SelectItem value="weekly">
                    {t("geoRankingReportForm.scheduleCheck.options.weekly")}
                  </SelectItem>
                  <SelectItem value="monthly">
                    {t("geoRankingReportForm.scheduleCheck.options.monthly")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("geoRankingReportForm.language.label")}
            </Label>
            <Select
              value={formData.language}
              onValueChange={(value) => onInputChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Updated buttons section - single row layout */}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                submittingRank || pollingKeyword || !isKeywordCountValid
              }
            >
              {pollingKeyword
                ? t("geoRankingReportForm.buttons.processingKeyword")
                : submittingRank
                ? t("geoRankingReportForm.buttons.submittingRank")
                : t("geoRankingReportForm.buttons.checkRank")}
            </Button>

            {shouldShowResetButton && (
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={submittingRank || pollingKeyword}
                className="flex-none"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                {t("geoRankingReportForm.buttons.reset")}
              </Button>
            )}
          </div>

          {pollingKeyword && (
            <div className="text-center mt-2">
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                {t("geoRankingReportForm.pollingInfo")}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};


export default GeoRankingReportForm;