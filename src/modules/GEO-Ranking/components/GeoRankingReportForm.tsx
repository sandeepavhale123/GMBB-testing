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
import { keywordsSchema } from "@/schemas/authSchemas";
import { BusinessGooglePlacesInput } from "@/components/BusinessSearch/BusinessGooglePlacesInput";
import { getBusinessDetailsFromCID, getBusinessDetailsFromMapUrl, getProjectLists } from "@/api/businessSearchApi";

// Simple type definitions to avoid complex inference
type SimpleProject = {
  id: string;
  project_name: string;
};

type SimpleBusinessDetails = {
  business_name: string;
  lat: string;
  long: string;
  searchType?: number;
  inputText?: string;
};

interface FormData {
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
  selectedProject: { id: string; project_name: string } | null;
  searchMethod: 'google' | 'cid' | 'map_url';
  cidInput: string;
  mapUrlInput: string;
}

interface GeoRankingReportFormProps {
  formData: FormData;
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
  onBusinessSelect?: (business: BusinessDetails) => void;
  onProjectSelect?: (project: Project | null) => void;
}

export const GeoRankingReportForm: React.FC<GeoRankingReportFormProps> = ({
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
}) => {
  const { data: mapApiKeyData } = useGetMapApiKey();
  const keywordsValidation = useFormValidation(keywordsSchema);

  // Business search state
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
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
          title: "Missing API Key",
          description:
            "Please add the API key first by going to Settings → Integration page.",
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
        title: "Keyword Limit Exceeded",
        description:
          "Only the first 5 keywords were added. Maximum limit is 5 keywords.",
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
        title: "Invalid Keywords",
        description:
          validation.errors.keywords || "Please check your keywords.",
        variant: "destructive",
      });
    }

    // Always update the form data (even if invalid, to show the user's input)
    onInputChange("keywords", value);
  };

  // Business search handlers
  const handlePlaceSelect = (business: BusinessDetails) => {
    setSelectedBusiness(business);
    onBusinessSelect?.(business);
    toast({
      title: "Business Selected",
      description: `Selected: ${business.business_name}`
    });
  };

  const parseLatLong = (latlong: string): { lat: string; long: string } => {
    const [lat, long] = latlong.split(',');
    return {
      lat: lat?.trim() || '',
      long: long?.trim() || ''
    };
  };

  const handleMapUrlSearch = async () => {
    if (!formData.mapUrlInput.trim() || loading) return;
    try {
      setLoading(true);
      const response = await getBusinessDetailsFromMapUrl(formData.mapUrlInput.trim());
      if (response.code === 200 && response.data) {
        const { lat, long } = parseLatLong(response.data.latlong);
        const business: BusinessDetails = {
          business_name: response.data.bname,
          lat,
          long,
          searchType: 2,
          inputText: formData.mapUrlInput.trim()
        };
        setSelectedBusiness(business);
        onBusinessSelect?.(business);
        toast({
          title: "Business Found",
          description: `Found: ${business.business_name}`
        });
      } else {
        toast({
          title: "Business Not Found",
          description: "No business found for the provided map URL.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Map URL search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search business from map URL. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCIDSearch = async () => {
    if (!formData.cidInput.trim() || loading) return;
    if (!/^\d+$/.test(formData.cidInput.trim())) {
      return;
    }
    try {
      setLoading(true);
      const response = await getBusinessDetailsFromCID(formData.cidInput.trim());
      if (response.code === 200 && response.data) {
        const business: BusinessDetails = {
          business_name: response.data.business_name,
          lat: response.data.lat,
          long: response.data.long,
          searchType: 3,
          inputText: formData.cidInput.trim()
        };
        setSelectedBusiness(business);
        onBusinessSelect?.(business);
        toast({
          title: "Business Found",
          description: `Found: ${business.business_name}`
        });
      } else {
        toast({
          title: "Business Not Found",
          description: "No business found for the provided CID.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('CID search error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to search business by CID. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    const project = projects.find(p => p.id === projectId) || null;
    // Use a custom update approach since selectedProject is an object
    const updateEvent = {
      target: { name: 'selectedProject', value: project }
    };
    // Trigger onChange for the selectedProject field
    onInputChange("selectedProject", JSON.stringify(project || null));
    onProjectSelect?.(project);
    if (project) {
      toast({
        title: "Project Selected",
        description: `Selected: ${project.project_name}`
      });
    }
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
            title: "Failed to Load Projects",
            description: "Could not fetch project list. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        toast({
          title: "Error Loading Projects",
          description: "Failed to load project list. Please try again.",
          variant: "destructive"
        });
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Debouncing for CID and Map URL searches
  useEffect(() => {
    if (!formData.cidInput.trim() && !formData.mapUrlInput.trim()) return;
    const timeoutId = setTimeout(() => {
      if (formData.searchMethod === 'cid' && formData.cidInput.trim() && /^\d+$/.test(formData.cidInput.trim())) {
        handleCIDSearch();
      } else if (formData.searchMethod === 'map_url' && formData.mapUrlInput.trim()) {
        handleMapUrlSearch();
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [formData.cidInput, formData.mapUrlInput, formData.searchMethod]);

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3 lg:pb-4">
        <CardTitle className="text-lg lg:text-xl font-semibold text-gray-900">
          Report Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 lg:space-y-5 overflow-y-auto flex-1 pb-4 sm:pb-6">
        {/* Business Search Section */}
        <div className="space-y-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project Configuration</Label>
            <Select 
              value={formData.selectedProject?.id || ""} 
              onValueChange={handleProjectSelect} 
              disabled={projectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select a project"} />
              </SelectTrigger>
              <SelectContent className="max-h-[200px] overflow-y-auto">
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.selectedProject && (
              <p className="text-xs text-muted-foreground">
                Selected: {formData.selectedProject.project_name}
              </p>
            )}
          </div>

          {/* Search Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Search Method</Label>
            <RadioGroup 
              value={formData.searchMethod} 
              onValueChange={(value) => onInputChange("searchMethod", value as 'google' | 'cid' | 'map_url')} 
              className="flex flex-row gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="google" id="google-search" />
                <Label htmlFor="google-search" className="text-sm">
                  Google Auto Suggestion
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cid" id="cid-search" />
                <Label htmlFor="cid-search" className="text-sm">
                  CID Lookup
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="map_url" id="map-url-search" />
                <Label htmlFor="map-url-search" className="text-sm">
                  Map URL
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            {formData.searchMethod === 'google' ? (
              <div>
                <Label htmlFor="business-search" className="text-sm font-medium">
                  Business Name
                </Label>
                <BusinessGooglePlacesInput 
                  onPlaceSelect={handlePlaceSelect} 
                  placeholder="Start typing to search for a business..." 
                />
              </div>
            ) : formData.searchMethod === 'cid' ? (
              <div className="space-y-2">
                <Label htmlFor="cid-input" className="text-sm font-medium">
                  CID Number
                </Label>
                <Input 
                  id="cid-input" 
                  value={formData.cidInput} 
                  onChange={(e) => onInputChange("cidInput", e.target.value)} 
                  placeholder="Enter CID number (e.g., 2898559807244638920)" 
                  className="w-full" 
                />
                {loading && formData.searchMethod === 'cid' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Searching...
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="map-url-input" className="text-sm font-medium">
                  Google Maps URL
                </Label>
                <Input 
                  id="map-url-input" 
                  value={formData.mapUrlInput} 
                  onChange={(e) => onInputChange("mapUrlInput", e.target.value)} 
                  placeholder="Paste Google Maps URL (e.g., https://maps.google.com/...)" 
                  className="w-full" 
                />
                {loading && formData.searchMethod === 'map_url' && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Searching...
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Helper Text */}
          <div className="text-xs text-muted-foreground">
            {formData.searchMethod === 'google' ? (
              <p>Use Google Places autocomplete to find and select your business location.</p>
            ) : formData.searchMethod === 'cid' ? (
              <p>Enter a Google CID (Customer ID) - search happens automatically as you type.</p>
            ) : (
              <p>Paste a Google Maps URL - search happens automatically as you type.</p>
            )}
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 lg:space-y-6">
          {/* Keywords */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="keywords"
                className="text-sm font-medium text-gray-700"
              >
                Keywords ({keywordCount}/5)
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
                    <p>Add up to 5 keywords separated by commas</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="keywords"
              placeholder="keyword1, keyword2, keyword3"
              value={formData.keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="w-full"
            />
            {keywordCount === 5 && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ You have reached the maximum limit of 5 keywords. You can
                still edit existing keywords.
              </p>
            )}
          </div>

          {/* Search Data Engine */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Search Data Engine
            </Label>
            <RadioGroup
              value={formData.searchDataEngine}
              onValueChange={handleSearchDataEngineChange}
              className="flex flex-row gap-4 sm:gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Map API" id="map-api" />
                <Label htmlFor="map-api" className="text-sm">
                  Map API
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Briefcase API" id="briefcase-api" />
                <Label htmlFor="briefcase-api" className="text-sm">
                  Briefcase API
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Map Point */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Map Point
            </Label>
            <Select
              value={formData.mapPoint}
              onValueChange={(value) => onInputChange("mapPoint", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Automatic">Automatic</SelectItem>
                <SelectItem value="Manually">Manually</SelectItem>
              </SelectContent>
            </Select>
            {formData.mapPoint === "Manually" && (
              <div className="space-y-2">
                <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                  Click on the map to place points manually. You can drag them
                  to reposition.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Points selected: {manualCoordinates.length}
                  </span>
                  {manualCoordinates.length > 0 && onClearManualCoordinates && (
                    <button
                      type="button"
                      onClick={onClearManualCoordinates}
                      className="text-xs text-red-600 hover:text-red-800 underline"
                    >
                      Clear All Points
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
                  Distance Unit
                </Label>
                <RadioGroup
                  value={formData.distanceUnit}
                  onValueChange={(val) => onInputChange("distanceUnit", val)}
                  className="flex flex-col gap-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Meters" id="meters" />
                    <Label htmlFor="meters" className="text-sm">
                      Meters
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Miles" id="miles" />
                    <Label htmlFor="miles" className="text-sm">
                      Miles
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Distance Value */}
              <div className="space-y-2 col-span-1">
                <Label className="text-sm font-medium text-gray-700">
                  Distance
                </Label>
                <Select
                  value={formData.distanceValue}
                  onValueChange={(val) => onInputChange("distanceValue", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose…" />
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
                Grid Size
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
                Schedule Check
              </Label>
              <Select
                value={formData.scheduleCheck}
                onValueChange={(value) => onInputChange("scheduleCheck", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="onetime">One-time</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Language
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
              disabled={submittingRank || pollingKeyword || !isKeywordCountValid}
            >
              {pollingKeyword
                ? "Processing keyword..."
                : submittingRank
                ? "Checking rank..."
                : "Check rank"}
            </Button>

            {shouldShowResetButton && (
              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={submittingRank || pollingKeyword}
                className="flex-none"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset & New Search
              </Button>
            )}
          </div>

          {pollingKeyword && (
            <div className="text-center mt-2">
              <p className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                🔄 Keyword is being processed. This may take a few minutes...
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};