import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
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

export const AutoResponseTab: React.FC = () => {
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

  useEffect(() => {
    if (selectedListing?.id) {
      dispatch(fetchAutoReviewReplySettings(Number(selectedListing?.id)));
    }
  }, [dispatch, selectedListing?.id]);

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
    if (!aiAutoResponseEnabled) {
      // Enabling AI auto response, disable auto response and no response mode
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
    setAiAutoResponseEnabled(!aiAutoResponseEnabled);
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
  //   console.log("templates for auto response", templates);
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
    if (!rawValue || typeof rawValue !== "string") return null;

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
      variations: contentVariations, // Store all variations
      enabled: true,
      createdAt: "",
      updatedAt: "",
      isRatingOnly,
      isSystem: true, // Flag to disable edit/delete for API-sourced templates
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
          <Tabs
            defaultValue="review"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              {/* ✨ Changed to flex-col on small screens and row on lg+ */}

              {/* Left Section */}
              <div className="flex-1">
                {/* ✨ Removed unnecessary nested flex containers */}
                <h3 className="text-lg font-semibold text-gray-900">
                  Reply Templates
                </h3>
                <p className="text-sm text-gray-600">
                  Create personalized templates for different star ratings
                </p>
              </div>

              {/* Right Section */}
              <div className="w-full sm:w-auto">
                {/* ✨ Ensures full width on mobile, auto on sm and up */}
                <TabsList className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* ✨ Removed conflicting w-full and w-auto, added gap for spacing */}
                  <TabsTrigger value="review">Reply for Review</TabsTrigger>
                  <TabsTrigger value="rating-only">
                    Reply for Rating Only
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Reply for Review Tab Content */}
            <TabsContent value="review" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TemplateCard
                    key={rating}
                    starRating={rating}
                    template={getTemplateForRating(rating, false)}
                    onCreateTemplate={handleCreateTemplate}
                    onEditTemplate={handleEditTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                  />
                ))}
              </div>
            </TabsContent>

            {/* Reply for Rating Only Tab Content */}
            <TabsContent value="rating-only" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <TemplateCard
                    key={`rating-only-${rating}`}
                    starRating={rating}
                    template={getTemplateForRating(rating, true)}
                    onCreateTemplate={handleCreateTemplate}
                    onEditTemplate={handleEditTemplate}
                    onDeleteTemplate={handleDeleteTemplate}
                    isRatingOnly={true}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Divider */}
          <Separator className="my-6" />

          {/* Reply to Existing Reviews Option */}
          <div className="flex items-center justify-between">
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
          </div>
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
                Do not respond to review in manual or automated way
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Sometimes your clients don't allow marketing agencies to
                    respond to reviews. In that case this label helps you to
                    identify such listings.
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
            <AlertDialogTitle>Enable No Response Mode?</AlertDialogTitle>
            <AlertDialogDescription>
              If you enable this mode, both auto response and AI auto response
              data will be deleted. Are you sure you want to delete this data
              and proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelNoResponseMode}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmNoResponseMode}
              className="bg-red-600 hover:bg-red-700"
              disabled={isUpdating}
            >
              {isUpdating ? "Processing..." : "Yes, Delete and Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
