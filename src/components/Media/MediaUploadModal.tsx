import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { MediaDropzone } from "./MediaDropzone";
import { MediaPreview } from "./MediaPreview";
import { MediaForm } from "./MediaForm";
import { AIMediaGenerationModal } from "./AIMediaGenerationModal";
import { useListingContext } from "../../context/ListingContext";
import { useMediaContext } from "../../context/MediaContext";
import { uploadMedia } from "../../api/mediaApi";
import { useToast } from "../../hooks/use-toast";

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
}
export const MediaUploadModal: React.FC<MediaUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<MediaFile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    publishOption: "now",
    scheduleDate: "",
  });
  const { selectedListing } = useListingContext();
  const { selectedMedia } = useMediaContext();
  const { toast } = useToast();

  // Helper function to detect media type from URL
  const getMediaTypeFromUrl = (url: string): 'image' | 'video' => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
    return videoExtensions.includes(extension) ? 'video' : 'image';
  };

  // Effect to auto-populate with selected media from context
  React.useEffect(() => {
    if (selectedMedia && isOpen) {
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: selectedMedia.url,
        type: getMediaTypeFromUrl(selectedMedia.url),
        title: selectedMedia.title,
        selectedImage: selectedMedia.source,
        aiImageUrl: selectedMedia.source === 'ai' ? selectedMedia.url : undefined,
        galleryImageUrl: selectedMedia.source === 'gallery' ? selectedMedia.url : undefined,
      };
      setFile(mediaFile);
      setFormData(prev => ({
        ...prev,
        title: selectedMedia.title,
      }));
    }
  }, [selectedMedia, isOpen]);
  const handleFilesAdded = (newFiles: File[]) => {
    // Only take the first file to enforce single upload
    const firstFile = newFiles[0];
    if (firstFile) {
      // console.log('File added:', firstFile.name, firstFile.size, 'bytes', firstFile.type);
      const mediaFile: MediaFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file: firstFile,
        url: URL.createObjectURL(firstFile),
        type: firstFile.type.startsWith("image/") ? "image" : "video",
        selectedImage: "local",
      };
      setFile(mediaFile);
      setUploadComplete(false);
    }
  };
  const handleFileRemove = () => {
    setFile(null);
    setUploadComplete(false);
  };
  const handleFormDataChange = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
    }));
  };
  const handleUpload = async () => {
    if (!file || !selectedListing) {
      toast({
        title: "Upload Error",
        description:
          "Please select a file and ensure a business listing is selected.",
        variant: "destructive",
      });
      return;
    }
    // console.log("Starting upload process...");
    // console.log("File details:", {
    //   selectedImage: file.selectedImage,
    //   url: file.url,
    //   aiImageUrl: file.aiImageUrl,
    //   file: file.file
    //     ? {
    //         name: file.file.name,
    //         size: file.file.size,
    //         type: file.file.type,
    //       }
    //     : null,
    // });
    setIsUploading(true);
    try {
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
      };
      // console.log("Upload data prepared:", {
      //   fileName: uploadData.file?.name,
      //   title: uploadData.title,
      //   category: uploadData.category,
      //   publishOption: uploadData.publishOption,
      //   listingId: uploadData.listingId,
      //   selectedImage: uploadData.selectedImage,
      //   aiImageUrl: uploadData.aiImageUrl,
      // });
      const response = await uploadMedia(uploadData);
      // console.log("Upload response:", response);
      if (response.code === 200) {
        // Create media item for local state update
        const mediaItem: MediaItem = {
          id: file.id,
          name: uploadData.title,
          views: "0 views",
          type: file.type,
          url: file.url,
          uploadDate: new Date().toISOString().split("T")[0],
        };
        onUpload([mediaItem]);
        setUploadComplete(true);
        toast({
          title: "Upload Successful",
          description: response.message,
        });

        // Close modal after showing success briefly
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description:
          error instanceof Error
            ? (error as any)?.response?.data?.message || error.message
            : "Failed to upload media. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleClose = () => {
    setFile(null);
    setUploadComplete(false);
    setFormData({
      title: "",
      category: "",
      publishOption: "now",
      scheduleDate: "",
    });
    onClose();
  };
  const handleAIGenerated = (generatedMedia: {
    imageUrl: string;
    prompt: string;
    variants: number;
    style: string;
  }) => {
    // console.log("AI generated media received:", {
    //   imageUrl: generatedMedia.imageUrl,
    //   prompt: generatedMedia.prompt,
    //   style: generatedMedia.style,
    //   variants: generatedMedia.variants,
    // });

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
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
            <DialogHeader className="p-6 pb-4">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  Upload Media{" "}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            {/* Upload Complete State */}
            {uploadComplete && file && (
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
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Complete!
                </h3>
                <p className="text-gray-600">
                  Your{" "}
                  <span className="font-medium text-primary">{file.type}</span>{" "}
                  has been uploaded successfully.
                </p>
              </div>
            )}

            {/* Upload Interface */}
            {!uploadComplete && (
              <>
                {/* Dropzone Area - Only show if no file selected */}
                {!file && (
                  <MediaDropzone
                    onFilesAdded={handleFilesAdded}
                    onAIGenerate={() => setShowAIModal(true)}
                  />
                )}

                {/* File Preview */}
                {file && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Media Preview
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Type:</span>
                        <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                          {file.selectedImage === "ai"
                            ? "AI IMAGE"
                            : file.selectedImage === "gallery"
                            ? "GALLERY IMAGE"
                            : file.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="max-w-xs mx-auto">
                      <MediaPreview file={file} onRemove={handleFileRemove} />
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <MediaForm
                  formData={formData}
                  onChange={handleFormDataChange}
                  hasFiles={!!file}
                  fileType={file?.type}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleClose}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading || !selectedListing}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
                  >
                    {isUploading ? "Uploading..." : "Upload Media"}
                  </Button>
                </div>
              </>
            )}
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
