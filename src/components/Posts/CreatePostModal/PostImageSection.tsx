import React, { useCallback, useEffect } from "react";
import { Upload, Wand2, FolderOpen } from "lucide-react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../ui/dialog";
import { Gallery } from "../../Media/Gallery";
import { MediaUploadModal } from "../../Media/MediaUploadModal";
import { useMediaContext } from "../../../context/MediaContext";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";
interface PostImageSectionProps {
  image: File | string | null;
  onImageChange: (
    image: File | string | null,
    source?: "local" | "ai" | "gallery" | null
  ) => void;
  onOpenAIImage: () => void;
}
export const PostImageSection: React.FC<PostImageSectionProps> = ({
  image,
  onImageChange,
  onOpenAIImage,
}) => {
  const { t } = useI18nNamespace("Post/postImageSection");
  const [dragActive, setDragActive] = React.useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);
  const [isMediaUploadModalOpen, setIsMediaUploadModalOpen] =
    React.useState(false);
  const { shouldOpenMediaUpload, clearSelection } = useMediaContext();

  // Handle MediaContext trigger for opening MediaUploadModal
  useEffect(() => {
    if (shouldOpenMediaUpload) {
      setIsMediaUploadModalOpen(true);
    }
  }, [shouldOpenMediaUpload]);
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onImageChange(file, "local");
        }
      }
    },
    [onImageChange]
  );
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0], "local");
    }
  };

  // Helper function to determine if image is a File or URL
  const getImageDisplay = () => {
    if (!image) return null;
    if (typeof image === "string") {
      // It's a URL from AI generation, gallery, or existing post
      // Extract filename from URL for display
      const filename = image.split('/').pop() || "Post Image";
      return {
        isFile: false,
        url: image,
        name: filename,
        size: "Existing Image",
      };
    } else {
      // It's a File object
      return {
        isFile: true,
        url: URL.createObjectURL(image),
        name: image.name,
        size: `${(image.size / 1024 / 1024).toFixed(2)} MB`,
      };
    }
  };
  const imageDisplay = getImageDisplay();
  const handleGalleryImageSelect = (imageUrl: string) => {
    onImageChange(imageUrl, "gallery");
  };
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{t("postImage.label")}</Label>

      <div
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-blue-400 bg-blue-50"
            : image
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => setIsGalleryModalOpen(true)}
      >
        {imageDisplay ? (
          <div className="space-y-2">
            {/* Show actual image thumbnail */}
            <img 
              src={imageDisplay.url} 
              alt="Preview" 
              className="w-24 h-24 mx-auto object-cover rounded-lg border border-green-300"
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full hidden items-center justify-center">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-700">
              {imageDisplay.name}
            </p>
            <p className="text-xs text-gray-500">{imageDisplay.size}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onImageChange(null, null);
              }}
              className="text-xs"
            >
              {t("postImage.remove")}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-gray-400" />
            <div>
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  {t("postImage.clickToUpload")}
                </span>
                <span className="text-sm text-gray-600">
                  {" "}
                  {t("postImage.orDragAndDrop")}
                </span>
              </label>
            </div>
            <p className="text-xs text-gray-500">{t("postImage.fileNote")}</p>
          </div>
        )}
      </div>

      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <Gallery
              showHeader={true}
              showUpload={true}
              showDeleteButton={false}
              showSelectButton={true}
              onSelectImage={(imageUrl) => {
                handleGalleryImageSelect(imageUrl);
                setIsGalleryModalOpen(false);
              }}
              onCloseModal={() => setIsGalleryModalOpen(false)}
              className="h-full"
            />
          </div>
          <DialogFooter className="p-6 pt-4 hidden ">
            <Button
              variant="outline"
              onClick={() => setIsGalleryModalOpen(false)}
            >
              {t("postImage.modal.close")}
            </Button>
            <Button
              onClick={() => setIsGalleryModalOpen(false)}
              className="hidden "
            >
              {t("postImage.modal.apply")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <MediaUploadModal
        isOpen={isMediaUploadModalOpen}
        onClose={() => {
          setIsMediaUploadModalOpen(false);
          clearSelection();
        }}
        onUpload={() => {
          setIsMediaUploadModalOpen(false);
          clearSelection();
        }}
      />
    </div>
  );
};
