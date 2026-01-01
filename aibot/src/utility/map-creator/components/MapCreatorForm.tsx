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
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

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
  const { t } = useI18nNamespace("mapCreator-components/mapCreatorForm");
  return (
    <div className="space-y-6">
      {/* Row 1: Map URL, Keyword, Radius, Distance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FormField
          label={t("fields.mapUrl.label")}
          tooltip={t("fields.mapUrl.tooltip")}
        >
          <div className="space-y-1">
            <Input
              type="text"
              placeholder={t("fields.mapUrl.placeholder")}
              value={formData.mapUrl}
              onChange={(e) => onMapUrlChange(e.target.value)}
              disabled={isLoadingCoordinates}
            />
            {isLoadingCoordinates && (
              <p className="text-xs text-muted-foreground">
                {t("fields.mapUrl.loading")}
              </p>
            )}
          </div>
        </FormField>

        <FormField
          label={t("fields.keywords.label")}
          tooltip={t("fields.keywords.tooltip")}
        >
          <Input
            type="text"
            placeholder={t("fields.keywords.placeholder")}
            value={formData.keywords}
            onChange={(e) => onInputChange("keywords", e.target.value)}
          />
        </FormField>

        <FormField
          label={t("fields.radius.label")}
          tooltip={t("fields.radius.tooltip")}
        >
          <Select value={formData.radius} onValueChange={onRadiusChange}>
            <SelectTrigger>
              <SelectValue placeholder={t("fields.radius.placeholder")} />
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
          label={t("fields.distance.label")}
          tooltip={t("fields.distance.tooltip")}
        >
          <div className="space-y-1">
            <Select
              value={formData.distance}
              onValueChange={onDistanceChange}
              disabled={formData.radius === "0" || isLoadingCircle}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("fields.distance.placeholder")} />
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
                {t("fields.distance.loading")}
              </p>
            )}
          </div>
        </FormField>
      </div>

      {/* Row 2: Description, URLs, Related Searches, Generate Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <FormField
          label={t("fields.description.label")}
          tooltip={t("fields.description.tooltip")}
        >
          <Textarea
            placeholder={t("fields.description.placeholder")}
            rows={3}
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
          />
        </FormField>

        <FormField
          label={t("fields.businessDetails.label")}
          tooltip={t("fields.businessDetails.tooltip")}
        >
          <Textarea
            placeholder={t("fields.businessDetails.placeholder")}
            rows={3}
            value={formData.businessDetails}
            onChange={(e) => onInputChange("businessDetails", e.target.value)}
          />
        </FormField>

        <FormField
          label={t("fields.relatedSearches.label")}
          tooltip={t("fields.relatedSearches.tooltip")}
        >
          <Textarea
            placeholder={t("fields.relatedSearches.placeholder")}
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
                {t("actions.generating")}
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                {t("actions.generate")}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onReset} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" />
            {t("actions.reset")}
          </Button>
        </div>
      </div>
    </div>
  );
};
