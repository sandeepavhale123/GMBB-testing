import React, { useCallback, useState, useEffect, Suspense } from "react";
import {
  Upload,
  FileImage,
  FileVideo,
  AlertCircle,
  Sparkles,
  FolderOpen,
} from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { MediaItem } from "./Gallery";
import { useMediaContext } from "@/context/MediaContext";
import { toast } from "@/hooks/use-toast";
import { useI18nNamespace } from "@/hooks/useI18nNamespace";

// ✅ Lazy load Gallery (HEAVY component)
import { lazyImport } from "@/utils/lazyImport";

const Gallery = lazyImport(() =>
  import("./Gallery").then((m) => ({ default: m.Gallery }))
);

interface MediaDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  onAIGenerate: () => void;
  enableMultiSelect?: boolean;
  maxSelectionLimit?: number;
}
export const MediaDropzone: React.FC<MediaDropzoneProps> = ({
  onFilesAdded,
  onAIGenerate,
  enableMultiSelect = true,
  maxSelectionLimit = 5,
}) => {
  const { t } = useI18nNamespace("Media/mediaDropzone");
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<MediaItem[]>([]);
  const { shouldOpenMediaUpload, triggerMultiMediaUpload } = useMediaContext();

  // Close gallery modal when media upload is triggered
  useEffect(() => {
    if (shouldOpenMediaUpload) {
      setIsGalleryModalOpen(false);
    }
  }, [shouldOpenMediaUpload]);
  const validateFile = (file: File): boolean => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "video/mp4",
      "video/quicktime",
    ];
    if (!allowedTypes.includes(file.type)) {
      setError(t("mediaDropzone.errors.invalidFile"));
      return false;
    }
    if (file.size > maxSize) {
      setError(t("mediaDropzone.errors.fileTooLarge"));
      return false;
    }
    setError(null);
    return true;
  };
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      // Only take the first file for single upload
      const firstFile = droppedFiles[0];
      if (firstFile && validateFile(firstFile)) {
        onFilesAdded([firstFile]);
      }
    },
    [onFilesAdded]
  );
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    // Only take the first file for single upload
    const firstFile = selectedFiles[0];
    if (firstFile && validateFile(firstFile)) {
      onFilesAdded([firstFile]);
    }

    // Reset input value to allow selecting the same file again
    e.target.value = "";
  };
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleToggleSelection = (item: MediaItem) => {
    setSelectedImages((prev) => {
      const isSelected = prev.some((img) => img.id === item.id);
      if (isSelected) {
        return prev.filter((img) => img.id !== item.id);
      } else {
        if (prev.length >= maxSelectionLimit) {
          toast({
            title: t("mediaDropzone.toast.title"),
            description:
              maxSelectionLimit > 1
                ? t("mediaDropzone.toast.description", { maxSelectionLimit })
                : t("mediaDropzone.toast.descriptions", { maxSelectionLimit }),
            //  `You can only select up to ${maxSelectionLimit} image${
            //     maxSelectionLimit > 1 ? "s" : ""
            //   }.`,
            variant: "destructive",
          });
          return prev;
        }
        return [...prev, item];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedImages([]);
  };

  const handleUseSelected = () => {
    if (selectedImages.length === 0) return;

    const mediaItems = selectedImages.map((img) => ({
      url: img.url,
      title: img.title,
      source: "gallery" as const,
      type: img.type,
      id: img.id,
    }));

    triggerMultiMediaUpload(mediaItems);
    setIsGalleryModalOpen(false);
    setSelectedImages([]);
  };
  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => setIsGalleryModalOpen(true)}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? "border-blue-400 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }
        `}
      >
        {/* AI Generate Button - Top Right */}
        <div className="absolute top-4 right-4 z-20">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onAIGenerate();
            }}
            variant="outline"
            size="sm"
            className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hidden"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            {t("mediaDropzone.generateWithGenie")}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center mt-10 sm:mt-0">
            <div
              className={`
              p-4 rounded-full transition-colors duration-200
              ${isDragging ? "bg-blue-100" : "bg-gray-100"}
            `}
            >
              <Upload
                className={`
                w-8 h-8 transition-colors duration-200
                ${isDragging ? "text-blue-600" : "text-gray-600"}
              `}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragging
                ? t("mediaDropzone.dropFileHere")
                : t("mediaDropzone.dragDropFile")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("mediaDropzone.or")}{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGalleryModalOpen(true);
                }}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer underline"
              >
                {t("mediaDropzone.chooseFromGallery")}
              </button>
            </p>
            <p className="text-sm text-gray-500">
              {t("mediaDropzone.uploadOneFile")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              <span>{t("mediaDropzone.fileTypes.images")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4" />
              <span>{t("mediaDropzone.fileTypes.videos")}</span>
            </div>
            <span>{t("mediaDropzone.fileTypes.maxSize")}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Gallery Modal */}
      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] p-0 flex flex-col overflow-hidden">
          <Suspense
            fallback={
              <div className="flex items-center justify-center w-full h-full text-gray-500">
                Loading gallery...
              </div>
            }
          >
            <div className="flex-1 overflow-auto p-6">
              <Gallery
                showHeader={true}
                showUpload={true}
                showDeleteButton={false}
                showSelectButton={true}
                enableMultiSelect={enableMultiSelect}
                maxSelectionLimit={maxSelectionLimit}
                selectedImages={selectedImages}
                onToggleSelection={handleToggleSelection}
                onClearSelection={handleClearSelection}
                onUseSelected={handleUseSelected}
                onCloseModal={() => setIsGalleryModalOpen(false)}
                className="h-full"
              />
            </div>
          </Suspense>

          <DialogFooter className="p-6 pt-4 border-t flex-row justify-between items-center">
            <div className="flex items-center gap-3">
              {selectedImages.length > 0 && (
                <>
                  <span className="text-sm font-medium text-primary">
                    {selectedImages.length}/{maxSelectionLimit}{" "}
                    {t("mediaDropzone.select")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearSelection}
                  >
                    {t("mediaDropzone.clear")}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleUseSelected}
                  >
                    {t("mediaDropzone.use")}
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsGalleryModalOpen(false);
                setSelectedImages([]);
              }}
            >
              {t("mediaDropzone.close")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
