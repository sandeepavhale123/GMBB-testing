import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Separator } from "../../ui/separator";
import { Checkbox } from "../../ui/checkbox";
import { Card } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import { Plus, Info, Ban } from "lucide-react";
import { AutoReplyToggle } from "./AutoReplyToggle";
import { AIAutoResponseToggle } from "./AIAutoResponseToggle";
import { TemplateCard } from "./TemplateCard";
import { CreateTemplateModal } from "./CreateTemplateModal";
import { useAppSelector, useAppDispatch } from "../../../hooks/useRedux";
import {
  toggleAutoResponse,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  fetchAutoReviewReplySettings,
  updateDNRSetting,
} from "../../../store/slices/reviews";
import { ReplyTemplate } from "../../../store/slices/reviews/templateTypes";
import { useListingContext } from "@/context/ListingContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { ReplyToOldReviewsCard } from "./ReplyToOldReviewsCard";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

export const AutoResponseTab: React.FC = () => {
  const { t } = useI18nNamespace("Reviews/autoResponseTab");
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { autoResponse, templateLoading, dnrUpdating } = useAppSelector(
    (state) => state.reviews
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReplyTemplate | null>(
    null
  );
  const [activeTab, setActiveTab] = useState("review");
  const [aiAutoResponseEnabled, setAiAutoResponseEnabled] = useState(false);
  const [replyToExistingReviews, setReplyToExistingReviews] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local DNR state when data is loaded
  const [noResponseMode, setNoResponseMode] = useState(false);
  useEffect(() => {
    if (autoResponse.DNR !== undefined) {
      setNoResponseMode(autoResponse.DNR);
    }
  }, [autoResponse.DNR]);

  // Fetch settings on mount
  useEffect(() => {
    if (selectedListing?.id) {
      dispatch(fetchAutoReviewReplySettings(Number(selectedListing?.id)));
    }
  }, [dispatch, selectedListing?.id]);

  // Sync toggles with newStatus from autoSettings and autoAiSettings
  useEffect(() => {
    const autoStatus = Number(autoResponse.autoSettings?.newStatus) === 1;
    const aiStatus = Number(autoResponse.autoAiSettings?.newStatus) === 1;

    if (autoStatus && !autoResponse.enabled) {
      dispatch(toggleAutoResponse());
    } else if (!autoStatus && autoResponse.enabled) {
      dispatch(toggleAutoResponse());
    }

    setAiAutoResponseEnabled(aiStatus);
  }, [
    autoResponse.autoSettings?.newStatus,
    autoResponse.autoAiSettings?.newStatus,
  ]);

  // Sync "Reply to Old Reviews" toggle with backend value
  useEffect(() => {
    if (autoResponse.autoSettings?.oldStatus !== undefined) {
      setReplyToExistingReviews(
        Number(autoResponse.autoSettings.oldStatus) === 1
      );
    }
  }, [autoResponse.autoSettings?.oldStatus]);

  const handleToggleAutoResponse = () => {
    if (!autoResponse.enabled) {
      // Enabling auto response, disable AI auto response and no response mode
      setAiAutoResponseEnabled(false);
      if (noResponseMode && selectedListing?.id) {
        dispatch(
          updateDNRSetting({
            listingId: Number(selectedListing.id),
            dnrStatus: 0,
          })
        );
      }
    }
    dispatch(toggleAutoResponse());
  };
  const handleToggleAIAutoResponse = () => {
    const newValue = !aiAutoResponseEnabled;

    if (newValue) {
      // AI is being enabled → turn off Auto Response
      if (autoResponse.enabled) {
        dispatch(toggleAutoResponse());
      }
      if (noResponseMode && selectedListing?.id) {
        dispatch(
          updateDNRSetting({
            listingId: Number(selectedListing.id),
            dnrStatus: 0,
          })
        );
      }
    }

    setAiAutoResponseEnabled(newValue);
  };

  const handleToggleNoResponseMode = () => {
    if (!noResponseMode) {
      // Trying to enable → show modal
      setShowConfirmationModal(true);
    } else {
      if (!selectedListing?.id) return;
      setNoResponseMode(false);
    }
  };

  const hasEnabledTemplate = (settings: any): boolean => {
    if (!settings) return false;

    const ratingWords = ["one", "two", "three", "four", "five"];
    for (let i = 0; i < ratingWords.length; i++) {
      const rating = ratingWords[i];
      const reviewKey = `${rating}TextStatus`;
      const ratingOnlyKey = `${rating}StarStatus`;

      if (settings[reviewKey] === 1 || settings[ratingOnlyKey] === 1) {
        return true;
      }
    }
    return false;
  };

  // Called when user clicks "Yes" in modal
  const handleConfirmNoResponseMode = () => {
    if (!selectedListing?.id) return;

    // Disable auto + AI auto response
    if (autoResponse.enabled) {
      dispatch(toggleAutoResponse());
    }
    setAiAutoResponseEnabled(false);
    dispatch(
      updateDNRSetting({
        listingId: Number(selectedListing.id),
        dnrStatus: 3, // Enabling
      })
    )
      .unwrap()
      .then((res) => {
        toast({
          title: "Success",
          description: res?.message,
          variant: "default",
        });
        setNoResponseMode(true);
        setShowConfirmationModal(false);
      })
      .catch((err) => {
        toast({
          title: "Success",
          description: err?.response?.data?.message || err?.message,
          variant: "default",
        });
      });
  };
  const handleCancelNoResponseMode = () => {
    setShowConfirmationModal(false);
  };
  const handleCreateTemplate = (starRating: number) => {
    setIsModalOpen(true);
  };
  const handleEditTemplate = (template: ReplyTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };
  const handleSaveTemplate = (starRating: number, content: string) => {
    if (editingTemplate) {
      dispatch(
        updateTemplate({
          id: editingTemplate.id,
          content,
          enabled: true,
        })
      );
      setEditingTemplate(null);
    } else {
      // Always create new template, don't update existing ones
      dispatch(
        addTemplate({
          starRating,
          content,
          isRatingOnly: activeTab === "rating-only",
        })
      );
    }
    setIsModalOpen(false);
  };
  const handleDeleteTemplate = (templateId: string) => {
    dispatch(deleteTemplate(templateId));
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTemplate(null);
  };

  // const getTemplateForRating = (rating: number, isRatingOnly = false) => {
  //   const templates = autoResponse.autoSettings?.templates || [];
  //   return templates.find(
  //     (template) =>
  //       template.starRating === rating &&
  //       (template.isRatingOnly || false) === isRatingOnly
  //   );
  // };

  const getTemplateForRating = (
    rating: number,
    isRatingOnly = false
  ): ReplyTemplate | null => {
    const settings = autoResponse.autoSettings;
    if (!settings) return null;

    // Fix the field mapping: _wreply is for rating-only, _reply is for reviews
    const ratingWords = ["one", "two", "three", "four", "five"];
    const fieldPrefix = `star${ratingWords[rating - 1]}`;
    const fieldSuffix = isRatingOnly ? "_wreply" : "_reply";
    const key = `${fieldPrefix}${fieldSuffix}` as keyof typeof settings;
    const rawValue = settings[key];
    const statusKey = `${ratingWords[rating - 1]}${
      isRatingOnly ? "StarStatus" : "TextStatus"
    }` as keyof typeof settings;
    const status = settings[statusKey] ?? 0;

    // Split the content by " | " to get multiple variations
    const contentVariations = rawValue
      .split(" | ")
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    // For display purposes, show the first variation with a note about multiple variations
    const displayContent =
      contentVariations.length > 1
        ? contentVariations[0] + ` (${contentVariations.length} variations)`
        : contentVariations[0] || "";
    return {
      id: `${fieldPrefix}${fieldSuffix}`,
      starRating: rating,
      content: displayContent,
      variations: Array.isArray(contentVariations)
        ? contentVariations
        : [contentVariations],
      isSystem: true,
      enabled: status === 1,
      status, // add this
      createdAt: "",
      updatedAt: "",
      isRatingOnly,
    };
  };

  return (
    <div className="space-y-6">
      {/* Auto Reply Toggle */}
      <AutoReplyToggle
        enabled={autoResponse.enabled}
        onToggle={handleToggleAutoResponse}
      />

      {autoResponse.enabled && (
        <Card className="bg-white p-6">
          {/* Header with Title, Tabs, and Create Button in single row */}
          <div className="w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              {/* Left Section */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("autoResponseTab.replyTemplates.title")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("autoResponseTab.replyTemplates.description")}
                </p>
              </div>

              {/* Right Section - Button Style Tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setActiveTab("review")}
                  className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                    activeTab === "review"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {t("autoResponseTab.replyTemplates.tabs.review")}
                </button>
                <button
                  onClick={() => setActiveTab("rating-only")}
                  className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                    activeTab === "rating-only"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {t("autoResponseTab.replyTemplates.tabs.ratingOnly")}
                </button>
              </div>
            </div>

            {/* Reply for Review Tab Content */}
            {activeTab === "review" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TemplateCard
                      key={rating}
                      starRating={rating}
                      listingId={Number(selectedListing.id)}
                      template={getTemplateForRating(rating, false)}
                      onCreateTemplate={handleCreateTemplate}
                      onEditTemplate={handleEditTemplate}
                      onDeleteTemplate={handleDeleteTemplate}
                    />
                  ))}
                </div>

                {/* Reply to Old Reviews Card - Auto Response Mode */}
                <ReplyToOldReviewsCard
                  checked={replyToExistingReviews}
                  onToggle={setReplyToExistingReviews}
                  onSave={() => {}}
                  listingId={
                    selectedListing?.id ? Number(selectedListing.id) : undefined
                  }
                  isAutoResponseMode={true}
                />
              </div>
            )}

            {/* Reply for Rating Only Tab Content */}
            {activeTab === "rating-only" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <TemplateCard
                      key={`rating-only-${rating}`}
                      starRating={rating}
                      template={getTemplateForRating(rating, true)}
                      listingId={Number(selectedListing.id)}
                      onCreateTemplate={handleCreateTemplate}
                      onEditTemplate={handleEditTemplate}
                      onDeleteTemplate={handleDeleteTemplate}
                      isRatingOnly={true}
                    />
                  ))}
                </div>

                {/* Reply to Old Reviews Card - Auto Response Mode */}
                <ReplyToOldReviewsCard
                  checked={replyToExistingReviews}
                  onToggle={setReplyToExistingReviews}
                  onSave={() => {}}
                  listingId={
                    selectedListing?.id ? Number(selectedListing.id) : undefined
                  }
                  isAutoResponseMode={true}
                />
              </div>
            )}
          </div>

          {/* Divider */}
          <Separator className="my-6" />

          {/* Reply to Existing Reviews Option */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="reply-existing"
                checked={replyToExistingReviews}
                onCheckedChange={(checked) =>
                  setReplyToExistingReviews(checked === true)
                }
              />
              <label
                htmlFor="reply-existing"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Reply to existing reviews (old review)
              </label>
            </div>
            <Button variant="default" size="sm">
              Save Changes
            </Button>
          </div> */}
        </Card>
      )}

      {/* AI Auto Response Toggle */}
      <AIAutoResponseToggle
        enabled={aiAutoResponseEnabled}
        onToggle={handleToggleAIAutoResponse}
        autoAiSettings={autoResponse.autoAiSettings}
        review={autoResponse.review}
      />

      {/* No Response Mode Toggle */}
      <TooltipProvider>
        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Ban className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-base font-medium text-gray-900">
                {t("autoResponseTab.noResponseMode.title")}
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    {t("autoResponseTab.noResponseMode.tooltip")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <Switch
            checked={noResponseMode}
            onCheckedChange={handleToggleNoResponseMode}
            disabled={dnrUpdating}
            className="data-[state=checked]:bg-red-600"
          />
        </div>
      </TooltipProvider>

      {/* Create/Edit Template Modal */}
      <CreateTemplateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTemplate}
        isLoading={templateLoading}
        template={editingTemplate}
      />

      {/* Confirmation Modal */}
      <AlertDialog
        open={showConfirmationModal}
        onOpenChange={setShowConfirmationModal}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {" "}
              {t("autoResponseTab.noResponseMode.modal.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("autoResponseTab.noResponseMode.modal.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNoResponseMode}>
              {t("autoResponseTab.noResponseMode.modal.buttons.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmNoResponseMode}
              className="bg-red-600 hover:bg-red-700"
              disabled={isUpdating}
            >
              {isUpdating
                ? t("autoResponseTab.noResponseMode.modal.buttons.processing")
                : t("autoResponseTab.noResponseMode.modal.buttons.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
