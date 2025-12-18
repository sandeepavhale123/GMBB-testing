import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Upload,
  Eye,
  Trash2,
  Download,
  FileImage,
  Film,
  MoreVertical,
  Copy,
  CheckSquare,
  Square,
  FileDown,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { AIImagePreview } from "@/components/Media/AIGeneration/AIImagePreview";
import {
  generateAIImage,
  uploadGalleryMedia,
  deleteGalleryMedia,
} from "@/api/mediaApi";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaContext } from "../../context/MediaContext";
import { useNavigate } from "react-router-dom";
import { useGalleryImagesQuery } from "@/hooks/useGalleryImagesQuery";
import {
  useUploadGalleryMediaMutation,
  useDeleteGalleryMediaMutation,
  useSaveAIImageMutation,
} from "@/hooks/useGalleryMutations";
import { GalleryImageItem } from "@/api/mediaApi";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
import { downloadMediaCSV } from "@/utils/csvExportUtils";

export interface MediaItem {
  id: string;
  url: string;
  type: "image" | "video";
  title: string;
  category: "local" | "ai-generated";
  date: string;
  width?: number;
  height?: number;
  key?: string;
  timestamp?: number;
}

interface GalleryProps {
  showTabs?: boolean;
  showHeader?: boolean;
  showUpload?: boolean;
  showAIGeneration?: boolean;
  showDeleteButton?: boolean;
  showSelectButton?: boolean;
  enableMultiSelect?: boolean;
  maxSelectionLimit?: number;
  selectedImages?: MediaItem[];
  onSelectImage?: (imageUrl: string) => void;
  onToggleSelection?: (item: MediaItem) => void;
  onClearSelection?: () => void;
  onUseSelected?: () => void;
  onCloseModal?: () => void;
  className?: string;
}
export const Gallery: React.FC<GalleryProps> = ({
  showTabs = true,
  showHeader = true,
  showUpload = true,
  showAIGeneration = true,
  showDeleteButton = true,
  showSelectButton = false,
  enableMultiSelect = false,
  maxSelectionLimit = 5,
  selectedImages: externalSelectedImages,
  onSelectImage,
  onToggleSelection,
  onClearSelection,
  onUseSelected,
  onCloseModal,
  className = "",
}) => {
  const { t } = useI18nNamespace("Media/gallery"); 
  const { triggerCreatePost, triggerMediaUpload, triggerMultiMediaUpload } =
    useMediaContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"local" | "ai-generated">(
    "local"
  );
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [internalSelectedImages, setInternalSelectedImages] = useState<
    MediaItem[]
  >([]);

  // Export mode state
  const [isExportMode, setIsExportMode] = useState(false);
  const [exportSelectedImages, setExportSelectedImages] = useState<MediaItem[]>([]);

  // Use external selection state if provided, otherwise use internal
  const selectedImages = externalSelectedImages || internalSelectedImages;

  // Map tab to API type
  const getApiType = (tab: string): "IMAGE" | "VIDEO" | "AI" => {
    switch (tab) {
      case "ai-generated":
        return "AI";
      case "video":
        return "VIDEO";
      default:
        return "IMAGE";
    }
  };

  // Use gallery images hook
  const { images, isLoading, error, hasMore, total, loadMore, refetch } =
    useGalleryImagesQuery({
      type: selectedTab === "ai-generated" ? "AI" : mediaType,
      searchTerm: searchQuery,
      sortOrder,
      limit: 16,
    });

  // Transform API images to MediaItem format
  const transformApiImageToMediaItem = (
    apiImage: GalleryImageItem
  ): MediaItem => {
    // Extract filename from key for title
    const filename = apiImage.key.split("/").pop() || "Untitled";
    const title = filename.split(".")[0];

    // Determine type based on file extension
    const extension = filename.split(".").pop()?.toLowerCase() || "";
    const videoExtensions = ["mp4", "avi", "mov", "wmv", "flv", "webm", "mkv"];
    const type = videoExtensions.includes(extension) ? "video" : "image";
    return {
      id: apiImage.key,
      url: apiImage.url,
      type,
      title,
      category: selectedTab === "ai-generated" ? "ai-generated" : "local",
      date: apiImage.date.split(" ")[0],
      // Extract date part
      key: apiImage.key,
      timestamp: apiImage.timestamp,
      width: 400,
      height: 400,
    };
  };
  const mediaData = images?.map(transformApiImageToMediaItem) || [];

  // Debug: Log video data when mediaType is VIDEO
  React.useEffect(() => {
    if (mediaType === "VIDEO") {
      //
    }
  }, [mediaType, images, mediaData]);
  const { toast } = useToast();

  // Upload state
  const [isUploading, setIsUploading] = useState(false);

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiVariants, setAiVariants] = useState(1);
  const [aiStyle, setAiStyle] = useState("photographic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [savingImageIndex, setSavingImageIndex] = useState<
    number | undefined
  >();
  const [deletingItemKey, setDeletingItemKey] = useState<string | null>(null);

  // File upload handler
  // Use mutations
  const uploadMutation = useUploadGalleryMediaMutation();
  const deleteMutation = useDeleteGalleryMediaMutation();
  const saveAIMutation = useSaveAIImageMutation();
  const validateFile = (file: File): boolean => {
    const maxSize = 20 * 1024 * 1024; // 20MB
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/avi",
      "video/mov",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t("gallery.errTitle.invalidTitle"),
        description: t("gallery.messages.invalidFileType"),
        variant: "error",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: t("gallery.errTitle.fileTitle"),
        description: t("gallery.messages.fileTooLarge", {
          size: (file.size / (1024 * 1024)).toFixed(1),
        }),
        // `File size must be less than 10MB. Your file is ${(
        //   file.size /
        //   (1024 * 1024)
        // ).toFixed(1)}MB.`,
        variant: "error",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files) return;

    // Validate all files first
    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    }

    if (validFiles.length === 0) {
      event.target.value = "";
      return;
    }

    setIsUploading(true);
    try {
      for (const file of validFiles) {
        if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
          await uploadMutation.mutateAsync({
            userfile: file,
            selectedImage: "local",
            mediaType: file.type.startsWith("image/") ? "photo" : "video",
          });
        }
      }

      toast({
        title: t("gallery.errTitle.uploadeTitle"),
        description: t("gallery.messages.uploadSuccess", {
          count: files.length,
        }), // `Successfully uploaded ${validFiles.length} file(s).`
        variant: "success",
      });
    } catch (error) {
      // console.error("Upload error:", error);
      toast({
        title: t("gallery.errTitle.uploadFailedTitle"),
        description: t("gallery.messages.uploadFailed"),
        variant: "error",
      });
    } finally {
      setIsUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  // Display media from API only (no local uploads anymore)
  const displayMedia = mediaData;
  const handleLoadMore = () => {
    loadMore();
  };
  const handleViewMedia = (media: MediaItem) => {
    setSelectedMedia(media);
  };
  const handleDeleteMedia = async (mediaKey: string) => {
    try {
      setDeletingItemKey(mediaKey);
      await deleteMutation.mutateAsync({
        key: mediaKey,
      });
    } catch (error) {
      // console.error("Error deleting media:", error);
    } finally {
      setDeletingItemKey(null);
    }
  };
  const handleSelectMedia = (media: MediaItem) => {
    if (onSelectImage) {
      onSelectImage(media.url);
    } else {
      // When no onSelectImage prop is provided, use MediaContext for "Use for Media"
      triggerMediaUpload({
        url: media.url,
        title: media.title,
        source: "gallery",
        type: media.type,
      });
    }
  };

  // Multi-select handlers
  const handleToggleSelection = (item: MediaItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (onToggleSelection) {
      onToggleSelection(item);
    } else {
      setInternalSelectedImages((prev) => {
        const isSelected = prev.some((img) => img.id === item.id);

        if (isSelected) {
          return prev.filter((img) => img.id !== item.id);
        } else {
          if (prev.length >= maxSelectionLimit) {
            toast({
              title: t("gallery.errTitle.limit"),
              description: t("gallery.messages.uploadLimit", {
                maxSelectionLimit,
              }),
              // `You can only select up to ${maxSelectionLimit} images.`,
              variant: "destructive",
            });
            return prev;
          }
          return [...prev, item];
        }
      });
    }
  };

  const handleClearSelection = () => {
    if (onClearSelection) {
      onClearSelection();
    } else {
      setInternalSelectedImages([]);
    }
  };

  const handleUseSelected = () => {
    if (onUseSelected) {
      onUseSelected();
    } else {
      if (selectedImages.length === 0) {
        toast({
          title: t("gallery.errTitle.noImage"),
          description: t("gallery.messages.least"),
          variant: "destructive",
        });
        return;
      }

      const mediaItems = selectedImages.map((img) => ({
        url: img.url,
        title: img.title,
        source: "gallery" as const,
        type: img.type,
        id: img.id,
      }));

      triggerMultiMediaUpload(mediaItems);
      if (onCloseModal) {
        onCloseModal();
      }
    }
  };

  const isImageSelected = (itemId: string) => {
    return selectedImages.some((img) => img.id === itemId);
  };

  // Export mode handlers
  const isExportSelected = (itemId: string) => {
    return exportSelectedImages.some((img) => img.id === itemId);
  };

  const handleExportToggleSelection = (item: MediaItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExportSelectedImages((prev) => {
      const isSelected = prev.some((img) => img.id === item.id);
      if (isSelected) {
        return prev.filter((img) => img.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleExitExportMode = () => {
    setIsExportMode(false);
    setExportSelectedImages([]);
  };

  const handleExportCSV = () => {
    if (exportSelectedImages.length === 0) {
      toast({
        title: t("gallery.errTitle.noImage"),
        description: t("gallery.export.noItemsSelected"),
        variant: "destructive",
      });
      return;
    }
    downloadMediaCSV(exportSelectedImages);
    toast({
      title: t("gallery.errTitle.uploadeTitle"),
      description: t("gallery.export.exportSuccess", { count: exportSelectedImages.length }),
      variant: "success",
    });
    handleExitExportMode();
  };

  // AI Generation handlers
  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    try {
      const response = await generateAIImage({
        prompt: aiPrompt,
        variants: aiVariants,
        style: aiStyle,
      });
      if (response.code === 200 && response.data?.results) {
        const imageUrls = response.data.results.map((result) => result.url);
        setGeneratedImages(imageUrls);
        setSelectedImageIndex(0);
        toast({
          title: t("gallery.errTitle.generateTitle"),
          description: t("gallery.messages.geneateSuccess", {
            count: imageUrls.length,
          }),
          // `Successfully generated ${imageUrls.length} image(s).`,
        });
      }
    } catch (error) {
      // console.error("AI generation error:", error);
      toast({
        title: t("gallery.errTitle.generateFailedTitle"),
        description: t("gallery.messages.generationFailed"),
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handlePreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : generatedImages.length - 1
    );
  };
  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < generatedImages.length - 1 ? prev + 1 : 0
    );
  };
  const handleSelectImageFromGenerated = (index: number) => {
    setSelectedImageIndex(index);
  };

  // AI Image save handler
  const handleSaveAIImage = async (imageUrl: string) => {
    const imageIndex = generatedImages.indexOf(imageUrl);
    setSavingImageIndex(imageIndex);
    try {
      await saveAIMutation.mutateAsync({
        selectedImage: "ai",
        aiImageUrl: imageUrl,
        mediaType: "photo",
      });
    } catch (error) {
      // console.error("Save AI image error:", error);
    } finally {
      setSavingImageIndex(undefined);
    }
  };
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with tabs */}
      {showHeader && (
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-foreground text-2xl">
              {t("gallery.title")}
            </h1>
          </div>
          <div className="flex align-center gap-4">
            <Badge
              variant="secondary"
              className="text-mg bg-primary text-white hidden rounded-[5px] hover:bg-primary hover:text-white"
            >
              {t("gallery.available")}
            </Badge>
            {showTabs && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedTab("local")}
                  className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                    selectedTab === "local"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {t("gallery.uploaded")}
                </button>
                <button
                  onClick={() => setSelectedTab("ai-generated")}
                  className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                    selectedTab === "ai-generated"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {t("gallery.aiGenerated")}
                </button>
              </div>
            )}
            {/* Export Mode Toggle */}
            {!showSelectButton && (
              <Button
                variant={isExportMode ? "destructive" : "outline"}
                size="sm"
                onClick={() => isExportMode ? handleExitExportMode() : setIsExportMode(true)}
                className="flex items-center gap-2"
              >
                {isExportMode ? (
                  <>
                    <X className="h-4 w-4" />
                    {t("gallery.export.exitExport")}
                  </>
                ) : (
                  <>
                    <FileDown className="h-4 w-4" />
                    {t("gallery.export.exportMode")}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Export Mode Action Bar */}
      {isExportMode && exportSelectedImages.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportSelectedImages(displayMedia)}
            >
              {t("gallery.export.selectAll", "Select All")}
            </Button>
            <Badge variant="secondary" className="bg-primary text-white">
              {t("gallery.export.itemsSelected", { count: exportSelectedImages.length })}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportSelectedImages([])}
            >
              {t("gallery.export.clearSelection")}
            </Button>
            <Button
              size="sm"
              onClick={handleExportCSV}
              className="bg-primary hover:bg-primary/90"
            >
              <FileDown className="h-4 w-4 mr-2" />
              {t("gallery.export.exportCSV")}
            </Button>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {selectedTab === "local" && (
          <div className="space-y-6 pb-10">
            {/* Search and Upload */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                {t("gallery.uploadedImages")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={t("gallery.searchPlaceholder")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>

                <Select
                  value={sortOrder}
                  onValueChange={(value) =>
                    setSortOrder(value as "desc" | "asc")
                  }
                >
                  <SelectTrigger className="w-full sm:w-[140px]">
                    <SelectValue placeholder={t("gallery.sortBy")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">
                      {t("gallery.newestFirst")}
                    </SelectItem>
                    <SelectItem value="asc">
                      {t("gallery.oldestFirst")}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {showUpload && (
                  <>
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      disabled={isUploading}
                    />
                    <Button
                      className="w-full sm:w-auto flex items-center gap-2 bg-primary hover:bg-primary/90 whitespace-nowrap"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4" />
                      {isUploading
                        ? t("gallery.uploading")
                        : t("gallery.uploadMedia")}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Media Filter Tabs */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setMediaType("IMAGE")}
                  className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                    mediaType === "IMAGE"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {t("gallery.images")}
                </button>
                <button
                  onClick={() => setMediaType("VIDEO")}
                  className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
                    mediaType === "VIDEO"
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {t("gallery.videos")}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm text-muted-foreground">
                  {t("gallery.items", { count: total })}
                  {/* {total} items */}
                </div>
              </div>
            </div>

            {/* Media Grid */}
            <div className="flex gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 flex-1">
                {isLoading
                  ? // Skeleton loading
                    Array.from({
                      length: 16,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-lg border border-border bg-card"
                      >
                        <div className="aspect-square">
                          <Skeleton className="h-full w-full" />
                        </div>
                      </div>
                    ))
                  : displayMedia.map((item) => {
                      const isSelected = isImageSelected(item.id);
                      const isExportItemSelected = isExportSelected(item.id);
                      return (
                        <div
                          key={item.id}
                          className={`group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer ${
                            isExportMode && isExportItemSelected
                              ? "border-primary border-2 ring-2 ring-primary/20"
                              : isSelected
                              ? "border-primary border-2 ring-2 ring-primary/20"
                              : "border-border"
                          }`}
                          onClick={
                            isExportMode
                              ? (e) => handleExportToggleSelection(item, e)
                              : enableMultiSelect && showSelectButton
                              ? (e) => handleToggleSelection(item, e)
                              : showSelectButton && !enableMultiSelect
                              ? () => handleSelectMedia(item)
                              : undefined
                          }
                        >
                          {/* Export mode checkbox overlay */}
                          {isExportMode && (
                            <div className="absolute top-2 left-2 z-10">
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center transition-all shadow-lg border-2 border-primary ${
                                  isExportItemSelected
                                    ? "bg-primary shadow-primary/50"
                                    : "bg-white/90 shadow-black/20"
                                }`}
                                onClick={(e) => handleExportToggleSelection(item, e)}
                              >
                                {isExportItemSelected && (
                                  <CheckSquare className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </div>
                          )}

                          {/* Multi-select checkbox overlay */}
                          {enableMultiSelect && showSelectButton && !isExportMode && (
                            <div className="absolute top-2 left-2 z-10">
                              <div
                                className={`w-6 h-6 rounded flex items-center justify-center transition-all shadow-lg border-2 border-primary ${
                                  isSelected
                                    ? "bg-primary shadow-primary/50"
                                    : "bg-white/90 shadow-black/20"
                                }`}
                                onClick={(e) => handleToggleSelection(item, e)}
                              >
                                {isSelected && (
                                  <CheckSquare className="h-4 w-4 text-white" />
                                )}
                              </div>
                            </div>
                          )}

                          <div className="aspect-square overflow-hidden">
                            {item.type === "video" ? (
                              <video
                                src={item.url}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                preload="metadata"
                                muted
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                            )}
                          </div>

                          {/* Action Buttons Overlay - Hidden in Modal View and Export Mode */}
                          {!showSelectButton && !isExportMode && (
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                              <div className="flex items-center gap-2">
                                {/* Quick View */}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => handleViewMedia(item)}
                                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                      title={t("gallery.quick")}
                                    >
                                      <Eye className="h-4 w-4 text-gray-700" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent
                                    className="max-w-4xl"
                                    aria-describedby="media-preview-description"
                                  >
                                    <div className="flex flex-col items-center space-y-4">
                                      {selectedMedia?.type === "video" ? (
                                        <video
                                          src={selectedMedia?.url}
                                          className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                          controls
                                          preload="metadata"
                                        />
                                      ) : (
                                        <img
                                          src={selectedMedia?.url}
                                          alt={selectedMedia?.title}
                                          className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                        />
                                      )}
                                      <div
                                        className="text-center"
                                        id="media-preview-description"
                                      >
                                        <h3 className="text-lg font-semibold">
                                          {selectedMedia?.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {selectedMedia?.date}
                                        </p>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                {/* Actions Dropdown */}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                      title={t("gallery.more")}
                                    >
                                      <MoreVertical className="h-4 w-4 text-gray-700" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    className="w-48 bg-white border border-gray-200 shadow-lg z-50"
                                    align="end"
                                  >
                                    <DropdownMenuItem
                                      onClick={() => {
                                        try {
                                          const link =
                                            document.createElement("a");
                                          link.href = item.url;
                                          link.download = `${
                                            item.title || "media"
                                          }.${
                                            item.type === "video"
                                              ? "mp4"
                                              : "jpg"
                                          }`;
                                          link.target = "_blank";
                                          document.body.appendChild(link);
                                          link.click();
                                          document.body.removeChild(link);
                                        } catch (error) {
                                          console.error(
                                            "Download failed:",
                                            error
                                          );
                                          toast({
                                            title: t(
                                              "gallery.errTitle.downloadTitle"
                                            ),
                                            description: t(
                                              "gallery.messages.downloadFailed"
                                            ),
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Download className="h-4 w-4" />
                                      {item.type === "video"
                                        ? t("gallery.downloadVideo")
                                        : t("gallery.downloadImage")}
                                    </DropdownMenuItem>

                                    {item.type === "image" && (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          triggerCreatePost({
                                            url: item.url,
                                            title: item.title,
                                            source: "gallery",
                                            type: item.type,
                                          });
                                        }}
                                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                      >
                                        <FileImage className="h-4 w-4" />
                                        {t("gallery.useForPost")}
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                      onClick={() => {
                                        triggerMediaUpload({
                                          url: item.url,
                                          title: item.title,
                                          source: "gallery",
                                          type: item.type,
                                        });
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Film className="h-4 w-4" />
                                      {t("gallery.useForMedia")}
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={async () => {
                                        try {
                                          await navigator.clipboard.writeText(
                                            item.url
                                          );
                                          toast.success({
                                            title: t("gallery.errTitle.url"),
                                            description: t(
                                              "gallery.messages.url"
                                            ),
                                          });
                                        } catch (error) {
                                          toast.error({
                                            title: t("gallery.errTitle.falied"),
                                            description: t(
                                              "gallery.messages.failed"
                                            ),
                                          });
                                        }
                                      }}
                                      className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                      <Copy className="h-4 w-4" />
                                      {item.type === "video"
                                        ? t("gallery.cpoyVideoUrl")
                                        : t("gallery.cpoyUrl")}
                                      {/* {t("gallery.cpoyUrl")} */}
                                    </DropdownMenuItem>

                                    {showDeleteButton && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <AlertDialog>
                                          <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                              onSelect={(e) =>
                                                e.preventDefault()
                                              }
                                              className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                              {t("gallery.delete")}
                                            </DropdownMenuItem>
                                          </AlertDialogTrigger>
                                          <AlertDialogContent>
                                            <AlertDialogHeader>
                                              <AlertDialogTitle>
                                                {t("gallery.deleteMediaTitle")}
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                {t(
                                                  "gallery.deleteMediaDescription",
                                                  { title: item.title }
                                                )}
                                                {/* Are you sure you want to delete "
                                              {item.title}"? This action cannot
                                              be undone. */}
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>
                                                {t("gallery.cancel")}
                                              </AlertDialogCancel>
                                              <AlertDialogAction
                                                onClick={() =>
                                                  handleDeleteMedia(
                                                    item.key || item.id
                                                  )
                                                }
                                                className="bg-red-600 hover:bg-red-700"
                                                disabled={
                                                  deletingItemKey ===
                                                  (item.key || item.id)
                                                }
                                              >
                                                {deletingItemKey ===
                                                (item.key || item.id)
                                                  ? t("gallery.deleting")
                                                  : t("gallery.confirmDelete")}
                                              </AlertDialogAction>
                                            </AlertDialogFooter>
                                          </AlertDialogContent>
                                        </AlertDialog>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          )}

                          {/* Media Info */}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <p className="font-medium text-xs text-white truncate">
                              {item.title}
                            </p>
                          </div>
                        </div>
                      );
                    })}
              </div>
            </div>
            {/* Load More Button - Right Side */}
            {hasMore && (
              <div className="flex items-start pt-2 justify-center">
                <Button
                  onClick={handleLoadMore}
                  variant="outline"
                  className="px-6 whitespace-nowrap"
                >
                  {t("gallery.loadMore")}
                </Button>
              </div>
            )}
          </div>
        )}

        {selectedTab === "ai-generated" && (
          <div className="space-y-6">
            {/* AI Generation Section */}
            {showAIGeneration && (
              <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {t("gallery.aiSection.title")}
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Input
                    type="text"
                    placeholder={t("gallery.aiSection.promptPlaceholder")}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    maxLength={200}
                    className="w-full sm:flex-1 h-10 bg-background border-border"
                  />

                  <select
                    value={aiStyle}
                    onChange={(e) => setAiStyle(e.target.value)}
                    className="w-full sm:min-w-[120px] sm:w-auto h-10 px-3 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="" disabled>
                      {t("gallery.aiSection.selectStyle")}
                    </option>
                    <option value="realistic">
                      {t("gallery.aiSection.realistic")}
                    </option>
                    <option value="artistic">
                      {t("gallery.aiSection.artistic")}
                    </option>
                    <option value="cartoon">
                      {t("gallery.aiSection.cartoon")}
                    </option>
                    <option value="abstract">
                      {t("gallery.aiSection.abstract")}
                    </option>
                    <option value="minimalist">
                      {t("gallery.aiSection.minimalist")}
                    </option>
                    <option value="vintage">
                      {t("gallery.aiSection.vintage")}
                    </option>
                    <option value="modern">
                      {t("gallery.aiSection.modern")}
                    </option>
                  </select>

                  <select
                    value={aiVariants.toString()}
                    onChange={(e) => setAiVariants(parseInt(e.target.value))}
                    className="w-full sm:min-w-[140px] sm:w-auto h-10 px-3 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="" disabled>
                      {t("gallery.aiSection.numVariants")}
                    </option>
                    <option value="1">
                      {t("gallery.aiSection.variant", { count: 1 })}
                    </option>
                    <option value="2">
                      {t("gallery.aiSection.variants", { count: 2 })}
                    </option>
                    <option value="3">
                      {t("gallery.aiSection.variants", { count: 3 })}
                    </option>
                    <option value="4">
                      {t("gallery.aiSection.variants", { count: 4 })}
                    </option>
                  </select>

                  <Button
                    onClick={handleGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    className="w-full sm:w-auto h-10 px-6 bg-primary hover:bg-primary/90 whitespace-nowrap"
                  >
                    {isGenerating
                      ? t("gallery.aiSection.generating")
                      : t("gallery.aiSection.generate")}
                  </Button>
                </div>

                {generatedImages.length > 0 && (
                  <div className="space-y-4">
                    <AIImagePreview
                      images={generatedImages}
                      selectedIndex={selectedImageIndex}
                      prompt={aiPrompt}
                      style={aiStyle}
                      onPreviousImage={handlePreviousImage}
                      onNextImage={handleNextImage}
                      onSelectImage={handleSelectImageFromGenerated}
                      onSaveImage={handleSaveAIImage}
                      savingImageIndex={savingImageIndex}
                      onCloseModal={onCloseModal}
                    />
                  </div>
                )}
              </div>
            )}

            {/* AI Generated Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {isLoading
                ? // Skeleton loading
                  Array.from({
                    length: 16,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-lg border border-border bg-card"
                    >
                      <div className="aspect-square">
                        <Skeleton className="h-full w-full" />
                      </div>
                    </div>
                  ))
                : displayMedia.map((item) => {
                    const isExportItemSelected = isExportSelected(item.id);
                    return (
                      <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer ${
                          isExportMode && isExportItemSelected
                            ? "border-primary border-2 ring-2 ring-primary/20"
                            : "border-border"
                        }`}
                        onClick={
                          isExportMode
                            ? (e) => handleExportToggleSelection(item, e)
                            : showSelectButton
                            ? () => handleSelectMedia(item)
                            : undefined
                        }
                      >
                        {/* Export mode checkbox overlay */}
                        {isExportMode && (
                          <div className="absolute top-2 left-2 z-10">
                            <div
                              className={`w-6 h-6 rounded flex items-center justify-center transition-all shadow-lg border-2 border-primary ${
                                isExportItemSelected
                                  ? "bg-primary shadow-primary/50"
                                  : "bg-white/90 shadow-black/20"
                              }`}
                              onClick={(e) => handleExportToggleSelection(item, e)}
                            >
                              {isExportItemSelected && (
                                <CheckSquare className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        )}

                        <div className="aspect-square overflow-hidden">
                          {item.type === "video" ? (
                            <video
                              src={item.url}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                              preload="metadata"
                              muted
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt={item.title}
                              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            />
                          )}
                        </div>

                        {/* Action Buttons Overlay - Hidden in Modal View and Export Mode */}
                        {!showSelectButton && !isExportMode && (
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="flex items-center gap-2">
                            {/* Quick View */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleViewMedia(item)}
                                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                  title={t("gallery.quickView")}
                                >
                                  <Eye className="h-4 w-4 text-gray-700" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent
                                className="max-w-4xl"
                                aria-describedby="media-preview-description"
                              >
                                <div className="flex flex-col items-center space-y-4">
                                  {selectedMedia?.type === "video" ? (
                                    <video
                                      src={selectedMedia?.url}
                                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                      controls
                                      preload="metadata"
                                    />
                                  ) : (
                                    <img
                                      src={selectedMedia?.url}
                                      alt={selectedMedia?.title}
                                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                    />
                                  )}
                                  <div
                                    className="text-center"
                                    id="media-preview-description"
                                  >
                                    <h3 className="text-lg font-semibold">
                                      {selectedMedia?.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedMedia?.date}
                                    </p>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Actions Dropdown */}
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                  title={t("gallery.more")}
                                >
                                  <MoreVertical className="h-4 w-4 text-gray-700" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="w-48 bg-white border border-gray-200 shadow-lg z-50"
                                align="end"
                              >
                                <DropdownMenuItem
                                  onClick={() => {
                                    try {
                                      const link = document.createElement("a");
                                      link.href = item.url;
                                      link.download = `${
                                        item.title || "media"
                                      }.${
                                        item.type === "video" ? "mp4" : "jpg"
                                      }`;
                                      link.target = "_blank";
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    } catch (error) {
                                      // console.error("Download failed:", error);
                                      toast({
                                        title: t(
                                          "gallery.errTitle.downloadTitle"
                                        ),
                                        description: t(
                                          "gallery.messages.downloadFailed"
                                        ),
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Download className="h-4 w-4" />
                                  {item.type === "video"
                                    ? t("gallery.downloadVideo")
                                    : t("gallery.downloadImage")}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    triggerCreatePost({
                                      url: item.url,
                                      title: item.title,
                                      source: "gallery",
                                      type: item.type,
                                    });
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <FileImage className="h-4 w-4" />
                                  {t("gallery.useForPost")}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    triggerMediaUpload({
                                      url: item.url,
                                      title: item.title,
                                      source: "gallery",
                                      type: item.type,
                                    });
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Film className="h-4 w-4" />
                                  {t("gallery.useForMedia")}
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(
                                        item.url
                                      );
                                      toast({
                                        title: t("gallery.errTitle.url1"),
                                        description: t("gallery.messages.url1"),
                                        variant: "default",
                                      });
                                    } catch (error) {
                                      // console.error(
                                      //   "Failed to copy URL:",
                                      //   error
                                      // );
                                      toast({
                                        title: t("gallery.errTitle.falied"),
                                        description: t(
                                          "gallery.messages.unableCopy"
                                        ),
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Copy className="h-4 w-4" />
                                  {t("gallery.cpoyUrl")}
                                </DropdownMenuItem>

                                {showDeleteButton && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                          className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                          {t("gallery.delete")}
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            {t("gallery.deleteMediaTitle")}
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            {t(
                                              "gallery.deleteMediaDescription",
                                              { title: item.title }
                                            )}
                                            {/* Are you sure you want to delete "
                                            {item.title}"? This action cannot be
                                            undone. */}
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            {t("gallery.cancel")}
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                            onClick={() =>
                                              handleDeleteMedia(
                                                item.key || item.id
                                              )
                                            }
                                            className="bg-red-600 hover:bg-red-700"
                                            disabled={
                                              deletingItemKey ===
                                              (item.key || item.id)
                                            }
                                          >
                                            {deletingItemKey ===
                                            (item.key || item.id)
                                              ? t("gallery.deleting")
                                              : t("gallery.confirmDelete")}
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      )}

                      {/* Media Info */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <p className="font-medium text-xs text-white truncate">
                          {item.title}
                        </p>
                      </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && displayMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t("gallery.emptyState.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("gallery.emptyState.description")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
