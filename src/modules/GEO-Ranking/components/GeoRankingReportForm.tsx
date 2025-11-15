import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, RotateCcw, MapPin, RefreshCw } from "lucide-react";
import { useGetMapApiKey } from "@/hooks/useIntegration";
import { toast } from "@/hooks/use-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import { BusinessGooglePlacesInput } from "@/components/BusinessSearch/BusinessGooglePlacesInput";
import {
  getBusinessDetailsFromCID,
  getBusinessDetailsFromMapUrl,
  getProjectLists,
} from "@/api/businessSearchApi";
import { BusinessLocationLite, ProjectLite } from "@/types/business";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { z } from "zod";
interface GeoRankingFormData {
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
  formData: GeoRankingFormData;
  onInputChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  getDistanceOptions: () => Array<{
    value: string;
    label: string;
  }>;
  languageOptions: Array<{
    value: string;
    label: string;
  }>;
  submittingRank?: boolean;
  pollingKeyword?: boolean;
  manualCoordinates?: string[];
  onClearManualCoordinates?: () => void;
  hasResults?: boolean;
  onBusinessSelect?: (business: BusinessLocationLite) => void;
  onProjectSelect?: (project: ProjectLite | null) => void;
  disabled?: boolean;
  onAddKeywordsSubmit?: (e: React.FormEvent) => void;
  urlProjectId?: string | null;
}
export function GeoRankingReportForm({
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
  onBusinessSelect,
  onProjectSelect,
  disabled = false,
  onAddKeywordsSubmit,
  urlProjectId,
}: GeoRankingReportFormProps) {
  const { t } = useI18nNamespace([
    "Geo-Ranking-module-component/GeoRankingReportForm",
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

  // Business search state
  const [searchMethod, setSearchMethod] = useState<
    "google" | "cid" | "map_url"
  >("google");
  const [cidInput, setCidInput] = useState("");
  const [mapUrlInput, setMapUrlInput] = useState("");
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessLocationLite | null>(null);
  const [loading, setLoading] = useState(false);

  // Project selection state
  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectLite | null>(
    null
  );
  const [projectsLoading, setProjectsLoading] = useState(false);

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
          title: t("toast.missingApi"),
          description: t("toast.missingDesc"),
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
        title: t("toast.keywordTitle"),
        description: t("toast.keywordDesc"),
        variant: "destructive",
      });

      // Update with trimmed keywords
      onInputChange("keywords", keywords);
      return;
    }

    // Validate keywords
    const validation = keywordsValidation.validate({
      keywords: value,
    });
    if (
      !validation.isValid &&
      validation.errors &&
      "keywords" in validation.errors
    ) {
      toast({
        title: t("toast.invalidTitle"),
        description: validation.errors.keywords || t("toast.invalidDesc"),
        variant: "destructive",
      });
    }

    // Always update the form data (even if invalid, to show the user's input)
    onInputChange("keywords", value);
  };

  // Business search handlers
  const handlePlaceSelect = (business: BusinessLocationLite) => {
    setSelectedBusiness(business);
    onBusinessSelect?.(business);
  };
  const parseLatLong = (
    latlong: string
  ): {
    lat: string;
    long: string;
  } => {
    const [lat, long] = latlong.split(",");
    return {
      lat: lat?.trim() || "",
      long: long?.trim() || "",
    };
  };
  const handleMapUrlSearch = async () => {
    if (!mapUrlInput.trim() || loading) return;
    try {
      setLoading(true);
      const response = await getBusinessDetailsFromMapUrl(mapUrlInput.trim());

      if (response.code === 200 && response.data) {
        const { lat, long } = parseLatLong(response.data.latlong);
        const business: BusinessLocationLite = {
          name: response.data.bname,
          latitude: lat,
          longitude: long,
          type: 2,
          input: mapUrlInput.trim(),
        };
        setSelectedBusiness(business);
        onBusinessSelect?.(business);
      } else {
        toast({
          title: t("toast.businessTitle"),
          description: t("toast.businessDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Map URL search error:", error);
      toast({
        title: t("toast.searchTitle"),
        description: t("toast.searchDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCIDSearch = async () => {
    if (!cidInput.trim() || loading) return;
    if (!/^\d+$/.test(cidInput.trim())) {
      return;
    }
    try {
      setLoading(true);
      const response = await getBusinessDetailsFromCID(cidInput.trim());
      if (response.code === 200 && response.data) {
        const business: BusinessLocationLite = {
          name: response.data.bname,
          latitude: response.data.lat,
          longitude: response.data.long,
          type: 3,
          input: cidInput.trim(),
        };
        setSelectedBusiness(business);
        onBusinessSelect?.(business);
      } else {
        toast({
          title: t("toast.businessTitle"),
          description: t("toast.cidDesc"),
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("CID search error:", error);
      toast({
        title: t("toast.searchTitle"),
        description: t("toast.failedDesc"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleProjectSelect = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId) || null;
    setSelectedProject(project);
    onProjectSelect?.(project);
  };
  const handleBusinessReset = () => {
    setSelectedBusiness(null);
    setSelectedProject(null);
    setCidInput("");
    setMapUrlInput("");
    setSearchMethod("google");
    onBusinessSelect?.(null as any);
    onProjectSelect?.(null);
  };

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setProjectsLoading(true);
        const response = await getProjectLists();
        if (response.code === 200 && response.data?.projectLists) {
          setProjects(response.data.projectLists);
        } else {
          toast({
            title: t("toast.projectTitle"),
            description: t("toast.projectDesc"),
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        toast({
          title: t("toast.errorTitle"),
          description: t("toast.errorDesc"),
          variant: "destructive",
        });
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Auto-select project from URL parameter
  useEffect(() => {
    if (urlProjectId && projects.length > 0 && !selectedProject) {
      const projectToSelect = projects.find((p) => p.id === urlProjectId);
      if (projectToSelect) {
        setSelectedProject(projectToSelect);
        onProjectSelect?.(projectToSelect);
      }
    }
  }, [urlProjectId, projects, selectedProject, onProjectSelect]);

  // Debouncing for CID and Map URL searches
  useEffect(() => {
    if (!cidInput.trim() && !mapUrlInput.trim()) return;
    const timeoutId = setTimeout(() => {
      if (
        searchMethod === "cid" &&
        cidInput.trim() &&
        /^\d+$/.test(cidInput.trim())
      ) {
        handleCIDSearch();
      } else if (searchMethod === "map_url" && mapUrlInput.trim()) {
        handleMapUrlSearch();
      }
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [cidInput, mapUrlInput, searchMethod]);
  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 lg:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl font-semibold text-gray-900">
            <MapPin className="h-5 w-5" />
            {t("title")}
          </CardTitle>

          {/* Search Data Engine */}
          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <Label className="text-sm font-medium text-gray-700">
              {t("searchDataEngine")}
            </Label>
            <RadioGroup
              value={formData.searchDataEngine}
              onValueChange={handleSearchDataEngineChange}
              className="flex flex-row gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Map API" id="map-api" />
                <Label htmlFor="map-api" className="text-sm">
                  {t("mapApi")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Briefcase API" id="briefcase-api" />
                <Label htmlFor="briefcase-api" className="text-sm">
                  {t("briefcaseApi")}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 lg:space-y-5 overflow-y-auto flex-1 pb-4 sm:pb-6">
        <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
          {/* Business Location Section */}
          <div className="">
            {/* Project Selection and Search Method in single row */}
            <div className="">
              {/* Search Method Selection */}
              <div className="space-y-3 mb-4">
                <Label className="text-sm font-medium">{t("searchBy")}</Label>
                <RadioGroup
                  value={searchMethod}
                  onValueChange={(value) =>
                    setSearchMethod(value as "google" | "cid" | "map_url")
                  }
                  className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                  disabled={disabled}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="google" id="google-search" />
                    <Label htmlFor="google-search" className="text-sm">
                      {t("businessName")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cid" id="cid-search" />
                    <Label htmlFor="cid-search" className="text-sm">
                      {t("cid")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="map_url" id="map-url-search" />
                    <Label htmlFor="map-url-search" className="text-sm">
                      {t("mapUrl")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Search Input */}
            <div className="space-y-2">
              {searchMethod === "google" ? (
                <div>
                  {/* <Label htmlFor="business-search" className="text-sm font-medium">
                    Business Name
                  </Label> */}
                  <BusinessGooglePlacesInput
                    onPlaceSelect={handlePlaceSelect}
                    disabled={disabled}
                    placeholder={t("searchPlaceholder")}
                  />
                </div>
              ) : searchMethod === "cid" ? (
                <div className="space-y-2">
                  {/* <Label htmlFor="cid-input" className="text-sm font-medium">
                    CID Number
                  </Label> */}
                  <Input
                    id="cid-input"
                    value={cidInput}
                    onChange={(e) => setCidInput(e.target.value)}
                    placeholder={t("cidPlaceholder")}
                    disabled={disabled}
                    className="w-full"
                  />
                  {loading && searchMethod === "cid" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      {t("searching")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {/* <Label htmlFor="map-url-input" className="text-sm font-medium">
                    Google Maps URL
                  </Label> */}
                  <Input
                    id="map-url-input"
                    value={mapUrlInput}
                    onChange={(e) => setMapUrlInput(e.target.value)}
                    placeholder={t("urlPlaceholder")}
                    disabled={disabled}
                    className="w-full"
                  />
                  {loading && searchMethod === "map_url" && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <RefreshCw className="h-3 w-3 animate-spin" />
                      {t("searching")}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Business Display */}
            {selectedBusiness && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-2 hidden">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">
                    {t("selectedBusiness")}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBusinessReset}
                    disabled={disabled}
                    className="h-8 px-2"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="font-medium">{t("name")}</span>
                    <p className="text-muted-foreground truncate">
                      {selectedBusiness.name}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">{t("latitude")}</span>
                    <p className="text-muted-foreground">
                      {selectedBusiness.latitude}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium">{t("longitude")}</span>
                    <p className="text-muted-foreground">
                      {selectedBusiness.longitude}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Helper Text */}
            <div className="text-xs text-muted-foreground">
              {searchMethod === "google" ? (
                <p>{t("searchHelpGoogle")}</p>
              ) : searchMethod === "cid" ? (
                <p>{t("searchHelpCID")}</p>
              ) : (
                <p>{t("searchHelpMapUrl")}</p>
              )}
            </div>
          </div>
          {/* Keywords */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="keywords"
                className="text-sm font-medium text-gray-700"
              >
                {t("keywords")} ({keywordCount}/5)
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
                    <p>{t("keywordTooltip")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="keywords"
              placeholder={t("keywordPlaceholder")}
              value={formData.keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="w-full"
            />
            {keywordCount === 5 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                {t("keywordLimitMessage")}
              </p>
            )}
          </div>

          {/* Map Point */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              {t("mapPoint")}
            </Label>
            <Select
              value={formData.mapPoint}
              onValueChange={(value) => onInputChange("mapPoint", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">{t("automatic")}</SelectItem>
                <SelectItem value="Manually">{t("manually")}</SelectItem>
              </SelectContent>
            </Select>
            {formData.mapPoint === "Manually" && (
              <div className="space-y-2">
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  {t("manualPointsHint")}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {t("pointsSelected")}: {manualCoordinates.length}
                  </span>
                  {manualCoordinates.length > 0 && onClearManualCoordinates && (
                    <button
                      type="button"
                      onClick={onClearManualCoordinates}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      {t("clearAllPoints")}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {formData.mapPoint !== "Manually" && (
            <div className="grid grid-cols-2 gap-4">
              {/* Distance Unit */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("distanceUnit")}
                </Label>
                <RadioGroup
                  value={formData.distanceUnit}
                  onValueChange={(val) => onInputChange("distanceUnit", val)}
                  className="flex flex-row gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Meters" id="meters" />
                    <Label htmlFor="meters" className="text-sm">
                      {t("meters")}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Miles" id="miles" />
                    <Label htmlFor="miles" className="text-sm">
                      {t("miles")}
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Distance Value */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("distance")}
                </Label>
                <Select
                  value={formData.distanceValue}
                  onValueChange={(val) => onInputChange("distanceValue", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("choose")} />
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
                {t("gridSize")}
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
                {t("scheduleCheck")}
              </Label>
              <Select
                value={formData.scheduleCheck}
                onValueChange={(value) => onInputChange("scheduleCheck", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onetime">{t("onetime")}</SelectItem>
                  <SelectItem value="weekly">{t("weekly")}</SelectItem>
                  <SelectItem value="monthly">{t("monthly")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* Language Selector */}
            <div className="space-y-2 col-span-12 md:col-span-6">
              <Label className="text-sm font-medium text-gray-700">
                {t("language")}
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

            {/* Project Selection */}
            <div className="space-y-2 col-span-12 md:col-span-6">
              <Label className="text-sm font-medium">
                {t("selectProject")}
              </Label>
              <Select
                value={selectedProject?.id || ""}
                onValueChange={handleProjectSelect}
                disabled={disabled || projectsLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      projectsLoading ? t("loadingProjects") : t("selectP")
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.project_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Updated buttons section - single row layout */}
          <div className="flex gap-3 flex-wrap">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={
                submittingRank || pollingKeyword || !isKeywordCountValid
              }
              onClick={onAddKeywordsSubmit ? onAddKeywordsSubmit : undefined}
            >
              {pollingKeyword
                ? t("processingKeyword")
                : submittingRank
                ? t("checkingRank")
                : onAddKeywordsSubmit
                ? t("addKeywords")
                : t("checkRank")}
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
                {t("reset")}
              </Button>
            )}
          </div>

          {pollingKeyword && (
            <div className="text-center mt-2">
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                {t("keywordProcessingNote")}
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
