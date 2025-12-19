import React, { useState, useEffect } from "react";
import { Eye, X, Loader2 } from "lucide-react";
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
  fetchPostDetails,
  editPost,
  clearPostDetails,
  clearEditError,
  fetchBulkEditDetails,
  updateBulkPost,
  clearBulkEditDetails,
  clearUpdateBulkError,
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
  isEditing?: boolean;
  editPostId?: string;
  onBulkPostCreated?: () => void;
  isBulkEditing?: boolean;
  bulkEditId?: string | null;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  initialData = null,
  isCloning = false,
  isEditing = false,
  editPostId,
  onBulkPostCreated,
  isBulkEditing = false,
  bulkEditId = null,
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { selectedListing } = useListingContext();
  const { selectedMedia, clearSelection } = useMediaContext();
  const { 
    createLoading, 
    createError, 
    postDetails, 
    postDetailsLoading, 
    editLoading, 
    editError,
    bulkEditDetails,
    bulkEditDetailsLoading,
    bulkEditDetailsError,
    updateBulkLoading,
    updateBulkError,
  } = useAppSelector((state) => state.posts);
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
  useEffect(() => {
    if (isOpen && !isEditing && !isBulkEditing) {
      setFormData(getInitialFormData());
    }
  }, [isOpen, initialData, selectedMedia]);

  // Helper to map autoRescheduleType to frequency
  const mapRescheduleTypeToFrequency = (type: number): string => {
    switch (type) {
      case 1: return "daily";
      case 2: return "weekly";
      case 3: return "monthly";
      default: return "";
    }
  };

  // Helper to convert 12hr time to 24hr format
  const convertTo24HourFormat = (time12: string): string => {
    if (!time12) return "";
    const match = time12.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return "";
    let [, hours, minutes, period] = match;
    let hour = parseInt(hours);
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;
    return `${hour.toString().padStart(2, "0")}:${minutes}`;
  };

  // Helper to convert day name to index
  const dayNameToIndex = (name: string): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const index = days.indexOf(name?.toLowerCase());
    return index >= 0 ? index.toString() : "";
  };

  // Helper to convert frequency to autoRescheduleType
  const mapFrequencyToRescheduleType = (frequency: string): number | undefined => {
    switch (frequency) {
      case "daily": return 1;
      case "weekly": return 2;
      case "monthly": return 3;
      default: return undefined;
    }
  };

  // Helper to convert 24hr time to 12hr format
  const convertTo12HourFormat = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  // Helper to convert day index to name
  const indexToDayName = (index: string): string => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const idx = parseInt(index);
    return idx >= 0 && idx < 7 ? days[idx] : "";
  };

  // Fetch post details when editing
  useEffect(() => {
    if (isOpen && isEditing && editPostId) {
      dispatch(fetchPostDetails(parseInt(editPostId)));
    }
    // Fetch bulk edit details when bulk editing
    if (isOpen && isBulkEditing && bulkEditId) {
      dispatch(fetchBulkEditDetails(parseInt(bulkEditId)));
    }
    // Cleanup when modal closes
    if (!isOpen) {
      dispatch(clearPostDetails());
      dispatch(clearBulkEditDetails());
    }
  }, [isOpen, isEditing, editPostId, isBulkEditing, bulkEditId, dispatch]);

  // Map post details to form when loaded
  useEffect(() => {
    if (isEditing && postDetails) {
      const publishOption = postDetails.publishOption === "recurrent" ? "auto" : postDetails.publishOption;
      
      setFormData({
        listings: [],
        title: postDetails.title || "",
        postType: postDetails.postType || "regular",
        description: postDetails.description || "",
        image: postDetails.imageUrl || null,
        imageSource: postDetails.imageUrl ? "gallery" : null, // Set as "gallery" for existing images
        ctaButton: postDetails.ctaButton || "",
        ctaUrl: postDetails.ctaUrl || "",
        publishOption: publishOption || "now",
        scheduleDate: postDetails.scheduleDate || "",
        platforms: [],
        startDate: postDetails.startDate || "",
        endDate: postDetails.endDate || "",
        couponCode: postDetails.couponCode || "",
        redeemOnlineUrl: postDetails.redeemOnlineUrl || "",
        termsConditions: postDetails.termsConditions || "",
        postTags: postDetails.postTags || "",
        siloPost: false,
        autoScheduleFrequency: mapRescheduleTypeToFrequency(postDetails.autoRescheduleType),
        autoScheduleTime: convertTo24HourFormat(postDetails.autoPostTime || ""),
        autoScheduleDay: dayNameToIndex(postDetails.autoWeekDay || ""),
        autoScheduleDate: postDetails.autoMonthDate?.toString() || "",
        autoScheduleRecurrenceCount: postDetails.autoPostCount || 0,
      });

      // Set CTA button visibility if there's a CTA button
      if (postDetails.ctaButton) {
        setShowCTAButton(true);
      }

      // Auto-enable advanced options if relevant data exists
      const shouldShowAdvanced = 
        (postDetails.postType && postDetails.postType !== "regular") ||
        publishOption === "schedule" ||
        publishOption === "auto" ||
        postDetails.postTags?.trim();
      
      if (shouldShowAdvanced) {
        setShowAdvancedOptions(true);
      }
    }
  }, [isEditing, postDetails]);

  // Map bulk edit details to form when loaded
  useEffect(() => {
    if (isBulkEditing && bulkEditDetails) {
      // Map autoRescheduleType based on selretype
      const publishOption = bulkEditDetails.publishOption || "now";
      
      setFormData({
        listings: bulkEditDetails.listingId || [],
        title: bulkEditDetails.title || "",
        postType: bulkEditDetails.postType || "regular",
        description: bulkEditDetails.description || "",
        image: bulkEditDetails.imageUrl || null,
        imageSource: bulkEditDetails.imageUrl ? "gallery" : null,
        ctaButton: bulkEditDetails.ctaButton || "",
        ctaUrl: bulkEditDetails.ctaUrl || "",
        publishOption: publishOption,
        scheduleDate: bulkEditDetails.scheduleDate || "",
        platforms: [],
        startDate: bulkEditDetails.startDate || "",
        endDate: bulkEditDetails.endDate || "",
        couponCode: bulkEditDetails.couponCode || "",
        redeemOnlineUrl: bulkEditDetails.redeemOnlineUrl || "",
        termsConditions: bulkEditDetails.termsConditions || "",
        postTags: bulkEditDetails.postTags || "",
        siloPost: false,
        autoScheduleFrequency: "",
        autoScheduleTime: "",
        autoScheduleDay: "",
        autoScheduleDate: "",
        autoScheduleRecurrenceCount: 0,
      });

      // Set CTA button visibility if there's a CTA button
      if (bulkEditDetails.ctaButton) {
        setShowCTAButton(true);
      }

      // Auto-enable advanced options if relevant data exists
      const shouldShowAdvanced = 
        (bulkEditDetails.postType && bulkEditDetails.postType !== "regular") ||
        publishOption === "schedule" ||
        bulkEditDetails.postTags?.trim();
      
      if (shouldShowAdvanced) {
        setShowAdvancedOptions(true);
      }
    }
  }, [isBulkEditing, bulkEditDetails]);

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

  // Error field mapping for focus functionality
  const errorFieldMap: Record<string, string> = {
    listings: "field-listings",
    title: "field-title",
    ctaUrl: "field-ctaUrl",
    scheduleDate: "field-scheduleDate",
    autoScheduleFrequency: "field-autoScheduleFrequency",
    autoScheduleTime: "field-autoScheduleTime",
    autoScheduleDay: "field-autoScheduleDay",
    autoScheduleDate: "field-autoScheduleDate",
    autoScheduleRecurrenceCount: "field-autoScheduleRecurrenceCount",
  };

  // Focus on first error field helper
  const focusFirstErrorField = (errors: Record<string, string>) => {
    const errorKeys = Object.keys(errorFieldMap);
    for (const key of errorKeys) {
      if (errors[key]) {
        const element = document.getElementById(errorFieldMap[key]);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => element.focus(), 300);
          break;
        }
      }
    }
  };

  // Validation function - returns errors object
  const validateForm = (): { [key: string]: string } => {
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
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form - inline errors will be shown on fields
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      focusFirstErrorField(errors);
      return;
    }

    // For editing, use the editPostId's listing
    if (isEditing && editPostId && postDetails) {
      try {
        dispatch(clearEditError());

        const editPostData = {
          id: parseInt(editPostId),
          listingId: parseInt(postDetails.listingId),
          title: formData.title,
          postType: formData.postType,
          description: formData.description,
          ctaButton: showCTAButton ? formData.ctaButton : undefined,
          ctaUrl: showCTAButton ? formData.ctaUrl : undefined,
          // Transform "auto" to "recurrent" for API
          publishOption: formData.publishOption === "auto" ? "recurrent" : formData.publishOption,
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
          // Auto-scheduling fields - transform to API expected format
          autoRescheduleType: formData.publishOption === "auto" 
            ? mapFrequencyToRescheduleType(formData.autoScheduleFrequency) 
            : undefined,
          autoPostTime: formData.publishOption === "auto" 
            ? convertTo12HourFormat(formData.autoScheduleTime) 
            : undefined,
          autoWeekDay: formData.publishOption === "auto" && formData.autoScheduleFrequency === "weekly" 
            ? indexToDayName(formData.autoScheduleDay) 
            : undefined,
          autoMonthDate: formData.publishOption === "auto" && formData.autoScheduleFrequency === "monthly" 
            ? parseInt(formData.autoScheduleDate) 
            : undefined,
          autoPostCount: formData.publishOption === "auto" 
            ? formData.autoScheduleRecurrenceCount 
            : undefined,
          // Handle image based on source
          selectedImage: formData.imageSource || undefined,
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

        await dispatch(editPost(editPostData)).unwrap();

        toast({
          title: t("toast.success.single.edited.title"),
          description: t("toast.success.single.edited.description"),
        });

        // Refresh posts list
        const listingId = parseInt(postDetails.listingId);
        if (listingId) {
          dispatch(
            fetchPosts({
              listingId,
              filters: { status: "all", search: "" },
              pagination: { page: 1, limit: 12 },
            })
          );
        }

        handleClose();
        return;
      } catch (error) {
        toast({
          title: t("toast.failure.single.edited"),
          description:
            error instanceof Error
              ? (error as any)?.response?.data?.message || error.message
              : t("toast.error.desc"),
          variant: "destructive",
        });
        return;
      }
    }

    // For bulk editing, use the updateBulkPost thunk
    if (isBulkEditing && bulkEditId && bulkEditDetails) {
      try {
        dispatch(clearUpdateBulkError());

        const updateBulkData = {
          bulkId: parseInt(bulkEditId),
          listingId: formData.listings.join(","),
          postType: formData.postType,
          description: formData.description,
          ctaButton: showCTAButton ? formData.ctaButton : undefined,
          ctaUrl: showCTAButton ? formData.ctaUrl : undefined,
          publishOption: formData.publishOption,
          scheduleDate:
            formData.publishOption === "schedule" && formData.scheduleDate
              ? formData.scheduleDate
              : undefined,
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
          title: formData.title,
          tags: formData.postTags,
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
          // Handle image based on source
          selectedImage: formData.imageSource || undefined,
          userfile:
            formData.imageSource === "local" && formData.image instanceof File
              ? formData.image
              : undefined,
          aiImageUrl:
            formData.imageSource === "ai" && typeof formData.image === "string"
              ? formData.image
              : undefined,
        };

        await dispatch(updateBulkPost(updateBulkData)).unwrap();

        toast({
          title: t("toast.success.bulk.edited.title"),
          description: t("toast.success.bulk.edited.description", {
            count: formData.listings.length,
          }),
        });

        // Call the bulk post created callback if provided to refresh the list
        if (onBulkPostCreated) {
          onBulkPostCreated();
        }

        handleClose();
        return;
      } catch (error) {
        toast({
          title: t("toast.failure.bulk.edited"),
          description:
            error instanceof Error
              ? (error as any)?.response?.data?.message || error.message
              : t("toast.error.desc"),
          variant: "destructive",
        });
        return;
      }
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
  const isSubmitEnabled =
    formData.description.trim().length > 0 && !createLoading && !editLoading && !postDetailsLoading && !updateBulkLoading && !bulkEditDetailsLoading;

  // Show error toast if there's a create error
  useEffect(() => {
    if (createError) {
      toast({
        title: t("toast.error.title"),
        description: createError,
        variant: "destructive",
      });
    }
  }, [createError]);

  // Show error toast if there's an edit error
  useEffect(() => {
    if (editError) {
      toast({
        title: t("toast.error.title"),
        description: editError,
        variant: "destructive",
      });
    }
  }, [editError]);

  // Show error toast if there's a bulk edit error
  useEffect(() => {
    if (updateBulkError) {
      toast({
        title: t("toast.error.title"),
        description: updateBulkError,
        variant: "destructive",
      });
    }
  }, [updateBulkError]);

  // Clear validation errors when form data changes
  useEffect(() => {
    if (Object.keys(validationErrors).length > 0) {
      const errors = validateForm();
      // Don't auto-focus on field changes, only on submit
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
                {isBulkEditing ? t("title.bulkEdit") : isEditing ? t("title.edit") : isCloning ? t("title.clone") : t("title.create")}
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
              {/* Loading state when fetching post details for editing */}
              {(isEditing && postDetailsLoading) || (isBulkEditing && bulkEditDetailsLoading) ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {isBulkEditing ? t("loading.fetchingBulkDetails") : t("loading.fetchingDetails")}
                    </p>
                  </div>
                </div>
              ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Multi-Listing Selector (only in multi-dashboard and not editing single post) */}
                {isMultiDashboard && !isEditing && (
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
                  isBulkPost={isMultiDashboard}
                />
              </form>
              )}
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
                disabled={!isSubmitEnabled}
                className="bg-primary hover:bg-primary/90 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateBulkLoading
                  ? t("buttons.bulkEditing")
                  : editLoading
                  ? t("buttons.editing")
                  : createLoading
                  ? isCloning
                    ? t("buttons.cloning")
                    : t("buttons.creating")
                  : isBulkEditing
                  ? t("buttons.bulkEdit")
                  : isEditing
                  ? t("buttons.edit")
                  : isCloning
                  ? t("buttons.clone")
                  : t("buttons.create")}
              </Button>
            </div>

            {/* Desktop: Create button only */}
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isSubmitEnabled}
              className="hidden sm:block bg-primary hover:bg-primary/90 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateBulkLoading
                ? t("buttons.bulkEditing")
                : editLoading
                ? t("buttons.editing")
                : createLoading
                ? isCloning
                  ? t("buttons.cloning")
                  : t("buttons.creating")
                : isBulkEditing
                ? t("buttons.bulkEdit")
                : isEditing
                ? t("buttons.edit")
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
