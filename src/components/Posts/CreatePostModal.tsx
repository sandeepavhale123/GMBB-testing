import React, { useState } from "react";
import { Eye, X } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { PostPreview } from "./PostPreview";
import { PostPreviewModal } from "./PostPreviewModal";
import { AIDescriptionModal } from "./AIDescriptionModal";
import { AIImageModal } from "./AIImageModal";
import { PostDescriptionSection } from "./CreatePostModal/PostDescriptionSection";
import { PostImageSection } from "./CreatePostModal/PostImageSection";
import { CTAButtonSection } from "./CreatePostModal/CTAButtonSection";
import { AdvancedOptionsSection } from "./CreatePostModal/AdvancedOptionsSection";
import { MultiListingSelector } from "./CreatePostModal/MultiListingSelector";
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import {
  createPost,
  createBulkPost,
  fetchPosts,
  clearCreateError,
} from "../../store/slices/postsSlice";
import { useListingContext } from "../../context/ListingContext";
import { useMediaContext } from "../../context/MediaContext";
import { toast } from "@/hooks/use-toast";
import {
  transformPostForCloning,
  CreatePostFormData,
} from "../../utils/postCloneUtils";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CreatePostFormData | null;
  isCloning?: boolean;
  onBulkPostCreated?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
  isCloning = false,
  onBulkPostCreated,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { selectedListing } = useListingContext();
  const { selectedMedia, clearSelection } = useMediaContext();
  const { createLoading, createError } = useAppSelector((state) => state.posts);
  const { t } = useI18nNamespace("Post/createPostModal");

  // Check if we're in multi-dashboard context
  const isMultiDashboard = location.pathname.includes("/main-dashboard");

  const getInitialFormData = () => {
    if (initialData) {
      return initialData;
    }
    // Check if there's a selected media from gallery
    if (selectedMedia) {
      return {
        listings: [] as string[],
        title: "",
        postType: "",
        description: "",
        image: selectedMedia.url,
        imageSource: selectedMedia.source,
        ctaButton: "",
        ctaUrl: "",
        publishOption: "now",
        scheduleDate: "",
        platforms: [] as string[],
        startDate: "",
        endDate: "",
        couponCode: "",
        redeemOnlineUrl: "",
        termsConditions: "",
        postTags: "",
        siloPost: false,
        autoScheduleFrequency: "",
        autoScheduleTime: "",
        autoScheduleDay: "",
        autoScheduleDate: "",
        autoScheduleRecurrenceCount: 0,
      };
    }
    return {
      listings: [] as string[],
      title: "",
      postType: "",
      description: "",
      image: null as File | string | null,
      imageSource: null as "local" | "ai" | "gallery" | null,
      ctaButton: "",
      ctaUrl: "",
      publishOption: "now",
      scheduleDate: "",
      platforms: [] as string[],
      startDate: "",
      endDate: "",
      couponCode: "",
      redeemOnlineUrl: "",
      termsConditions: "",
      postTags: "",
      siloPost: false,
      autoScheduleFrequency: "",
      autoScheduleTime: "",
      autoScheduleDay: "",
      autoScheduleDate: "",
      autoScheduleRecurrenceCount: 0,
    };
  };

  const [formData, setFormData] = useState(getInitialFormData());

  // Reset form data when modal opens/closes or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
    }
  }, [isOpen, initialData, selectedMedia]);

  const [showCTAButton, setShowCTAButton] = useState(false);
  const [isAIDescriptionOpen, setIsAIDescriptionOpen] = useState(false);
  const [isAIImageOpen, setIsAIImageOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [listingsSearch, setListingsSearch] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleListingToggle = (listing: string) => {
    setFormData((prev) => ({
      ...prev,
      listings: prev.listings.includes(listing)
        ? prev.listings.filter((l) => l !== listing)
        : [...prev.listings, listing],
    }));
  };

  // Updated image change handler to track source
  const handleImageChange = (
    image: File | string | null,
    source: "local" | "ai" | "gallery" | null = null
  ) => {
    setFormData((prev) => ({
      ...prev,
      image,
      imageSource: source,
    }));
  };

  // Updated AI image selection handler
  const handleAIImageSelect = (imageUrl: string) => {
    handleImageChange(imageUrl, "ai");
    setIsAIImageOpen(false);
  };

  // Validation function
  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    // Title validation for event and offer post types
    if (
      (formData.postType === "event" || formData.postType === "offer") &&
      !formData.title.trim()
    ) {
      errors.title = t("validation.titleRequired");
    }

    // CTA URL validation when CTA button is enabled and not CALL type
    if (showCTAButton && formData.ctaButton !== "CALL") {
      // check empty
      if (!formData.ctaUrl.trim()) {
        errors.ctaUrl = t("validation.urlRequired");
      }
      // check format
      else {
        try {
          new URL(formData.ctaUrl.trim());
        } catch {
          errors.ctaUrl = t("validation.invalidCtaUrl");
        }
      }
    }

    // Listings validation for multi-dashboard context (bulk posting)
    if (isMultiDashboard && formData.listings.length === 0) {
      errors.listings = t("validation.listingsRequired");
    }

    // Schedule date validation
    if (formData.publishOption === "schedule" && !formData.scheduleDate) {
      errors.scheduleDate = t("validation.scheduleDateRequired");
    }

    // Auto scheduling validation
    if (formData.publishOption === "auto") {
      if (!formData.autoScheduleFrequency) {
        errors.autoScheduleFrequency = t("validation.frequencyRequired");
      }

      if (formData.autoScheduleFrequency && !formData.autoScheduleTime) {
        errors.autoScheduleTime = t("validation.timeRequired");
      }

      if (formData.autoScheduleFrequency && (!formData.autoScheduleRecurrenceCount || formData.autoScheduleRecurrenceCount < 1)) {
        errors.autoScheduleRecurrenceCount = t("validation.recurrenceCountRequired");
      }

      if (formData.autoScheduleFrequency === "weekly" && !formData.autoScheduleDay) {
        errors.autoScheduleDay = t("validation.dayRequired");
      }

      if (formData.autoScheduleFrequency === "monthly" && !formData.autoScheduleDate) {
        errors.autoScheduleDate = t("validation.dateRequired");
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      // Check for specific validation errors and show appropriate messages
      if (validationErrors.listings) {
        toast({
          title: t("toast.listingRequired.title"),
          description: t("toast.listingRequired.description"),
          variant: "destructive",
        });
      } else if (validationErrors.title) {
        toast({
          title: t("toast.titleRequired.title"),
          description: validationErrors.title,
          variant: "destructive",
        });
      } else if (validationErrors.ctaUrl) {
        toast({
          title: t("toast.urlRequired.title"),
          description: validationErrors.ctaUrl,
          variant: "destructive",
        });
      } else if (validationErrors.autoScheduleFrequency || validationErrors.autoScheduleTime || validationErrors.autoScheduleRecurrenceCount || validationErrors.autoScheduleDay || validationErrors.autoScheduleDate) {
        toast({
          title: t("toast.autoScheduleError.title"),
          description: t("toast.autoScheduleError.description"),
          variant: "destructive",
        });
      } else if (validationErrors.scheduleDate) {
        toast({
          title: t("toast.scheduleDateError.title"),
          description: validationErrors.scheduleDate,
          variant: "destructive",
        });
      } else {
        toast({
          title: t("toast.validationError.title"),
          description: t("toast.validationError.description"),
          variant: "destructive",
        });
      }
      return;
    }

    // Determine if this is bulk posting or single posting
    const isBulkPosting = isMultiDashboard && formData.listings.length > 0;

    // For single posting, get listingId from context or URL
    const singleListingId =
      selectedListing?.id || parseInt(window.location.pathname.split("/")[2]);

    if (!isBulkPosting && !singleListingId) {
      toast({
        title: t("toast.error.title"),
        description: t("toast.error.noListing"),
        variant: "destructive",
      });
      return;
    }

    try {
      // Clear any previous errors
      dispatch(clearCreateError());

      let response;

      if (isBulkPosting) {
        // Create bulk post data with comma-separated listingId
        const bulkPostData = {
          listingId: formData.listings.join(","), // Convert array to comma-separated string
          title: formData.title,
          postType: formData.postType,
          description: formData.description,
          ctaButton: showCTAButton ? formData.ctaButton : undefined,
          ctaUrl: showCTAButton ? formData.ctaUrl : undefined,
          publishOption: formData.publishOption,
          scheduleDate:
            formData.publishOption === "schedule" && formData.scheduleDate
              ? formData.scheduleDate
              : undefined,
          platforms: formData.platforms,
          startDate:
            (formData.postType === "event" || formData.postType === "offer") &&
            formData.startDate
              ? formData.startDate
              : undefined,
          endDate:
            (formData.postType === "event" || formData.postType === "offer") &&
            formData.endDate
              ? formData.endDate
              : undefined,
          couponCode:
            formData.postType === "offer" ? formData.couponCode : undefined,
          redeemOnlineUrl:
            formData.postType === "offer"
              ? formData.redeemOnlineUrl
              : undefined,
          termsConditions:
            formData.postType === "offer"
              ? formData.termsConditions
              : undefined,
          postTags: formData.postTags,
          siloPost: formData.siloPost,
          // Auto-scheduling fields
          autoScheduleFrequency: formData.publishOption === "auto" ? formData.autoScheduleFrequency : undefined,
          autoScheduleTime: formData.publishOption === "auto" ? formData.autoScheduleTime : undefined,
          autoScheduleDay: formData.publishOption === "auto" && formData.autoScheduleFrequency === "weekly" ? formData.autoScheduleDay : undefined,
          autoScheduleDate: formData.publishOption === "auto" && formData.autoScheduleFrequency === "monthly" ? formData.autoScheduleDate : undefined,
          autoScheduleRecurrenceCount: formData.publishOption === "auto" ? formData.autoScheduleRecurrenceCount : undefined,
          // Handle image based on source
          selectedImage: formData.imageSource || null,
          userfile:
            formData.imageSource === "local" && formData.image instanceof File
              ? formData.image
              : undefined,
          aiImageUrl:
            formData.imageSource === "ai" && typeof formData.image === "string"
              ? formData.image
              : undefined,
          galleryImageUrl:
            formData.imageSource === "gallery" &&
            typeof formData.image === "string"
              ? formData.image
              : undefined,
        };

        response = await dispatch(createBulkPost(bulkPostData)).unwrap();

        // Call the bulk post created callback if provided
        if (onBulkPostCreated) {
          onBulkPostCreated();
        }
      } else {
        // Create single post data
        const createPostData = {
          listingId: parseInt(singleListingId!.toString()),
          title: formData.title,
          postType: formData.postType,
          description: formData.description,
          ctaButton: showCTAButton ? formData.ctaButton : undefined,
          ctaUrl: showCTAButton ? formData.ctaUrl : undefined,
          publishOption: formData.publishOption,
          scheduleDate:
            formData.publishOption === "schedule" && formData.scheduleDate
              ? formData.scheduleDate
              : undefined,
          platforms: formData.platforms,
          startDate:
            (formData.postType === "event" || formData.postType === "offer") &&
            formData.startDate
              ? formData.startDate
              : undefined,
          endDate:
            (formData.postType === "event" || formData.postType === "offer") &&
            formData.endDate
              ? formData.endDate
              : undefined,
          couponCode:
            formData.postType === "offer" ? formData.couponCode : undefined,
          redeemOnlineUrl:
            formData.postType === "offer"
              ? formData.redeemOnlineUrl
              : undefined,
          termsConditions:
            formData.postType === "offer"
              ? formData.termsConditions
              : undefined,
          postTags: formData.postTags,
          siloPost: formData.siloPost,
          // Auto-scheduling fields
          autoScheduleFrequency: formData.publishOption === "auto" ? formData.autoScheduleFrequency : undefined,
          autoScheduleTime: formData.publishOption === "auto" ? formData.autoScheduleTime : undefined,
          autoScheduleDay: formData.publishOption === "auto" && formData.autoScheduleFrequency === "weekly" ? formData.autoScheduleDay : undefined,
          autoScheduleDate: formData.publishOption === "auto" && formData.autoScheduleFrequency === "monthly" ? formData.autoScheduleDate : undefined,
          autoScheduleRecurrenceCount: formData.publishOption === "auto" ? formData.autoScheduleRecurrenceCount : undefined,
          // Handle image based on source
          selectedImage: formData.imageSource || null,
          userfile:
            formData.imageSource === "local" && formData.image instanceof File
              ? formData.image
              : undefined,
          aiImageUrl:
            formData.imageSource === "ai" && typeof formData.image === "string"
              ? formData.image
              : undefined,
          galleryImageUrl:
            formData.imageSource === "gallery" &&
            typeof formData.image === "string"
              ? formData.image
              : undefined,
        };

        response = await dispatch(createPost(createPostData)).unwrap();
      }

      // Show success message
      const successTitle = isBulkPosting
        ? isCloning
          ? t("toast.success.bulk.cloned.title")
          : t("toast.success.bulk.created.title")
        : isCloning
        ? t("toast.success.single.cloned.title")
        : t("toast.success.single.created.title");

      const successDescription = isBulkPosting
        ? isCloning
          ? t("toast.success.bulk.cloned.description", {
              count: formData.listings.length,
            })
          : t("toast.success.bulk.created.description", {
              count: formData.listings.length,
            })
        : isCloning
        ? t("toast.success.single.cloned.description", {
            id: response.data.postId,
          })
        : t("toast.success.single.created.description", {
            id: response.data.postId,
          });
      //   } listings.` //     formData.listings.length //  `Bulk post ${isCloning ? "cloned" : "created"} for ${
      // `Post ${isCloning ? "cloned" : "created"} with ID: ${
      //   response.data.postId
      // }`;

      toast({
        title: successTitle,
        description: successDescription,
      });

      // Refresh posts list only for single posting (bulk posting doesn't need refresh since it's cross-listing)
      if (!isBulkPosting && singleListingId) {
        dispatch(
          fetchPosts({
            listingId: parseInt(singleListingId.toString()),
            filters: { status: "all", search: "" },
            pagination: { page: 1, limit: 12 },
          })
        );
      }

      // Reset form and close modal
      setFormData({
        listings: [],
        title: "",
        postType: "",
        description: "",
        image: null,
        imageSource: null,
        ctaButton: "",
        ctaUrl: "",
        publishOption: "now",
        scheduleDate: "",
        platforms: [],
        startDate: "",
        endDate: "",
        couponCode: "",
        redeemOnlineUrl: "",
        termsConditions: "",
        postTags: "",
        siloPost: false,
        autoScheduleFrequency: "",
        autoScheduleTime: "",
        autoScheduleDay: "",
        autoScheduleDate: "",
        autoScheduleRecurrenceCount: 0,
      });
      setValidationErrors({});
      setShowCTAButton(false);
      setShowAdvancedOptions(false);
      // Clear media selection after successful post creation
      clearSelection();
      onClose();
    } catch (error) {
      // console.error("Error creating post:", error);
      toast({
        title: isBulkPosting
          ? isCloning
            ? t("toast.failure.bulk.cloned")
            : t("toast.failure.bulk.created")
          : isCloning
          ? t("toast.failure.single.cloned")
          : t("toast.failure.single.created"),
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("toast.error.desc"),
        variant: "destructive",
      });
    }
  };

  // Check if Create Post button should be enabled
  const isCreatePostEnabled =
    formData.description.trim().length > 0 && !createLoading;

  // Show error toast if there's a create error
  React.useEffect(() => {
    if (createError) {
      toast({
        title: t("toast.error.title"),
        description: createError,
        variant: "destructive",
      });
    }
  }, [createError]);

  // Clear validation errors when form data changes
  React.useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      validateForm();
    }
  }, [
    formData.title,
    formData.postType,
    formData.ctaUrl,
    formData.listings,
    showCTAButton,
  ]);

  // Handle modal close with full reset
  const handleClose = () => {
    setFormData({
      listings: [],
      title: "",
      postType: "",
      description: "",
      image: null,
      imageSource: null,
      ctaButton: "",
      ctaUrl: "",
      publishOption: "now",
      scheduleDate: "",
      platforms: [],
      startDate: "",
      endDate: "",
      couponCode: "",
      redeemOnlineUrl: "",
      termsConditions: "",
      postTags: "",
      siloPost: false,
      autoScheduleFrequency: "",
      autoScheduleTime: "",
      autoScheduleDay: "",
      autoScheduleDate: "",
      autoScheduleRecurrenceCount: 0,
    });
    setShowCTAButton(false);
    setShowAdvancedOptions(false);
    setIsPreviewOpen(false);
    setValidationErrors({});
    clearSelection();
    onClose();
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="p-4 sm:p-6 pb-4 border-b shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl sm:text-2xl font-semibold">
                {isCloning ? t("title.clone") : t("title.create")}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex flex-1 min-h-0">
            {/* Main Panel - Form (full width on mobile/tablet, 8 columns on desktop) */}
            <div className="flex-1 lg:flex-[8] p-4 sm:p-6 overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Multi-Listing Selector (only in multi-dashboard) */}
                {isMultiDashboard && (
                  <MultiListingSelector
                    selectedListings={formData.listings}
                    onListingsChange={(listings) =>
                      setFormData((prev) => ({ ...prev, listings }))
                    }
                    error={validationErrors.listings}
                  />
                )}

                {/* Post Description Field */}
                <PostDescriptionSection
                  description={formData.description}
                  onDescriptionChange={(value) =>
                    setFormData((prev) => ({ ...prev, description: value }))
                  }
                  onOpenAIDescription={() => setIsAIDescriptionOpen(true)}
                />

                {/* Post Image Upload */}
                <PostImageSection
                  image={formData.image}
                  onImageChange={handleImageChange}
                  onOpenAIImage={() => setIsAIImageOpen(true)}
                />

                {/* CTA Button Section */}
                <CTAButtonSection
                  showCTAButton={showCTAButton}
                  onShowCTAButtonChange={setShowCTAButton}
                  ctaButton={formData.ctaButton}
                  onCTAButtonChange={(value) =>
                    setFormData((prev) => ({ ...prev, ctaButton: value }))
                  }
                  ctaUrl={formData.ctaUrl}
                  onCTAUrlChange={(value) =>
                    setFormData((prev) => ({ ...prev, ctaUrl: value }))
                  }
                  urlError={validationErrors.ctaUrl}
                />

                {/* Advanced Post Options */}
                <AdvancedOptionsSection
                  showAdvancedOptions={showAdvancedOptions}
                  onShowAdvancedOptionsChange={setShowAdvancedOptions}
                  formData={formData}
                  onFormDataChange={setFormData}
                  listingsSearch={listingsSearch}
                  onListingsSearchChange={setListingsSearch}
                  onListingToggle={handleListingToggle}
                  validationErrors={validationErrors}
                />
              </form>
            </div>

            {/* Right Panel - Preview (hidden on mobile/tablet, visible on large screens) */}
            <div className="hidden lg:flex lg:flex-[4] border-l bg-gray-50/50 p-6">
              <ScrollArea className="w-full h-full">
                <div className="space-y-4 w-full">
                  <h3 className="font-semibold text-lg">
                    {t("preview.title")}{" "}
                  </h3>
                  <PostPreview data={formData} />
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Sticky Footer */}
          <div className="flex justify-center sm:justify-between items-center gap-3 p-4 sm:p-6 border-t bg-white shrink-0">
            {/* Cancel button - only visible on desktop */}
            <Button
              variant="outline"
              onClick={() => {
                clearSelection();
                onClose();
              }}
              className="hidden sm:block"
            >
              {t("buttons.cancel")}
            </Button>

            {/* Mobile: Preview and Create buttons in single row */}
            <div className="flex gap-3 sm:hidden w-full">
              <Button
                variant="outline"
                onClick={() => setIsPreviewOpen(true)}
                className="flex-shrink-0"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={!isCreatePostEnabled}
                className="bg-primary hover:bg-primary/90 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading
                  ? isCloning
                    ? t("buttons.cloning")
                    : t("buttons.creating")
                  : isCloning
                  ? t("buttons.clone")
                  : t("buttons.create")}
              </Button>
            </div>

            {/* Desktop: Create button only */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isCreatePostEnabled}
              className="hidden sm:block bg-primary hover:bg-primary/90 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createLoading
                ? isCloning
                  ? t("buttons.cloning")
                  : t("buttons.creating")
                : isCloning
                ? t("buttons.clone")
                : t("buttons.create")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Modals */}
      <AIDescriptionModal
        isOpen={isAIDescriptionOpen}
        onClose={() => setIsAIDescriptionOpen(false)}
        onSelect={(description) => {
          setFormData((prev) => ({ ...prev, description }));
          setIsAIDescriptionOpen(false);
        }}
      />

      <AIImageModal
        isOpen={isAIImageOpen}
        onClose={() => setIsAIImageOpen(false)}
        onSelect={handleAIImageSelect}
      />

      {/* Preview Modal - only for mobile/tablet */}
      <PostPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        data={formData}
      />
    </>
  );
};
