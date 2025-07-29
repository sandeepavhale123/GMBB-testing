
import React, { useCallback } from 'react';
import { Upload, Wand2, FolderOpen } from 'lucide-react';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Gallery } from '../../Media/Gallery';

interface PostImageSectionProps {
  image: File | string | null;
  onImageChange: (image: File | string | null) => void;
  onOpenAIImage: () => void;
}

export const PostImageSection: React.FC<PostImageSectionProps> = ({
  image,
  onImageChange,
  onOpenAIImage
}) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = React.useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onImageChange(file);
      }
    }
  }, [onImageChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageChange(e.target.files[0]);
    }
  };

  // Helper function to determine if image is a File or URL
  const getImageDisplay = () => {
    if (!image) return null;
    
    if (typeof image === 'string') {
      // It's a URL from AI generation
      return {
        isFile: false,
        url: image,
        name: 'AI Generated Image',
        size: 'Generated'
      };
    } else {
      // It's a File object
      return {
        isFile: true,
        url: URL.createObjectURL(image),
        name: image.name,
        size: `${(image.size / 1024 / 1024).toFixed(2)} MB`
      };
    }
  };

  const imageDisplay = getImageDisplay();

  const handleGalleryImageSelect = (imageUrl: string) => {
    onImageChange(imageUrl);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Label className="text-sm font-medium">Post Image</Label>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => setIsGalleryModalOpen(true)}
            className="text-xs bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 flex-1 sm:flex-none"
          >
            <FolderOpen className="w-3 h-3 mr-1" />
            Load from Gallery
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onOpenAIImage} 
            className="text-xs bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 flex-1 sm:flex-none"
          >
            <Wand2 className="w-3 h-3 mr-1" />
            Use GMB Genie to Generate
          </Button>
        </div>
      </div>

      <div 
        className={`border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : image 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          id="image-upload" 
        />
        {imageDisplay ? (
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium text-green-700">{imageDisplay.name}</p>
            <p className="text-xs text-gray-500">{imageDisplay.size}</p>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => onImageChange(null)} 
              className="text-xs"
            >
              Remove
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-6 sm:w-8 h-6 sm:h-8 mx-auto text-gray-400" />
            <div>
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Click to upload
                </span>
                <span className="text-sm text-gray-600"> or drag and drop</span>
              </label>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>

      <Dialog open={isGalleryModalOpen} onOpenChange={setIsGalleryModalOpen}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[90vh] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Select Image from Gallery</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-6 pt-0">
            <Gallery
              showHeader={true}
              showUpload={true}
              showDeleteButton={false}
              showSelectButton={true}
              onSelectImage={(imageUrl) => {
                handleGalleryImageSelect(imageUrl);
                setIsGalleryModalOpen(false);
              }}
              className="h-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
