import { Info, RotateCcw, Download } from "lucide-react";
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
  onMapUrlChange: (url: string) => void;
  onRadiusChange: (radius: string) => void;
  onInputChange: (field: keyof MapCreatorFormData, value: string) => void;
  onReset: () => void;
  onGenerateCSV: () => void;
}

export const MapCreatorForm: React.FC<MapCreatorFormProps> = ({
  formData,
  availableDistances,
  onMapUrlChange,
  onRadiusChange,
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
      {/* Form Grid - 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="space-y-4">
          <FormField
            label="Map URL"
            tooltip="Enter a Google Maps URL containing the business location"
          >
            <Input
              type="text"
              placeholder="https://www.google.com/maps/place/..."
              value={formData.mapUrl}
              onChange={(e) => onMapUrlChange(e.target.value)}
            />
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
        </div>

        {/* Column 2 */}
        <div className="space-y-4">
          <FormField
            label="Distance"
            tooltip="Select a distance value less than the radius"
          >
            <Select
              value={formData.distance}
              onValueChange={(value) => onInputChange("distance", value)}
              disabled={formData.radius === "0"}
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
          </FormField>

          <FormField
            label="Description (Spin text allowed)"
            tooltip="Enter a description. Spin text syntax is supported: {option1|option2|option3}"
          >
            <Textarea
              placeholder="Best {pizza|italian food|pasta} in town"
              rows={4}
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
            />
          </FormField>
        </div>

        {/* Column 3 */}
        <div className="space-y-4">
          <FormField
            label="URLs"
            tooltip="Enter URLs separated by commas"
          >
            <Textarea
              placeholder="https://example.com, https://example2.com"
              rows={3}
              value={formData.urls}
              onChange={(e) => onInputChange("urls", e.target.value)}
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
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button onClick={onGenerateCSV}>
          <Download className="w-4 h-4 mr-2" />
          Generate CSV
        </Button>
      </div>
    </div>
  );
};
