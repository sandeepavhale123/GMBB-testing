import { Info, RotateCcw, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapCreatorFormData, SelectOption } from "../types/mapCreator.types";
import { radiusOptions } from "../data/formOptions";

interface MapCreatorFormProps {
  formData: MapCreatorFormData;
  availableDistances: SelectOption[];
  isLoadingCoordinates: boolean;
  isLoadingCircle: boolean;
  isGeneratingCSV: boolean;
  onMapUrlChange: (url: string) => void;
  onRadiusChange: (radius: string) => void;
  onDistanceChange: (distance: string) => void;
  onInputChange: (field: keyof MapCreatorFormData, value: string) => void;
  onReset: () => void;
  onGenerateCSV: () => void;
}

export const MapCreatorForm: React.FC<MapCreatorFormProps> = ({
  formData,
  availableDistances,
  isLoadingCoordinates,
  isLoadingCircle,
  isGeneratingCSV,
  onMapUrlChange,
  onRadiusChange,
  onDistanceChange,
  onInputChange,
  onReset,
  onGenerateCSV,
}) => {
  const FormField = ({
    label,
    tooltip,
    children,
  }: {
    label: string;
    tooltip: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Map URL, Keyword, Radius, Distance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          label="Map URL"
          tooltip="Enter a Google Maps URL containing the business location"
        >
          <div className="space-y-1">
            <Input
              type="text"
              placeholder="https://www.google.com/maps/place/..."
              value={formData.mapUrl}
              onChange={(e) => onMapUrlChange(e.target.value)}
              disabled={isLoadingCoordinates}
            />
            {isLoadingCoordinates && (
              <p className="text-xs text-muted-foreground">
                Fetching coordinates...
              </p>
            )}
          </div>
        </FormField>

        <FormField
          label="Keywords"
          tooltip="Enter keywords separated by commas (e.g., pizza, italian restaurant)"
        >
          <Input
            type="text"
            placeholder="pizza, italian restaurant, pasta"
            value={formData.keywords}
            onChange={(e) => onInputChange("keywords", e.target.value)}
          />
        </FormField>

        <FormField
          label="Radius"
          tooltip="Select the search radius around the business location"
        >
          <Select value={formData.radius} onValueChange={onRadiusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select radius" />
            </SelectTrigger>
            <SelectContent>
              {radiusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Distance"
          tooltip="Select a distance value less than the radius"
        >
          <div className="space-y-1">
            <Select
              value={formData.distance}
              onValueChange={onDistanceChange}
              disabled={formData.radius === "0" || isLoadingCircle}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select distance" />
              </SelectTrigger>
              <SelectContent>
                {availableDistances.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingCircle && (
              <p className="text-xs text-muted-foreground">
                Generating coordinates...
              </p>
            )}
          </div>
        </FormField>
      </div>

      {/* Row 2: Description, URLs, Related Searches, Generate Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <FormField
          label="Description (Spin text allowed)"
          tooltip="Enter a description. Spin text syntax is supported: {option1|option2|option3}"
        >
          <Textarea
            placeholder="Best {pizza|italian food|pasta} in town"
            rows={3}
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
          />
        </FormField>

        <FormField
          label="Business Details"
          tooltip="Enter business details in format: Business Name - URL"
        >
          <Textarea
            placeholder="Bajaj Finserv - https://example.com"
            rows={3}
            value={formData.businessDetails}
            onChange={(e) => onInputChange("businessDetails", e.target.value)}
          />
        </FormField>

        <FormField
          label="Related Searches"
          tooltip="Enter related search terms separated by commas"
        >
          <Textarea
            placeholder="pizza near me, best pizza"
            rows={3}
            value={formData.relatedSearches}
            onChange={(e) => onInputChange("relatedSearches", e.target.value)}
          />
        </FormField>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={onGenerateCSV} 
            className="w-full"
            disabled={isGeneratingCSV}
          >
            {isGeneratingCSV ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate CSV
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onReset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};
