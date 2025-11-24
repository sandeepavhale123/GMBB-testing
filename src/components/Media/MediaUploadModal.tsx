import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogPortal,
  AlertDialogOverlay,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import {
  X,
  Settings2,
  Camera,
  MapPin,
  Clock,
  Save,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { MediaDropzone } from "./MediaDropzone";
import { MediaPreview } from "./MediaPreview";
import { MediaForm } from "./MediaForm";
import { AIMediaGenerationModal } from "./AIMediaGenerationModal";
import { useListingContext } from "../../context/ListingContext";
import { useMediaContext } from "../../context/MediaContext";
import {
  uploadMedia,
  createBulkMedia,
  getExifTemplateList,
  getExifTemplateDetails,
  updateImgexifDetails,
  deleteExifTemplate,
} from "../../api/mediaApi";
import { useToast } from "../../hooks/use-toast";
import { MultiListingSelector } from "../Posts/CreatePostModal/MultiListingSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Trash2 } from "lucide-react";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { count } from "console";

interface MediaFile {
  id: string;
  file?: File;
  url: string;
  type: "image" | "video";
  title?: string;
  category?: string;
  selectedImage: "local" | "ai" | "gallery";
  aiImageUrl?: string;
  galleryImageUrl?: string;
}
interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: "image" | "video";
  url: string;
  uploadDate: string;
}
interface MediaUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (mediaItems: MediaItem[]) => void;
  isBulkUpload?: boolean;
  enableMultiSelect?: boolean;
  maxSelectionLimit?: number;
}
export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isBulkUpload = false,
  enableMultiSelect = true,
  maxSelectionLimit = 5,
}) => {
  const { t } = useI18nNamespace("Media/mediaUploadModal");
  const [file, setFile] = useState<MediaFile | null>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isExifSheetOpen, setIsExifSheetOpen] = useState(false);
  const [selectedListings, setSelectedListings] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    publishOption: "now",
    scheduleDate: "",
  });
  const [exifData, setExifData] = useState({
    name: "",
    subject: "",
    copyright: "",
    title: "",
    keyword: "",
    author: "",
    comment: "",
    description: "",
    gpsLatitude: "",
    gpsLongitude: "",
    maker: "",
    software: "",
    model: "",
    template: "default",
  });
  const { selectedListing } = useListingContext();
  const { selectedMedia, selectedMediaItems, clearSelection } =
    useMediaContext();
  const { toast } = useToast();

  // Helper function to detect media type from URL
  const getMediaTypeFromUrl = (url: string): "image" | "video" => {
    const extension = url.split(".").pop()?.toLowerCase() || "";
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
    return videoExtensions.includes(extension) ? "video" : "image";
  };

  // Helper function to check if image is JPG/JPEG
  const isJpegImage = (mediaFile: MediaFile | null): boolean => {
    if (!mediaFile) return false;

    // Check from file name if available
    if (mediaFile.file?.name) {
      const extension =
        mediaFile.file.name.split(".").pop()?.toLowerCase() || "";
      return extension === "jpg" || extension === "jpeg";
    }

    // Check from URL
    const extension =
      mediaFile.url.split(".").pop()?.toLowerCase().split("?")[0] || "";
    return extension === "jpg" || extension === "jpeg";
  };

  // Helper function to check if at least one image is JPG/JPEG for multi-image selection
  const hasJpegImages = (mediaFiles: MediaFile[]): boolean => {
    return mediaFiles
      .filter((f) => f.type === "image")
      .some((file) => isJpegImage(file));
  };

  // Effect to auto-populate with selected media from context
  React.useEffect(() => {
    if (selectedMedia && isOpen) {
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: selectedMedia.url,
        type: selectedMedia.type,
        title: selectedMedia.title,
        selectedImage: selectedMedia.source,
        aiImageUrl:
          selectedMedia.source === "ai" ? selectedMedia.url : undefined,
        galleryImageUrl:
          selectedMedia.source === "gallery" ? selectedMedia.url : undefined,
      };
      setFile(mediaFile);
      setFiles([]);
      setFormData((prev) => ({
        ...prev,
        title: selectedMedia.title,
      }));
    } else if (selectedMediaItems && selectedMediaItems.length > 0 && isOpen) {
      const mediaFiles = selectedMediaItems.map((item, index) => ({
        id:
          Date.now().toString() +
          index +
          Math.random().toString(36).substr(2, 9),
        url: item.url,
        type: item.type,
        title: item.title,
        selectedImage: item.source,
        aiImageUrl: item.source === "ai" ? item.url : undefined,
        galleryImageUrl: item.source === "gallery" ? item.url : undefined,
      }));
      setFiles(mediaFiles);
      setFile(null);
    }
  }, [selectedMedia, selectedMediaItems, isOpen]);
  const handleFilesAdded = (newFiles: File[]) => {
    // Only take the first file to enforce single upload
    const firstFile = newFiles[0];
    if (firstFile) {
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file: firstFile,
        url: URL.createObjectURL(firstFile),
        type: firstFile.type.startsWith("image/") ? "image" : "video",
        selectedImage: "local",
      };
      setFile(mediaFile);
      setFiles([]);
      setUploadComplete(false);
    }
  };
  const handleFileRemove = (fileId?: string) => {
    if (fileId && files.length > 0) {
      const updatedFiles = files.filter((f) => f.id !== fileId);
      setFiles(updatedFiles);
      // Close EXIF editor if no images remain
      if (updatedFiles.length === 0) {
        setIsExifSheetOpen(false);
      }
    } else {
      setFile(null);
      setFiles([]);
      // Close EXIF editor when single file is removed
      setIsExifSheetOpen(false);
      setUploadComplete(false);
    }
  };
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };
  const handleUpload = async () => {
    // Check if we have either a single file or multiple files
    const hasFiles = file || files.length > 0;
    if (!hasFiles) {
      toast({
        title: t("mediaUploadModal.uploadError"),
        description: t("mediaUploadModal.selectFileError"),
        variant: "destructive",
      });
      return;
    }
    if (isBulkUpload && selectedListings.length === 0) {
      toast({
        title: t("mediaUploadModal.uploadError"),
        description: t("mediaUploadModal.selectListingError"),
        variant: "destructive",
      });
      return;
    }
    if (!isBulkUpload && !selectedListing) {
      toast({
        title: t("mediaUploadModal.uploadError"),
        description: t("mediaUploadModal.noListingError"),
        variant: "destructive",
      });
      return;
    }
    setIsUploading(true);
    try {
      const uploadedItems: MediaItem[] = [];

      // Handle multiple files
      if (files.length > 0) {
        // Group files by source type
        const galleryFiles = files.filter((f) => f.selectedImage === "gallery");
        const aiFiles = files.filter((f) => f.selectedImage === "ai");
        const localFiles = files.filter((f) => f.selectedImage === "local");

        // Handle gallery files (combine into single upload with comma-separated URLs)
        if (galleryFiles.length > 0) {
          const galleryImageUrls = galleryFiles
            .map((f) => f.galleryImageUrl)
            .filter(Boolean)
            .join(",");
          const firstGalleryFile = galleryFiles[0];

          if (isBulkUpload) {
            const formattedListingId = selectedListings.join(",");
            const bulkUploadData = {
              title: formData.title || "Gallery Images",
              category: formData.category || "additional",
              publishOption: formData.publishOption,
              scheduleDate: formData.scheduleDate,
              listingId: formattedListingId,
              selectedImage: "gallery" as const,
              galleryImageUrl: galleryImageUrls,
              galleryMediaType: (firstGalleryFile.type === "video"
                ? "video"
                : "photo") as "photo" | "video",
            };
            await createBulkMedia(bulkUploadData);
          } else {
            const uploadData = {
              title: formData.title || "Gallery Images",
              category: formData.category || "additional",
              publishOption: formData.publishOption,
              scheduleDate: formData.scheduleDate,
              listingId: selectedListing.id,
              selectedImage: "gallery" as const,
              galleryImageUrl: galleryImageUrls,
              galleryMediaType: (firstGalleryFile.type === "video"
                ? "video"
                : "photo") as "photo" | "video",
            };
            await uploadMedia(uploadData);
          }

          // Add all gallery files to uploaded items
          galleryFiles.forEach((gFile) => {
            uploadedItems.push({
              id: gFile.id,
              name: formData.title || gFile.title || "Gallery Image",
              views: "0 views",
              type: gFile.type,
              url: gFile.url,
              uploadDate: new Date().toISOString().split("T")[0],
            });
          });
        }

        // Handle AI files individually
        for (const aiFile of aiFiles) {
          if (isBulkUpload) {
            const formattedListingId = selectedListings.join(",");
            const bulkUploadData = {
              title: formData.title || aiFile.title || "AI Image",
              category: formData.category || "additional",
              publishOption: formData.publishOption,
              scheduleDate: formData.scheduleDate,
              listingId: formattedListingId,
              selectedImage: "ai" as const,
              aiImageUrl: aiFile.aiImageUrl,
              galleryMediaType: "photo" as const,
            };
            await createBulkMedia(bulkUploadData);
          } else {
            const uploadData = {
              title: formData.title || aiFile.title || "AI Image",
              category: formData.category || "additional",
              publishOption: formData.publishOption,
              scheduleDate: formData.scheduleDate,
              listingId: selectedListing.id,
              selectedImage: "ai" as const,
              aiImageUrl: aiFile.aiImageUrl,
              galleryMediaType: "photo" as const,
            };
            await uploadMedia(uploadData);
          }

          uploadedItems.push({
            id: aiFile.id,
            name: formData.title || aiFile.title || "AI Image",
            views: "0 views",
            type: aiFile.type,
            url: aiFile.url,
            uploadDate: new Date().toISOString().split("T")[0],
          });
        }

        // Handle local files individually
        for (const localFile of localFiles) {
          if (isBulkUpload) {
            const formattedListingId = selectedListings.join(",");
            const bulkUploadData = {
              file: localFile.file,
              title: formData.title || localFile.title || "Local Media",
              category: formData.category || "additional",
              publishOption: formData.publishOption,
              scheduleDate: formData.scheduleDate,
              listingId: formattedListingId,
              selectedImage: "local" as const,
              galleryMediaType: (localFile.type === "video"
                ? "video"
                : "photo") as "photo" | "video",
            };
            await createBulkMedia(bulkUploadData);
          } else {
            const uploadData = {
              file: localFile.file,
              title: formData.title || localFile.title || "Local Media",
              category: formData.category || "additional",
              publishOption: formData.publishOption,
              scheduleDate: formData.scheduleDate,
              listingId: selectedListing.id,
              selectedImage: "local" as const,
              galleryMediaType: (localFile.type === "video"
                ? "video"
                : "photo") as "photo" | "video",
            };
            await uploadMedia(uploadData);
          }

          uploadedItems.push({
            id: localFile.id,
            name: formData.title || localFile.title || "Local Media",
            views: "0 views",
            type: localFile.type,
            url: localFile.url,
            uploadDate: new Date().toISOString().split("T")[0],
          });
        }

        toast({
          title: t("mediaUploadModal.success"),
          description: t("mediaUploadModal.successDesc", {
            count: files.length,
          }),
          // `${files.length} media item(s) uploaded successfully`,
          // variant: "default",
        });
      }
      // Handle single file
      else if (file) {
        if (isBulkUpload) {
          const formattedListingId = selectedListings.join(",");
          const bulkUploadData = {
            file: file.file,
            title:
              formData.title ||
              file.file?.name.replace(/\.[^/.]+$/, "") ||
              "Generated Image",
            category: formData.category || "additional",
            publishOption: formData.publishOption,
            scheduleDate: formData.scheduleDate,
            listingId: formattedListingId,
            selectedImage: file.selectedImage,
            aiImageUrl: file.aiImageUrl,
            galleryImageUrl: file.galleryImageUrl,
            galleryMediaType: (file.type === "video" ? "video" : "photo") as
              | "photo"
              | "video",
          };
          const response = await createBulkMedia(bulkUploadData);
          const mediaItem: MediaItem = {
            id: file.id,
            name:
              formData.title ||
              file.file?.name.replace(/\.[^/.]+$/, "") ||
              "Generated Image",
            views: "0 views",
            type: file.type,
            url: file.url,
            uploadDate: new Date().toISOString().split("T")[0],
          };
          uploadedItems.push(mediaItem);
          toast({
            title: t("mediaUploadModal.bulkSuccess"),
            description:
              selectedListings.length > 1
                ? t("mediaUploadModal.bulkSuccessMessages", {
                    count: selectedListings.length,
                  })
                : t("mediaUploadModal.bulkSuccessMessage", {
                    count: selectedListings.length,
                  }),
            // `Media has been posted to ${
            //   selectedListings.length
            // } listing${selectedListings.length > 1 ? "s" : ""}.`,
            // variant: "default",
          });
        } else {
          const uploadData = {
            file: file.file,
            title:
              formData.title ||
              file.file?.name.replace(/\.[^/.]+$/, "") ||
              "Generated Image",
            category: formData.category || "additional",
            publishOption: formData.publishOption,
            scheduleDate: formData.scheduleDate,
            listingId: selectedListing.id,
            selectedImage: file.selectedImage,
            aiImageUrl: file.aiImageUrl,
            galleryImageUrl: file.galleryImageUrl,
            galleryMediaType: (file.type === "video" ? "video" : "photo") as
              | "photo"
              | "video",
          };
          const response = await uploadMedia(uploadData);
          if (response.code === 200) {
            const mediaItem: MediaItem = {
              id: file.id,
              name: uploadData.title,
              views: "0 views",
              type: file.type,
              url: file.url,
              uploadDate: new Date().toISOString().split("T")[0],
            };
            uploadedItems.push(mediaItem);
            toast({
              title: t("mediaUploadModal.uploadSuccess"),
              description: response.message,
            });
          } else {
            throw new Error(
              response.message || t("mediaUploadModal.uploadFailed")
            );
          }
        }
      }
      onUpload(uploadedItems);
      setUploadComplete(true);
      clearSelection();
    } catch (error) {
      // console.error("Upload error:", error);
      toast({
        title: t("mediaUploadModal.uploadFailed"),
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : t("mediaUploadModal.uploadDesc"),
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleClose = () => {
    setFile(null);
    setFiles([]);
    setUploadComplete(false);
    setSelectedListings([]);
    setFormData({
      title: "",
      category: "",
      publishOption: "now",
      scheduleDate: "",
    });
    setExifData({
      name: "",
      subject: "",
      copyright: "",
      title: "",
      keyword: "",
      author: "",
      comment: "",
      description: "",
      gpsLatitude: "",
      gpsLongitude: "",
      maker: "",
      software: "",
      model: "",
      template: "default",
    });
    clearSelection();
    onClose();
  };
  const handleAIGenerated = (generatedMedia: {
    imageUrl: string;
    prompt: string;
    variants: number;
    style: string;
  }) => {
    // Convert AI generated image to MediaFile
    const aiFile: MediaFile = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      url: generatedMedia.imageUrl,
      type: "image",
      title:
        generatedMedia.prompt.slice(0, 50) +
        (generatedMedia.prompt.length > 50 ? "..." : ""),
      selectedImage: "ai",
      aiImageUrl: generatedMedia.imageUrl,
    };
    setFile(aiFile);
    setUploadComplete(false);
    setShowAIModal(false);

    // Pre-fill form data with AI image info
    setFormData((prev) => ({
      ...prev,
      title: `AI: ${generatedMedia.prompt.slice(0, 30)}${
        generatedMedia.prompt.length > 30 ? "..." : ""
      }`,
      category: prev.category || "additional",
    }));
  };
  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          /* Prevent automatic closing - only explicit close buttons work */
        }}
      >
        <DialogContent
          className={`${
            isExifSheetOpen ? "max-w-7xl" : "max-w-4xl"
          } max-h-[90vh] p-0 transition-all duration-300 flex flex-col rounded-lg overflow-hidden`}
          onInteractOutside={(e) => {
            const target = e.target as HTMLElement | null;
            if (target && target.closest("[data-allow-outside-interact]"))
              return;
            e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            const target = e.target as HTMLElement | null;
            if (target && target.closest("[data-allow-outside-interact]"))
              return;
            e.preventDefault();
          }}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogDescription className="sr-only">
            {t("mediaUploadModal.uploadTitle")}
          </DialogDescription>
          <div className="flex h-full overflow-hidden">
            {/* Main Content Section - Hidden on mobile/tablet when EXIF is open */}
            <div
              className={`${
                isExifSheetOpen
                  ? "hidden lg:flex lg:w-1/2 lg:border-r lg:border-border"
                  : "w-full"
              } flex flex-col transition-all duration-300`}
            >
              <div className="sticky top-0 bg-background z-10 border-b border-border">
                <DialogHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between">
                    <DialogTitle className="text-2xl font-bold text-foreground">
                      {isBulkUpload
                        ? t("mediaUploadModal.titleBulk")
                        : t("mediaUploadModal.titleSingle")}
                    </DialogTitle>
                    <div className="flex items-center gap-2">
                      {/* <Button variant="outline" size="sm" onClick={() => setIsExifSheetOpen(v => !v)} className="gap-2 text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary hover:scale-105">
                        <Settings2 className="h-3 w-3" />
                        {isExifSheetOpen ? "Close EXIF" : "Edit EXIF"}
                       </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClose}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Upload Complete State */}
                {uploadComplete && (file || files.length > 0) && (
                  <div className="text-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-8 h-8 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {t("mediaUploadModal.uploadCompleteTitle")}
                    </h3>
                    <p className="text-muted-foreground">
                      {t("mediaUploadModal.your")}
                      <span className="font-medium text-primary">
                        {files.length > 0
                          ? t("mediaUploadModal.media", { count: files.length })
                          : // `${files.length} media items`
                            file?.type}
                      </span>{" "}
                      {files.length > 0
                        ? t("mediaUploadModal.uploadHave")
                        : t("mediaUploadModal.uploadHas")}
                    </p>
                  </div>
                )}

                {/* Upload Interface */}
                {!uploadComplete && (
                  <>
                    {/* Multi-Listing Selector for Bulk Upload */}
                    {isBulkUpload && (
                      <div className="pb-6 border-b border-border">
                        <MultiListingSelector
                          selectedListings={selectedListings}
                          onListingsChange={setSelectedListings}
                          error={
                            selectedListings.length === 0
                              ? t("mediaUploadModal.selectListingError")
                              : undefined
                          }
                        />
                      </div>
                    )}

                    {/* Dropzone Area - Only show if no file selected */}
                    {!file && files.length === 0 && (
                      <MediaDropzone
                        onFilesAdded={handleFilesAdded}
                        onAIGenerate={() => setShowAIModal(true)}
                        enableMultiSelect={enableMultiSelect}
                        maxSelectionLimit={maxSelectionLimit}
                      />
                    )}

                    {/* Multiple Files Preview */}
                    {files.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            {t("mediaUploadModal.multipleFile.preview", {
                              count: files.length,
                            })}
                            {/* Media Preview ({files.length} items) */}
                          </h3>
                          {files.some((f) => f.type === "image") && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        setIsExifSheetOpen(!isExifSheetOpen)
                                      }
                                      className="gap-2 text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary hover:scale-105"
                                      disabled={!hasJpegImages(files)}
                                    >
                                      <Settings2 className="h-3 w-3" />
                                      {isExifSheetOpen
                                        ? t("mediaUploadModal.close")
                                        : t("mediaUploadModal.edit")}
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                {!hasJpegImages(files) && (
                                  <TooltipContent
                                    side="left"
                                    align="center"
                                    className="z-50"
                                  >
                                    <p>{t("mediaUploadModal.exif")}</p>
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                          {files.map((currentFile) => (
                            <div
                              key={currentFile.id}
                              className="relative group"
                            >
                              <div className="aspect-square overflow-hidden rounded-lg border border-border">
                                {currentFile.type === "video" ? (
                                  <video
                                    src={currentFile.url}
                                    className="h-full w-full object-cover"
                                    preload="metadata"
                                    muted
                                  />
                                ) : (
                                  <img
                                    src={currentFile.url}
                                    alt={currentFile.title || "Preview"}
                                    className="h-full w-full object-cover"
                                  />
                                )}
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleFileRemove(currentFile.id)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                {currentFile.title || "Gallery Image"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Single File Preview */}
                    {file && files.length === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            {t("mediaUploadModal.mediaPreview")}
                          </h3>
                          <div className="flex flex-col items-end gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                {t("mediaUploadModal.typeLabel")}
                              </span>
                              <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                                {file.selectedImage === "ai"
                                  ? t("mediaUploadModal.aiImage")
                                  : file.selectedImage === "gallery"
                                  ? t("mediaUploadModal.galleryImage")
                                  : file.type.toUpperCase()}
                              </span>
                            </div>
                            {file.type === "image" && files.length === 0 && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          setIsExifSheetOpen(!isExifSheetOpen)
                                        }
                                        className="gap-2 text-xs transition-all duration-200 hover:bg-primary/5 hover:border-primary hover:scale-105"
                                        disabled={!isJpegImage(file)}
                                      >
                                        <Settings2 className="h-3 w-3" />
                                        {isExifSheetOpen
                                          ? t("mediaUploadModal.close")
                                          : t("mediaUploadModal.edit")}
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  {!isJpegImage(file) && (
                                    <TooltipContent
                                      side="left"
                                      align="center"
                                      sideOffset={5}
                                      className="z-[9999] max-w-[200px]"
                                    >
                                      <p>{t("mediaUploadModal.jpg")}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                        <div className="max-w-xs mx-auto">
                          <MediaPreview
                            file={file}
                            onRemove={handleFileRemove}
                          />
                        </div>
                      </div>
                    )}

                    {/* Form Fields */}
                    <MediaForm
                      formData={formData}
                      onChange={handleFormDataChange}
                      hasFiles={!!(file || files.length > 0)}
                      fileType={file?.type || files[0]?.type}
                    />

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-border">
                      <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                        className="hidden sm:inline-flex"
                      >
                        {t("mediaUploadModal.cancel")}
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={
                          (!file && files.length === 0) ||
                          isUploading ||
                          (isBulkUpload
                            ? selectedListings.length === 0
                            : !selectedListing)
                        }
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                      >
                        {isUploading
                          ? isBulkUpload
                            ? t("mediaUploadModal.uploadingBulk")
                            : t("mediaUploadModal.uploadingSingle")
                          : isBulkUpload
                          ? t("mediaUploadModal.uploadButtonBulk")
                          : files.length > 1
                          ? t("mediaUploadModal.uploadBulkItem", {
                              count: files.length,
                            })
                          : // `Upload ${files.length} Items`
                            t("mediaUploadModal.uploadButtonSingle")}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* EXIF Editor Section - Full width on mobile/tablet, half width on desktop - Works for both single and multiple image uploads */}
            <div
              className={`${
                isExifSheetOpen &&
                ((file && file.type === "image") ||
                  (files.length > 0 && files.some((f) => f.type === "image")))
                  ? "w-full lg:w-1/2"
                  : "w-0"
              } overflow-hidden transition-all duration-300 ease-in-out`}
            >
              {isExifSheetOpen &&
                ((file && files.length === 0 && file.type === "image") ||
                  (files.length > 0 &&
                    files.some((f) => f.type === "image"))) && (
                  <div className="h-full bg-background flex flex-col animate-slide-in-right">
                    <div className="sticky top-0 bg-background z-10 border-b border-border p-6 pb-4 flex-shrink-0">
                      <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <Settings2 className="h-5 w-5 text-primary" />
                          <h3 className="text-2xl font-bold text-foreground">
                            {t("mediaUploadModal.editExif")}
                            {(() => {
                              // Calculate total image count from both single file and files array
                              const totalImageCount = 
                                (file && file.type === "image" ? 1 : 0) + 
                                files.filter((f) => f.type === "image").length;
                              
                              return totalImageCount > 1
                                ? ` (${totalImageCount} ${t("mediaUploadModal.images")})`
                                : ` (${totalImageCount} ${t("mediaUploadModal.image")})`;
                            })()}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsExifSheetOpen(false)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 md:p-6 overflow-y-auto flex-1">
                      <ExifEditorContent
                        exifData={exifData}
                        imageUrl={files.length === 0 ? file?.url : undefined}
                        imageUrls={
                          files.length > 0
                            ? files
                                .filter((f) => f.type === "image")
                                .map((f) => {
                                  if (f.selectedImage === "ai")
                                    return f.aiImageUrl || f.url;
                                  if (f.selectedImage === "gallery")
                                    return f.galleryImageUrl || f.url;
                                  return f.url;
                                })
                            : undefined
                        }
                        onSave={(data) => {
                          setExifData(data);
                          toast({
                            title: t("mediaUploadModal.updateExif"),
                            description:
                              files.length > 0
                                ? `Metadata will be applied to ${
                                    files.filter((f) => f.type === "image")
                                      .length
                                  } image(s)`
                                : t("mediaUploadModal.metaUpdate"),
                          });
                        }}
                        onClose={() => setIsExifSheetOpen(false)}
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AIMediaGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerated={handleAIGenerated}
      />
    </>
  );
};

// Extracted EXIF Editor Content Component
interface ExifEditorContentProps {
  exifData: any;
  imageUrl?: string;
  imageUrls?: string[];
  onSave: (data: any) => void;
  onClose: () => void;
}
const ExifEditorContent: React.FC<ExifEditorContentProps> = ({
  exifData,
  imageUrl,
  imageUrls,
  onSave,
  onClose,
}) => {
  const { t } = useI18nNamespace("Media/mediaUploadModal");
  const { toast } = useToast();
  const [localData, setLocalData] = React.useState(exifData);
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [templates, setTemplates] = React.useState<
    Array<{
      id: string;
      template_name: string;
    }>
  >([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>("");
  const [isLoadingTemplates, setIsLoadingTemplates] = React.useState(false);
  const [isLoadingTemplateDetails, setIsLoadingTemplateDetails] =
    React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [showTemplateField, setShowTemplateField] = React.useState(false);
  const [newTemplateName, setNewTemplateName] = React.useState("");
  const [hasChangesAfterTemplate, setHasChangesAfterTemplate] =
    React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [templateToDelete, setTemplateToDelete] = React.useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeletingTemplate, setIsDeletingTemplate] = React.useState(false);
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, boolean>
  >({});
  const [isDuplicateTemplate, setIsDuplicateTemplate] = React.useState(false);
  React.useEffect(() => {
    setLocalData(exifData);
  }, [exifData]);

  // Load templates on mount
  React.useEffect(() => {
    const loadTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const response = await getExifTemplateList({
          search: "",
          page: 1,
          limit: 100,
        });
        if (response.code === 200) {
          setTemplates(response.data.templates);
        }
      } catch (error) {
        // console.error("Error loading templates:", error);
        toast({
          title: t("mediaUploadModal.error"),
          description: t("mediaUploadModal.failed"),
          variant: "destructive",
        });
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []);
  const handleTemplateSelect = async (templateId: string) => {
    if (!templateId) {
      setSelectedTemplate("");
      setHasChangesAfterTemplate(false);
      return;
    }
    setSelectedTemplate(templateId);
    setHasChangesAfterTemplate(false);
    setIsLoadingTemplateDetails(true);
    try {
      const response = await getExifTemplateDetails({
        templateId: parseInt(templateId),
      });
      if (response.code === 200) {
        const template = response.data.template;
        // Map API response to local state
        setLocalData({
          name: template.imgname || "",
          title: template.imgtitle || "",
          subject: template.imgsub || "",
          keyword: template.imgkey || "",
          copyright: template.imgcopy || "",
          author: template.imgauthor || "",
          comment: template.imgcomment || "",
          description: template.imgdesc || "",
          gpsLatitude: template.imglat || "",
          gpsLongitude: template.imglong || "",
          maker: template.imgmaker || "",
          software: template.imgsoftware || "",
          model: template.imgmodel || "",
          template: templateId,
        });
      }
    } catch (error) {
      // console.error("Error loading template details:", error);
      toast({
        title: t("mediaUploadModal.error"),
        description: t("mediaUploadModal.tempDetail"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingTemplateDetails(false);
    }
  };
  // Handle delete template - open confirmation dialog
  const handleDeleteTemplate = (
    templateId: string,
    templateName: string,
    e: React.SyntheticEvent
  ) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Prevent event from bubbling to SelectItem
    setTemplateToDelete({ id: templateId, name: templateName });
    setShowDeleteDialog(true);
  };

  // Confirm delete template
  const confirmDeleteTemplate = async () => {
    if (!templateToDelete) return;

    setIsDeletingTemplate(true);
    try {
      const response = await deleteExifTemplate({
        templateId: parseInt(templateToDelete.id),
        confirm: "delete",
      });

      if (response.code === 200) {
        toast({
          title: t("mediaUploadModal.success"),
          description: t("mediaUploadModal.tempDelete"),
          variant: "default",
        });

        // Reload templates
        const templatesResponse = await getExifTemplateList({
          search: "",
          page: 1,
          limit: 100,
        });
        if (templatesResponse.code === 200) {
          setTemplates(templatesResponse.data.templates);
        }

        // Clear selection if deleted template was selected
        if (selectedTemplate === templateToDelete.id) {
          setSelectedTemplate("");
          // Reset EXIF form data to default values
          setLocalData({
            name: "",
            subject: "",
            copyright: "",
            title: "",
            keyword: "",
            author: "",
            comment: "",
            description: "",
            gpsLatitude: "",
            gpsLongitude: "",
            maker: "",
            software: "",
            model: "",
            template: "default",
          });
        }
      }

      setShowDeleteDialog(false);
      setTemplateToDelete(null);
    } catch (error) {
      // console.error("Error deleting template:", error);
      toast({
        title: t("mediaUploadModal.error"),
        description: t("mediaUploadModal.tempFail"),
        variant: "destructive",
      });
    } finally {
      setIsDeletingTemplate(false);
    }
  };
  const validateRequiredFields = () => {
    const requiredFields = {
      title: localData.title?.trim(),
      subject: localData.subject?.trim(),
      copyright: localData.copyright?.trim(),
      author: localData.author?.trim(),
      keyword: localData.keyword?.trim(),
    };

    const errors: Record<string, boolean> = {};
    const missingFields: string[] = [];

    Object.entries(requiredFields).forEach(([key, value]) => {
      if (!value) {
        errors[key] = true;
        missingFields.push(key.charAt(0).toUpperCase() + key.slice(1));
      }
    });

    setValidationErrors(errors);
    return missingFields;
  };

  const handleChange = (field: string, value: string) => {
    setLocalData((prev: any) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }

    // Track changes after template selection
    if (selectedTemplate) {
      setHasChangesAfterTemplate(true);
    }
  };
  const performSave = async (saveAsNew: number, templateName: string) => {
    // For multiple images, call API with array of URLs when provided
    if (!imageUrl) {
      const urls = (imageUrls?.filter((u) => !!u) as string[]) || [];
      if (urls.length === 0) {
        // No image URLs available - save locally as fallback
        onSave(localData);
        toast({
          title: t("mediaUploadModal.success"),
          description:
            saveAsNew === 1
              ? t("mediaUploadModal.tempSave", { templateName })
              : // `Template "${templateName}" saved successfully`
                t("mediaUploadModal.exifData"),
          variant: "success",
        });

        // Reload templates if a new one was saved
        if (saveAsNew === 1) {
          try {
            const templatesResponse = await getExifTemplateList({
              search: "",
              page: 1,
              limit: 100,
            });
            if (templatesResponse.code === 200) {
              setTemplates(templatesResponse.data.templates);
            }
          } catch (error) {
            // console.error("Error reloading templates:", error);
          }
        }

        setShowTemplateField(false);
        setNewTemplateName("");
        return;
      }

      setIsSaving(true);
      try {
        const response = await updateImgexifDetails({
          ImageUrl: urls,
          imgname: localData.name || "",
          imgtitle: localData.title || "",
          imgsub: localData.subject || "",
          imgkey: localData.keyword || "",
          imgcopy: localData.copyright || "",
          imgauthor: localData.author || "",
          imgcomment: localData.comment || "",
          imgdesc: localData.description || "",
          imglat: localData.gpsLatitude || "",
          imglong: localData.gpsLongitude || "",
          imgmaker: localData.maker || "",
          imgsoftware: localData.software || "",
          imgmodel: localData.model || "",
          saveAs: saveAsNew,
          tempname: templateName,
        });
        if (response.code === 200) {
          onSave(localData);
          toast({
            title: t("mediaUploadModal.success"),
            description:
              saveAsNew === 1
                ? t("mediaUploadModal.tempSave", { templateName })
                : // `Template "${templateName}" saved successfully`
                  t("mediaUploadModal.exifUpdate"),
            variant: "success",
          });

          // Reload templates if a new one was saved
          if (saveAsNew === 1) {
            const templatesResponse = await getExifTemplateList({
              search: "",
              page: 1,
              limit: 100,
            });
            if (templatesResponse.code === 200) {
              setTemplates(templatesResponse.data.templates);
            }
          }
          onClose();
        }
      } catch (error) {
        // console.error("Error saving EXIF data:", error);
        toast({
          title: t("mediaUploadModal.error"),
          description: t("mediaUploadModal.exifFail"),
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
        setShowTemplateField(false);
        setNewTemplateName("");
      }
      return;
    }

    // Original logic for single image
    setIsSaving(true);
    try {
      const response = await updateImgexifDetails({
        ImageUrl: [imageUrl],
        imgname: localData.name || "",
        imgtitle: localData.title || "",
        imgsub: localData.subject || "",
        imgkey: localData.keyword || "",
        imgcopy: localData.copyright || "",
        imgauthor: localData.author || "",
        imgcomment: localData.comment || "",
        imgdesc: localData.description || "",
        imglat: localData.gpsLatitude || "",
        imglong: localData.gpsLongitude || "",
        imgmaker: localData.maker || "",
        imgsoftware: localData.software || "",
        imgmodel: localData.model || "",
        saveAs: saveAsNew,
        tempname: templateName,
      });
      if (response.code === 200) {
        onSave(localData);
        toast({
          title: t("mediaUploadModal.success"),
          description:
            saveAsNew === 1
              ? t("mediaUploadModal.tempSave", { templateName })
              : // `Template "${templateName}" saved successfully`
                t("mediaUploadModal.exifUpdate"),
          variant: "success",
        });

        // Reload templates if a new one was saved
        if (saveAsNew === 1) {
          const templatesResponse = await getExifTemplateList({
            search: "",
            page: 1,
            limit: 100,
          });
          if (templatesResponse.code === 200) {
            setTemplates(templatesResponse.data.templates);
          }
        }
        onClose();
      }
    } catch (error) {
      // console.error("Error saving EXIF data:", error);
      toast({
        title: t("mediaUploadModal.error"),
        description: t("mediaUploadModal.exifFail"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
      setShowTemplateField(false);
      setNewTemplateName("");
    }
  };
  const handleSave = () => {
    // Validate required fields
    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      toast({
        title: t("mediaUploadModal.required"),
        description: `${t("mediaUploadModal.fill")}: ${missingFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    if (selectedTemplate && !hasChangesAfterTemplate) {
      // Template is selected and no changes made, save directly with saveAs: 0
      performSave(0, "");
    } else {
      // No template selected or changes were made after template selection, show the template field
      setShowTemplateField(true);
    }
  };
  // Check if template name already exists
  const isDuplicateTemplateName = (name: string): boolean => {
    const trimmedName = name.trim().toLowerCase();
    return templates.some(
      (template) => template.template_name.toLowerCase() === trimmedName
    );
  };

  const handleSubmitTemplate = () => {
    // Validate required fields first
    const missingFields = validateRequiredFields();
    if (missingFields.length > 0) {
      toast({
        title: t("mediaUploadModal.required"),
        description: `${t("mediaUploadModal.fill")}: ${missingFields.join(
          ", "
        )}`,
        variant: "destructive",
      });
      return;
    }

    const trimmedName = newTemplateName.trim();

    if (!trimmedName) {
      toast({
        title: t("mediaUploadModal.error"),
        description: t("mediaUploadModal.template"),
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate template name
    if (isDuplicateTemplateName(trimmedName)) {
      setIsDuplicateTemplate(true);
      toast({
        title: t("mediaUploadModal.duplicate"),
        description: t("mediaUploadModal.duplicateDesc"),
        variant: "destructive",
      });
      return;
    }

    performSave(1, trimmedName);
  };
  const handleSkipTemplate = () => {
    performSave(0, "");
  };
  return (
    <>
      <div className="space-y-6">
        {/* Alert Message */}
        <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-blue-900 font-medium">
              {t("mediaUploadModal.infoExif")}
            </p>
            <p className="text-xs text-blue-700 mt-1">
              {t("mediaUploadModal.descExif")}
            </p>
          </div>
        </div>

        {/* Row 1: Template Selector (Image preview removed for multiple images) */}
        <div className="flex items-start gap-4">
          {imageUrl && (
            <div className="flex-shrink-0">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-[100px] h-[100px] object-cover rounded-lg border border-border"
              />
            </div>
          )}
          <div className="flex-1 space-y-2 px-3 pb-3 bg-blue-100 rounded-lg pt-2 ">
            <Label
              htmlFor="template"
              className="text-sm font-medium text-foreground"
            >
              {t("mediaUploadModal.select")}
            </Label>
            <Select
              value={selectedTemplate}
              onValueChange={handleTemplateSelect}
              disabled={isLoadingTemplates || isLoadingTemplateDetails}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t("mediaUploadModal.selectPlaceholder")}
                />
              </SelectTrigger>
              <SelectContent className="z-[10000] bg-popover">
                {templates.map((template) => (
                  <SelectItem
                    key={template.id}
                    value={template.id}
                    className="group relative w-full hover:bg-accent"
                  >
                    <div className="flex items-center justify-between w-full gap-3 pr-8">
                      <span className="flex-1">{template.template_name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        tabIndex={-1}
                        className="h-7 w-7 p-0 absolute right-1 top-1/2 -translate-y-1/2 z-[1000] opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent pointer-events-auto"
                        aria-label={`Delete template ${template.template_name}`}
                        onPointerDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeleteTemplate(
                            template.id,
                            template.template_name,
                            e
                          );
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingTemplateDetails && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                {t("mediaUploadModal.loading")}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Image Metadata Section */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-foreground"></h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs text-muted-foreground">
                {t("mediaUploadModal.title")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={localData.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder={t("mediaUploadModal.titlePlaceholder")}
                className={validationErrors.title ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="subject"
                className="text-xs text-muted-foreground"
              >
                {t("mediaUploadModal.subject")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="subject"
                value={localData.subject || ""}
                onChange={(e) => handleChange("subject", e.target.value)}
                placeholder={t("mediaUploadModal.subjectPlaceholder")}
                className={validationErrors.subject ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="copyright"
                className="text-xs text-muted-foreground"
              >
                {t("mediaUploadModal.copyright")}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="copyright"
                value={localData.copyright || ""}
                onChange={(e) => handleChange("copyright", e.target.value)}
                placeholder={t("mediaUploadModal.copyrightPlaceholder")}
                className={
                  validationErrors.copyright ? "border-destructive" : ""
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author" className="text-xs text-muted-foreground">
                {t("mediaUploadModal.author")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="author"
                value={localData.author || ""}
                onChange={(e) => handleChange("author", e.target.value)}
                placeholder={t("mediaUploadModal.autorPlaceholder")}
                className={validationErrors.author ? "border-destructive" : ""}
              />
            </div>
          </div>

          {/* Comment and Description - Full Width Textareas */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="keyword"
                className="text-xs text-muted-foreground"
              >
                {t("mediaUploadModal.keyword")}{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="keyword"
                value={localData.keyword || ""}
                onChange={(e) => handleChange("keyword", e.target.value)}
                placeholder={t("mediaUploadModal.keywordPlaceholder")}
                className={validationErrors.keyword ? "border-destructive" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="comment"
                className="text-xs text-muted-foreground"
              >
                {t("mediaUploadModal.comment")}
              </Label>
              <Textarea
                id="comment"
                value={localData.comment || ""}
                onChange={(e) => handleChange("comment", e.target.value)}
                placeholder={t("mediaUploadModal.commentPlaceholder")}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-xs text-muted-foreground"
              >
                {t("mediaUploadModal.description")}
              </Label>
              <Textarea
                id="description"
                value={localData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder={t("mediaUploadModal.descriptionPlaceholder")}
                className="min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Advanced Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                {t("mediaUploadModal.advanced")}
              </h3>
            </div>
            <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          </div>

          {showAdvanced && (
            <div className="space-y-4 animate-fade-in">
              {/* GPS Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <Label className="text-xs font-medium text-muted-foreground">
                    {t("mediaUploadModal.gps")}
                  </Label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="gpsLatitude"
                      className="text-xs text-muted-foreground"
                    >
                      {t("mediaUploadModal.lat")}
                    </Label>
                    <Input
                      id="gpsLatitude"
                      value={localData.gpsLatitude || ""}
                      onChange={(e) =>
                        handleChange("gpsLatitude", e.target.value)
                      }
                      placeholder={t("mediaUploadModal.latPlaeholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="gpsLongitude"
                      className="text-xs text-muted-foreground"
                    >
                      {t("mediaUploadModal.lang")}
                    </Label>
                    <Input
                      id="gpsLongitude"
                      value={localData.gpsLongitude || ""}
                      onChange={(e) =>
                        handleChange("gpsLongitude", e.target.value)
                      }
                      placeholder={t("mediaUploadModal.langPlaeholder")}
                    />
                  </div>
                </div>
              </div>

              {/* Camera & Software Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="maker"
                    className="text-xs text-muted-foreground"
                  >
                    {t("mediaUploadModal.maker")}
                  </Label>
                  <Input
                    id="maker"
                    value={localData.maker || ""}
                    onChange={(e) => handleChange("maker", e.target.value)}
                    placeholder={t("mediaUploadModal.makerPlaceholder")}
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="software"
                    className="text-xs text-muted-foreground"
                  >
                    {t("mediaUploadModal.software")}
                  </Label>
                  <Input
                    id="software"
                    value={localData.software || ""}
                    onChange={(e) => handleChange("software", e.target.value)}
                    placeholder={t("mediaUploadModal.softwarePlaceholder")}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label
                    htmlFor="model"
                    className="text-xs text-muted-foreground"
                  >
                    {t("mediaUploadModal.model")}
                  </Label>
                  <Input
                    id="model"
                    value={localData.model || ""}
                    onChange={(e) => handleChange("model", e.target.value)}
                    placeholder={t("mediaUploadModal.modelPlaceholder")}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Save as Template Section - Only shown when Save is clicked */}
        {showTemplateField && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <Label
                  htmlFor="templateName"
                  className="text-sm font-medium text-foreground"
                >
                  {t("mediaUploadModal.save")}
                </Label>
              </div>
              <Input
                id="templateName"
                value={newTemplateName}
                onChange={(e) => {
                  setNewTemplateName(e.target.value);
                  setIsDuplicateTemplate(false);
                }}
                placeholder={t("mediaUploadModal.templatePlaceholder")}
                className={`w-full ${
                  isDuplicateTemplate ? "border-destructive" : ""
                }`}
                autoFocus
              />
              {isDuplicateTemplate && (
                <p className="text-xs text-destructive mt-1">
                  {t("mediaUploadModal.duplicateTemp")}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {t("mediaUploadModal.future")}
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className=" bg-background border-t border-border pt-4  flex gap-3 justify-end">
          {!showTemplateField ? (
            <>
              <Button variant="outline" onClick={onClose} disabled={isSaving}>
                {t("mediaUploadModal.close1")}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("mediaUploadModal.saving")}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {t("mediaUploadModal.save1")}
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleSkipTemplate}
                disabled={isSaving}
              >
                {t("mediaUploadModal.skip")}
              </Button>
              <Button
                onClick={handleSubmitTemplate}
                disabled={isSaving || !newTemplateName.trim()}
                className="gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("mediaUploadModal.saving")}
                  </>
                ) : (
                  t("mediaUploadModal.continue")
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogPortal>
          <AlertDialogOverlay className="z-[190]" />
          <AlertDialogContent className="z-[200]">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {t("mediaUploadModal.deleteTemplate")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("mediaUploadModal.deleteDesc", {
                  name: templateToDelete?.name,
                })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeletingTemplate}>
                {t("mediaUploadModal.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDeleteTemplate}
                disabled={isDeletingTemplate}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeletingTemplate
                  ? t("mediaUploadModal.deleting")
                  : t("mediaUploadModal.delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogPortal>
      </AlertDialog>
    </>
  );
};
