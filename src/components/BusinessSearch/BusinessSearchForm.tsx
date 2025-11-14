import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { BusinessGooglePlacesInput } from "./BusinessGooglePlacesInput";
import {
  getBusinessDetailsFromCID,
  getBusinessDetailsFromMapUrl,
  getProjectLists,
} from "@/api/businessSearchApi";
import { toast } from "@/hooks/use-toast";
import { MapPin, Search, RefreshCw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { BusinessLocationLite, ProjectLite } from "@/types/business";

interface BusinessSearchFormProps {
  onBusinessSelect?: (business: BusinessLocationLite) => void;
  onProjectSelect?: (project: ProjectLite | null) => void;
  disabled?: boolean;
}
export function BusinessSearchForm({
  onBusinessSelect,
  onProjectSelect,
  disabled = false,
}: BusinessSearchFormProps) {
  const [searchMethod, setSearchMethod] = useState<
    "google" | "cid" | "map_url"
  >("google");
  const [cidInput, setCidInput] = useState("");
  const [mapUrlInput, setMapUrlInput] = useState("");
  const [selectedBusiness, setSelectedBusiness] =
    useState<BusinessLocationLite | null>(null);
  const [loading, setLoading] = useState(false);

  const [projects, setProjects] = useState<ProjectLite[]>([]);
  const [selectedProject, setSelectedProject] = useState<ProjectLite | null>(
    null
  );
  const [projectsLoading, setProjectsLoading] = useState(false);
  const handlePlaceSelect = (business: BusinessLocationLite) => {
    // Google Places doesn't need searchType/inputText for the geo module API
    setSelectedBusiness(business);
    onBusinessSelect?.(business);
    toast({
      title: "Business Selected",
      description: `Selected: ${business.name}`,
    });
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
        toast({
          title: "Business Found",
          description: `Found: ${business.name}`,
        });
      } else {
        toast({
          title: "Business Not Found",
          description: "No business found for the provided map URL.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // console.error("Map URL search error:", error);
      toast({
        title: "Search Failed",
        description:
          "Failed to search business from map URL. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCIDSearch = async () => {
    if (!cidInput.trim() || loading) return;

    // Validate CID format (should be numeric)
    if (!/^\d+$/.test(cidInput.trim())) {
      return; // Don't show error for invalid format during typing
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
        toast({
          title: "Business Found",
          description: `Found: ${business.name}`,
        });
      } else {
        toast({
          title: "Business Not Found",
          description: "No business found for the provided CID.",
          variant: "destructive",
        });
      }
    } catch (error) {
      // console.error("CID search error:", error);
      toast({
        title: "Search Failed",
        description: "Failed to search business by CID. Please try again.",
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
    if (project) {
      toast({
        title: "Project Selected",
        description: `Selected: ${project.project_name}`,
      });
    }
  };
  const handleReset = () => {
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
            title: "Failed to Load Projects",
            description: "Could not fetch project list. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        // console.error("Failed to fetch projects:", error);
        toast({
          title: "Error Loading Projects",
          description: "Failed to load project list. Please try again.",
          variant: "destructive",
        });
      } finally {
        setProjectsLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [cidInput, mapUrlInput, searchMethod]);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Business Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project Selection and Search Method in single row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Project Configuration</Label>
            <Select
              value={selectedProject?.id || ""}
              onValueChange={handleProjectSelect}
              disabled={disabled || projectsLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    projectsLoading ? "Loading projects..." : "Select a project"
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
            {selectedProject && (
              <p className="text-xs text-muted-foreground">
                Selected: {selectedProject.project_name}
              </p>
            )}
          </div>

          {/* Search Method Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Search Method</Label>
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
        </div>

        {/* Search Input */}
        <div className="space-y-2">
          {searchMethod === "google" ? (
            <div>
              <Label htmlFor="business-search" className="text-sm font-medium">
                Business Name
              </Label>
              <BusinessGooglePlacesInput
                onPlaceSelect={handlePlaceSelect}
                disabled={disabled}
                placeholder="Start typing to search for a business..."
              />
            </div>
          ) : searchMethod === "cid" ? (
            <div className="space-y-2">
              <Label htmlFor="cid-input" className="text-sm font-medium">
                CID Number
              </Label>
              <Input
                id="cid-input"
                value={cidInput}
                onChange={(e) => setCidInput(e.target.value)}
                placeholder="Enter CID number (e.g., 2898559807244638920)"
                disabled={disabled}
                className="w-full"
              />
              {loading && searchMethod === "cid" && (
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
                value={mapUrlInput}
                onChange={(e) => setMapUrlInput(e.target.value)}
                placeholder="Paste Google Maps URL (e.g., https://maps.google.com/...)"
                disabled={disabled}
                className="w-full"
              />
              {loading && searchMethod === "map_url" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  Searching...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Business Display */}
        {selectedBusiness && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 hidden ">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Selected Business</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                disabled={disabled}
                className="h-8 px-2"
              >
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="font-medium">Name:</span>
                <p className="text-muted-foreground truncate">
                  {selectedBusiness.name}
                </p>
              </div>
              <div>
                <span className="font-medium">Latitude:</span>
                <p className="text-muted-foreground">
                  {selectedBusiness.latitude}
                </p>
              </div>
              <div>
                <span className="font-medium">Longitude:</span>
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
            <p>
              Use Google Places autocomplete to find and select your business
              location.
            </p>
          ) : searchMethod === "cid" ? (
            <p>
              Enter a Google CID (Customer ID) - search happens automatically as
              you type.
            </p>
          ) : (
            <p>
              Paste a Google Maps URL - search happens automatically as you
              type.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
