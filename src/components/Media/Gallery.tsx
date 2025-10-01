import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Checkbox } from "@/components/ui/checkbox";
import { useMediaContext } from "../../context/MediaContext";
import { useNavigate } from "react-router-dom";
import { useGalleryImagesQuery } from "@/hooks/useGalleryImagesQuery";
import {
  useUploadGalleryMediaMutation,
  useDeleteGalleryMediaMutation,
  useSaveAIImageMutation,
} from "@/hooks/useGalleryMutations";
import { GalleryImageItem } from "@/api/mediaApi";
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

// Sample media data
const sampleMediaData: MediaItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    type: "image",
    title: "Wooden Bowl",
    category: "local",
    date: "2024-01-15",
    width: 400,
    height: 400,
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    type: "image",
    title: "Modern Frame",
    category: "local",
    date: "2024-01-14",
    width: 400,
    height: 300,
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=500&fit=crop",
    type: "image",
    title: "City Skyline",
    category: "ai-generated",
    date: "2024-01-13",
    width: 400,
    height: 500,
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    type: "image",
    title: "Portrait",
    category: "ai-generated",
    date: "2024-01-12",
    width: 400,
    height: 400,
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    type: "image",
    title: "Mountain Lake",
    category: "local",
    date: "2024-01-11",
    width: 400,
    height: 300,
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=500&fit=crop",
    type: "image",
    title: "Forest Deer",
    category: "local",
    date: "2024-01-10",
    width: 400,
    height: 500,
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop",
    type: "image",
    title: "Modern Architecture",
    category: "ai-generated",
    date: "2024-01-09",
    width: 400,
    height: 400,
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop",
    type: "image",
    title: "Building Facade",
    category: "local",
    date: "2024-01-08",
    width: 400,
    height: 300,
  },
  {
    id: "9",
    url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
    type: "image",
    title: "Travel Book",
    category: "ai-generated",
    date: "2024-01-07",
    width: 400,
    height: 400,
  },
  {
    id: "10",
    url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop",
    type: "image",
    title: "Fashion Model",
    category: "local",
    date: "2024-01-06",
    width: 400,
    height: 500,
  },
  {
    id: "11",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop",
    type: "image",
    title: "Coffee Art",
    category: "local",
    date: "2024-01-05",
    width: 400,
    height: 400,
  },
  {
    id: "12",
    url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    type: "image",
    title: "Basketball",
    category: "ai-generated",
    date: "2024-01-04",
    width: 400,
    height: 300,
  },
  {
    id: "13",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop",
    type: "image",
    title: "Laptop Setup",
    category: "local",
    date: "2024-01-03",
    width: 400,
    height: 400,
  },
  {
    id: "14",
    url: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop",
    type: "image",
    title: "Office Space",
    category: "ai-generated",
    date: "2024-01-02",
    width: 400,
    height: 300,
  },
  {
    id: "15",
    url: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=500&fit=crop",
    type: "image",
    title: "Business Meeting",
    category: "local",
    date: "2024-01-01",
    width: 400,
    height: 500,
  },
  {
    id: "16",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop",
    type: "image",
    title: "Team Work",
    category: "ai-generated",
    date: "2023-12-31",
    width: 400,
    height: 400,
  },
  {
    id: "17",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
    type: "image",
    title: "Analytics",
    category: "local",
    date: "2023-12-30",
    width: 400,
    height: 300,
  },
  {
    id: "18",
    url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=400&fit=crop",
    type: "image",
    title: "Food Photography",
    category: "ai-generated",
    date: "2023-12-29",
    width: 400,
    height: 400,
  },
  {
    id: "19",
    url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=500&fit=crop",
    type: "image",
    title: "Abstract Art",
    category: "local",
    date: "2023-12-28",
    width: 400,
    height: 500,
  },
  {
    id: "20",
    url: "https://images.unsplash.com/photo-1464822759844-d150baec0151?w=400&h=400&fit=crop",
    type: "image",
    title: "Workout",
    category: "ai-generated",
    date: "2023-12-27",
    width: 400,
    height: 400,
  },
  {
    id: "21",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
    type: "image",
    title: "Healthy Food",
    category: "local",
    date: "2023-12-26",
    width: 400,
    height: 300,
  },
  {
    id: "22",
    url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop",
    type: "image",
    title: "Programming",
    category: "ai-generated",
    date: "2023-12-25",
    width: 400,
    height: 400,
  },
  {
    id: "23",
    url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=500&fit=crop",
    type: "image",
    title: "Web Development",
    category: "local",
    date: "2023-12-24",
    width: 400,
    height: 500,
  },
  {
    id: "24",
    url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    type: "image",
    title: "Creative Design",
    category: "ai-generated",
    date: "2023-12-23",
    width: 400,
    height: 400,
  },
  {
    id: "25",
    url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop",
    type: "image",
    title: "Music Studio",
    category: "local",
    date: "2023-12-22",
    width: 400,
    height: 300,
  },
  {
    id: "26",
    url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    type: "image",
    title: "Audio Equipment",
    category: "ai-generated",
    date: "2023-12-21",
    width: 400,
    height: 400,
  },
  {
    id: "27",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop",
    type: "image",
    title: "Headphones",
    category: "local",
    date: "2023-12-20",
    width: 400,
    height: 500,
  },
  {
    id: "28",
    url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop",
    type: "image",
    title: "Digital Art",
    category: "ai-generated",
    date: "2023-12-19",
    width: 400,
    height: 400,
  },
  {
    id: "29",
    url: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
    type: "image",
    title: "Smartphone",
    category: "local",
    date: "2023-12-18",
    width: 400,
    height: 300,
  },
  {
    id: "30",
    url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop",
    type: "image",
    title: "Tech Gadgets",
    category: "ai-generated",
    date: "2023-12-17",
    width: 400,
    height: 400,
  },
];
interface GalleryProps {
  showTabs?: boolean;
  showHeader?: boolean;
  showUpload?: boolean;
  showAIGeneration?: boolean;
  showDeleteButton?: boolean;
  showSelectButton?: boolean;
  enableMultiSelect?: boolean;
  maxSelectionLimit?: number;
  onSelectImage?: (imageUrl: string) => void;
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
  onSelectImage,
  onCloseModal,
  className = "",
}) => {
  const { triggerCreatePost, triggerMediaUpload, triggerMultiMediaUpload } = useMediaContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState<"local" | "ai-generated">(
    "local"
  );
  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  
  // Multi-select state
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedImages, setSelectedImages] = useState<MediaItem[]>([]);

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
      console.log("VIDEO tab selected");
      console.log("Raw images data:", images);
      console.log("Transformed mediaData:", mediaData);
      console.log(
        "Video items:",
        mediaData.filter((item) => item.type === "video")
      );
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
    const maxSize = 10 * 1024 * 1024; // 10MB
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
    console.log("we are inside validate file and file size is", file.size);
    console.log("we are inside validate file and max size is", maxSize);

    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description:
          "Only JPG, PNG, WebP, GIF, MP4, MOV, and AVI files are allowed.",
        variant: "error",
      });
      return false;
    }

    if (file.size > maxSize) {
      console.log("inside test size");
      toast({
        title: "File Too Large",
        description: `File size must be less than 10MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB.`,
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
        title: "Upload Successful",
        description: `Successfully uploaded ${validFiles.length} file(s).`,
        variant: "success",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          "An error occurred while uploading your files. Please try again.",
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
      console.error("Error deleting media:", error);
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
  const handleToggleSelection = (item: MediaItem) => {
    const isSelected = selectedImages.some(img => img.id === item.id);
    
    if (isSelected) {
      setSelectedImages(selectedImages.filter(img => img.id !== item.id));
    } else {
      if (selectedImages.length >= maxSelectionLimit) {
        toast({
          title: "Selection Limit Reached",
          description: `You can only select up to ${maxSelectionLimit} images.`,
          variant: "destructive",
        });
        return;
      }
      setSelectedImages([...selectedImages, item]);
    }
  };

  const handleClearAllSelections = () => {
    setSelectedImages([]);
  };

  const handleUseSelected = () => {
    if (selectedImages.length === 0) return;
    
    const mediaItems = selectedImages.map(item => ({
      url: item.url,
      title: item.title,
      source: "gallery" as const,
      type: item.type,
    }));
    
    triggerMultiMediaUpload(mediaItems);
    setSelectedImages([]);
    setIsMultiSelectMode(false);
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
          title: "Images Generated",
          description: `Successfully generated ${imageUrls.length} image(s).`,
        });
      }
    } catch (error) {
      console.error("AI generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate images. Please try again.",
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
      console.error("Save AI image error:", error);
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
            <h1 className="font-bold text-foreground text-2xl">Gallery</h1>
          </div>
          <div className="flex align-center gap-4">
            <Badge
              variant="secondary"
              className="text-mg bg-primary text-white hidden rounded-[5px] hover:bg-primary hover:text-white"
            >
              1.5 GB / 790 MB Available
            </Badge>
            {showTabs && (
              <Tabs
                value={selectedTab}
                onValueChange={(value) =>
                  setSelectedTab(value as "local" | "ai-generated")
                }
                className="w-fit"
              >
                <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
                  <TabsTrigger
                    value="local"
                    className="data-[state=active]:bg-background"
                  >
                    Uploaded
                  </TabsTrigger>
                  <TabsTrigger
                    value="ai-generated"
                    className="data-[state=active]:bg-background"
                  >
                    AI Generated
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
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
                Uploaded Images
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search media"
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
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Newest First</SelectItem>
                    <SelectItem value="asc">Oldest First</SelectItem>
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
                      {isUploading ? "Uploading..." : "Upload Media"}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Media Filter Tabs */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={mediaType === "IMAGE" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setMediaType("IMAGE")}
                >
                  Images
                </Button>
                <Button
                  variant={mediaType === "VIDEO" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8"
                  onClick={() => setMediaType("VIDEO")}
                >
                  Videos
                </Button>
                {enableMultiSelect && !showSelectButton && (
                  <Button
                    variant={isMultiSelectMode ? "default" : "outline"}
                    size="sm"
                    className="h-8 ml-2"
                    onClick={() => {
                      setIsMultiSelectMode(!isMultiSelectMode);
                      setSelectedImages([]);
                    }}
                  >
                    {isMultiSelectMode ? "Exit Multi-Select" : "Select Multiple"}
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{total} items</div>
            </div>

            {/* Multi-Select Actions Bar */}
            {isMultiSelectMode && selectedImages.length > 0 && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {selectedImages.length}/{maxSelectionLimit} images selected
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleClearAllSelections}
                  >
                    Clear All
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleUseSelected}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Use Selected ({selectedImages.length})
                  </Button>
                </div>
              </div>
            )}

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
                      const isSelected = selectedImages.some(img => img.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className={`group relative overflow-hidden rounded-lg border ${
                            isSelected 
                              ? 'border-primary border-2 ring-2 ring-primary/20' 
                              : 'border-border'
                          } bg-card hover:shadow-lg transition-all duration-200 cursor-pointer`}
                        >
                          {/* Multi-Select Checkbox */}
                          {isMultiSelectMode && (
                            <div 
                              className="absolute top-2 left-2 z-10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleSelection(item);
                              }}
                            >
                              <Checkbox 
                                checked={isSelected}
                                onCheckedChange={() => handleToggleSelection(item)}
                                disabled={selectedImages.length >= maxSelectionLimit && !isSelected}
                                className="h-5 w-5 bg-white/90 border-2"
                              />
                            </div>
                          )}

                          <div className="aspect-square overflow-hidden">
                            {item.type === "video" ? (
                              <video
                                src={item.url}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onClick={
                                  showSelectButton
                                    ? () => handleSelectMedia(item)
                                    : isMultiSelectMode
                                    ? () => handleToggleSelection(item)
                                    : undefined
                                }
                                preload="metadata"
                                muted
                              />
                            ) : (
                              <img
                                src={item.url}
                                alt={item.title}
                                className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                onClick={
                                  showSelectButton
                                    ? () => handleSelectMedia(item)
                                    : isMultiSelectMode
                                    ? () => handleToggleSelection(item)
                                    : undefined
                                }
                              />
                            )}
                          </div>

                          {/* Action Buttons Overlay - Hidden in Modal View and Multi-Select Mode */}
                          {!showSelectButton && !isMultiSelectMode && (
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
                                    title="Quick View"
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
                                    title="More Actions"
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
                                          item.type === "video" ? "mp4" : "jpg"
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
                                          title: "Download Failed",
                                          description:
                                            "Unable to download the media. Please try again.",
                                          variant: "destructive",
                                        });
                                      }
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <Download className="h-4 w-4" />
                                    Download{" "}
                                    {item.type === "video" ? "Video" : "Image"}
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
                                      Use for Post
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
                                    Use for Media
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={async () => {
                                      try {
                                        await navigator.clipboard.writeText(item.url);
                                        toast.success({
                                          title: "URL copied",
                                          description: "Image URL copied to clipboard"
                                        });
                                      } catch (error) {
                                        toast.error({
                                          title: "Copy failed",
                                          description: "Failed to copy URL to clipboard"
                                        });
                                      }
                                    }}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  >
                                    <Copy className="h-4 w-4" />
                                    Copy Image URL
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
                                            Delete
                                          </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>
                                              Delete Media
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete "
                                              {item.title}"? This action cannot
                                              be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>
                                              Cancel
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
                                                ? "Deleting..."
                                                : "Delete"}
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
                  Load More
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
                  Generate AI Images
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Input
                    type="text"
                    placeholder="Describe the image you want to generate..."
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
                      Select Style
                    </option>
                    <option value="realistic">Realistic</option>
                    <option value="artistic">Artistic</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="abstract">Abstract</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="vintage">Vintage</option>
                    <option value="modern">Modern</option>
                  </select>

                  <select
                    value={aiVariants.toString()}
                    onChange={(e) => setAiVariants(parseInt(e.target.value))}
                    className="w-full sm:min-w-[140px] sm:w-auto h-10 px-3 bg-background border border-border rounded-md text-sm"
                  >
                    <option value="" disabled>
                      No. of Variants
                    </option>
                    <option value="1">1 variant</option>
                    <option value="2">2 variants</option>
                    <option value="3">3 variants</option>
                    <option value="4">4 variants</option>
                  </select>

                  <Button
                    onClick={handleGenerate}
                    disabled={!aiPrompt.trim() || isGenerating}
                    className="w-full sm:w-auto h-10 px-6 bg-primary hover:bg-primary/90 whitespace-nowrap"
                  >
                    {isGenerating ? "Generating..." : "Generate"}
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
                : displayMedia.map((item) => (
                    <div
                      key={item.id}
                      className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer"
                    >
                      <div className="aspect-square overflow-hidden">
                        {item.type === "video" ? (
                          <video
                            src={item.url}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            onClick={
                              showSelectButton
                                ? () => handleSelectMedia(item)
                                : undefined
                            }
                            preload="metadata"
                            muted
                          />
                        ) : (
                          <img
                            src={item.url}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                            onClick={
                              showSelectButton
                                ? () => handleSelectMedia(item)
                                : undefined
                            }
                          />
                        )}
                      </div>

                      {/* Action Buttons Overlay - Hidden in Modal View */}
                      {!showSelectButton && (
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
                                  title="Quick View"
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
                                  title="More Actions"
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
                                      console.error("Download failed:", error);
                                      toast({
                                        title: "Download Failed",
                                        description:
                                          "Unable to download the media. Please try again.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Download className="h-4 w-4" />
                                  Download{" "}
                                  {item.type === "video" ? "Video" : "Image"}
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
                                  Use for Post
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
                                  Use for Media
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={async () => {
                                    try {
                                      await navigator.clipboard.writeText(item.url);
                                      toast({
                                        title: "URL Copied!",
                                        description: "Image URL has been copied to clipboard.",
                                        variant: "default",
                                      });
                                    } catch (error) {
                                      console.error("Failed to copy URL:", error);
                                      toast({
                                        title: "Copy Failed",
                                        description: "Unable to copy URL to clipboard.",
                                        variant: "destructive",
                                      });
                                    }
                                  }}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  <Copy className="h-4 w-4" />
                                  Copy Image URL
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
                                          Delete
                                        </DropdownMenuItem>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Delete Media
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Are you sure you want to delete "
                                            {item.title}"? This action cannot be
                                            undone.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
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
                                              ? "Deleting..."
                                              : "Delete"}
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
                  ))}
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
              No media found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or generate new AI images.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
