import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  UserCheck,
  Trash2,
  Settings,
  Loader2,
  Building2,
  Mail,
  Phone,
  Calendar,
  Tag,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Lead } from "./LeadsTable";
import {
  useGetLeadClassifierDetails,
  useUpdateLeadClassifierDetails,
} from "@/api/leadApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface LeadClassifierModalProps {
  open: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const LeadClassifierModal: React.FC<LeadClassifierModalProps> = ({
  open,
  onClose,
  lead,
}) => {
  const { t } = useI18nNamespace("Laed-module-component/LeadClassifierModal");

  // Lead classification data structure based on the provided HTML
  const leadCategories = {
    "web-lead": {
      label: t("leadClassifier.tabs.webLead"),
      icon: Globe,
      options: [
        { value: "1", label: t("leadClassifier.options.1") },
        { value: "2", label: t("leadClassifier.options.2") },
        { value: "3", label: t("leadClassifier.options.3") },
        { value: "4", label: t("leadClassifier.options.4") },
        { value: "5", label: t("leadClassifier.options.5") },
        { value: "6", label: t("leadClassifier.options.6") },
      ],
    },
    "new-client": {
      label: t("leadClassifier.tabs.newClient"),
      icon: UserCheck,
      options: [{ value: "7", label: t("leadClassifier.options.7") }],
    },
    "bad-lead": {
      label: t("leadClassifier.tabs.badLead"),
      icon: Trash2,
      options: [
        { value: "8", label: t("leadClassifier.options.8") },
        { value: "9", label: t("leadClassifier.options.9") },
      ],
    },
    other: {
      label: t("leadClassifier.tabs.other"),
      icon: Settings,
      options: [
        { value: "10", label: t("leadClassifier.options.10") },
        { value: "11", label: t("leadClassifier.options.11") },
        { value: "12", label: t("leadClassifier.options.12") },
        { value: "13", label: t("leadClassifier.options.13") },
      ],
    },
  };

  // Business Details Component
  const BusinessDetailsPanel: React.FC<{
    lead: Lead;
    fetchedData: any;
    isLoading: boolean;
  }> = ({ lead, fetchedData, isLoading }) => {
    const displayData = fetchedData || lead;

    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t("leadClassifier.businessDetails")}
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("leadClassifier.businessName")}
                </p>
                <p className="text-sm">
                  {displayData?.business_name ||
                    displayData?.businessName ||
                    t("leadClassifier.notProvided")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("leadClassifier.email")}
                </p>
                <p className="text-sm">
                  {displayData?.email || t("leadClassifier.notProvided")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("leadClassifier.phone")}
                </p>
                <p className="text-sm">
                  {displayData?.phone || t("leadClassifier.notProvided")}
                </p>
              </div>
            </div>

            {displayData?.website && (
              <div className="flex items-start gap-3">
                <ExternalLink className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("leadClassifier.website")}
                  </p>
                  <a
                    href={displayData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {displayData.website}
                  </a>
                </div>
              </div>
            )}

            {displayData?.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("leadClassifier.address")}
                  </p>
                  <p className="text-sm">{displayData.address}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Settings className="h-4 w-4 mt-1 text-muted-foreground flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {t("leadClassifier.leadCategory")}
                </p>
                <p className="text-sm">
                  {displayData?.leadCategoryLabel ||
                    lead.leadCategoryLabel ||
                    t("leadClassifier.notClassified")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("web-lead");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch lead classifier details
  const {
    data: classifierData,
    isLoading: isLoadingClassifier,
    refetch,
  } = useGetLeadClassifierDetails(lead ? parseInt(lead.id) : null);

  const updateClassifierMutation = useUpdateLeadClassifierDetails();

  // Function to determine which tab a category value belongs to
  const getCategoryTab = (categoryValue: string): string => {
    for (const [tabKey, category] of Object.entries(leadCategories)) {
      if (category.options.some((option) => option.value === categoryValue)) {
        return tabKey;
      }
    }
    return "web-lead"; // Default fallback
  };

  // Initialize form data when classifier data is loaded
  useEffect(() => {
    if (classifierData?.data && open) {
      const { leadCategoryValue, leadnote } = classifierData.data;
      if (leadCategoryValue) {
        setSelectedCategory(leadCategoryValue);
        setActiveTab(getCategoryTab(leadCategoryValue));
      }
      setNotes(leadnote || "");
      setIsDataLoaded(true);
    }
  }, [classifierData, open]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open && lead) {
      // Only reset if no data is being loaded
      if (!classifierData?.data && !isLoadingClassifier) {
        setSelectedCategory("");
        setNotes("");
        setActiveTab("web-lead");
        setIsDataLoaded(false);
      }
    } else if (!open) {
      // Always reset form when closing
      setSelectedCategory("");
      setNotes("");
      setActiveTab("web-lead");
      setIsDataLoaded(false);
    }
  }, [open, lead, classifierData, isLoadingClassifier]);

  const handleSubmit = async () => {
    if (!selectedCategory) {
      toast.error(t("leadClassifier.errors.selectClassification"));
      return;
    }

    if (!lead) {
      toast.error(t("leadClassifier.errors.leadUnavailable"));
      return;
    }

    setIsSubmitting(true);

    try {
      await updateClassifierMutation.mutateAsync({
        leadId: parseInt(lead.id),
        leadCategoryValue: parseInt(selectedCategory),
        leadNote: notes,
      });

      // Refetch the classifier data to get updated values
      refetch();
      handleClose();
    } catch (error) {
      // Error handling is done in the mutation
      console.error("Failed to update lead classification:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory("");
    setNotes("");
    setActiveTab("web-lead");
    setIsDataLoaded(false);

    // Import and call comprehensive cleanup to fix pointer-events issue
    import("@/utils/domUtils").then(({ comprehensiveCleanup }) => {
      comprehensiveCleanup();
    });

    onClose();
  };

  const handleRadioChange = (value: string) => {
    setSelectedCategory(value);
  };

  if (!lead) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("leadClassifier.title")}</DialogTitle>
          <DialogDescription>
            {t("leadClassifier.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Business Details Panel - Left Side */}
          <div className="lg:col-span-2">
            <BusinessDetailsPanel
              lead={lead}
              fetchedData={classifierData?.data}
              isLoading={isLoadingClassifier}
            />
          </div>

          {/* Classification Panel - Right Side */}
          <div className="lg:col-span-3 space-y-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 h-auto bg-muted p-1 rounded-lg">
                {Object.entries(leadCategories).map(([key, category]) => {
                  const IconComponent = category.icon;
                  return (
                    <TabsTrigger
                      key={key}
                      value={key}
                      className="flex flex-col items-center gap-1 text-xs py-3 px-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm rounded-md transition-all min-h-[60px]"
                    >
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      <span className="hidden sm:inline text-center leading-tight">
                        {category.label}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="mt-6">
                {Object.entries(leadCategories).map(([key, category]) => (
                  <TabsContent
                    key={key}
                    value={key}
                    className="space-y-4 mt-0 bg-background border border-border rounded-lg p-4"
                  >
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">
                        {t("leadClassifier.selectClassification", {
                          category: category.label,
                        })}
                        {/* Select {category.label} Classification: */}
                      </h4>
                      <RadioGroup
                        value={selectedCategory}
                        onValueChange={handleRadioChange}
                        className="space-y-3"
                      >
                        {category.options.map((option) => (
                          <div
                            key={option.value}
                            className="flex items-start space-x-3 py-1"
                          >
                            <RadioGroupItem
                              value={option.value}
                              id={`radio-${option.value}`}
                              className="mt-0.5 flex-shrink-0"
                            />
                            <Label
                              htmlFor={`radio-${option.value}`}
                              className="text-sm font-normal cursor-pointer flex-1 leading-5"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                {t("leadClassifier.leadNotes")}
              </Label>
              <Textarea
                id="notes"
                placeholder={t("leadClassifier.notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("leadClassifier.cancel")}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t("leadClassifier.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
