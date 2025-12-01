import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BulkReplyListingSelector } from "@/components/BulkAutoReply/BulkReplyListingSelector";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { PostTypeOption } from "../types";

interface Step1SelectListingsProps {
  selectedListings: string[];
  postType: string;
  postTypeOptions: PostTypeOption[];
  onListingsChange: (listings: string[]) => void;
  onPostTypeChange: (value: string) => void;
  onNext: () => void;
  isGeneratingCSV: boolean;
  canProceed: boolean;
}

export const Step1SelectListings = React.memo<Step1SelectListingsProps>(({
  selectedListings,
  postType,
  postTypeOptions,
  onListingsChange,
  onPostTypeChange,
  onNext,
  isGeneratingCSV,
  canProceed,
}) => {
  const { t } = useI18nNamespace("MultidashboardPages/importPostCSVWizard");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">
          {t("importPostCSVWizard.selectListings.heading")}
        </h2>
        <p className="text-muted-foreground">
          {t("importPostCSVWizard.selectListings.description")}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <BulkReplyListingSelector
            selectedListings={selectedListings}
            onListingsChange={onListingsChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            {t("importPostCSVWizard.selectListings.postTypeLabel")}
          </label>
          <Select value={postType} onValueChange={onPostTypeChange}>
            <SelectTrigger>
              <SelectValue
                placeholder={t("importPostCSVWizard.selectListings.postTypePlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              {postTypeOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={option.value === "0"}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canProceed || isGeneratingCSV}>
          {isGeneratingCSV ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {t("importPostCSVWizard.selectListings.generatingCSV")}
            </>
          ) : (
            t("importPostCSVWizard.selectListings.next")
          )}
        </Button>
      </div>
    </div>
  );
});

Step1SelectListings.displayName = "Step1SelectListings";
