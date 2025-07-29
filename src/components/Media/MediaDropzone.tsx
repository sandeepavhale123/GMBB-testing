
import React, { useCallback, useState } from "react";
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
import { Gallery } from "./Gallery";

interface MediaDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  onAIGenerate: () => void;
}

export const MediaDropzone: React.FC<MediaDropzoneProps> = ({
  onFilesAdded,
  onAIGenerate,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

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
      setError("Only JPG, PNG, WebP, and MP4 files are allowed");
      return false;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 10MB");
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

  const handleGalleryImageSelect = (imageUrl: string) => {
    // Convert URL to File object (this is a simplified approach)
    // In a real implementation, you might want to fetch the image and create a proper File object
    console.log("Selected image from gallery:", imageUrl);
    setIsGalleryModalOpen(false);
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
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
            onClick={onAIGenerate}
            variant="outline"
            size="sm"
            className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Generate with Genie
          </Button>
        </div>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="media-upload"
        />

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
                ? "Drop your file here"
                : "Drag & drop your media file"}
            </h3>
            <p className="text-gray-600 mb-4">
              or{" "}
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(true)}
                className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer underline"
              >
                choose from gallery
              </button>
            </p>
            <p className="text-sm text-gray-500">Upload one file at a time</p>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <FileImage className="w-4 h-4" />
              <span>JPG, PNG, WebP</span>
            </div>
            <div className="flex items-center gap-2">
              <FileVideo className="w-4 h-4" />
              <span>MP4, MOV</span>
            </div>
            <span>• Max 10MB</span>
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
          <div className="flex-1 overflow-auto p-6">
            <Gallery
              showHeader={true}
              showUpload={true}
              showDeleteButton={false}
              showSelectButton={true}
              onSelectImage={(imageUrl) => {
                handleGalleryImageSelect(imageUrl);
              }}
              className="h-full"
            />
          </div>
          <DialogFooter className="p-6 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsGalleryModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
