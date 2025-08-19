
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { useMediaContext } from '../../../context/MediaContext';

interface AIImagePreviewProps {
  images: string[];
  selectedIndex: number;
  prompt: string;
  style: string;
  onPreviousImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
  onSaveImage?: (imageUrl: string) => void;
  savingImageIndex?: number;
  onCloseModal?: () => void;
}

export const AIImagePreview: React.FC<AIImagePreviewProps> = ({
  images,
  selectedIndex,
  prompt,
  style,
  onPreviousImage,
  onNextImage,
  onSelectImage,
  onSaveImage,
  savingImageIndex,
  onCloseModal
}) => {
  const { triggerCreatePost } = useMediaContext();

  const handleUseImage = async (imageUrl: string) => {
    // First save to gallery if onSaveImage is provided
    if (onSaveImage) {
      await onSaveImage(imageUrl);
    }
    
    // Then trigger create post modal with the image
    triggerCreatePost({
      url: imageUrl,
      title: `AI Generated - ${prompt.slice(0, 30)}...`,
      source: 'ai',
      type: 'image'
    });

    // Close the gallery modal
    if (onCloseModal) {
      onCloseModal();
    }
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className="relative w-[200px] h-[200px] rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all group"
        >
          <img 
            src={imageUrl} 
            alt={`AI generated image ${index + 1}`}
            className="w-full h-full object-cover"
          />
          {onSaveImage && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                size="sm"
                onClick={() => handleUseImage(imageUrl)}
                disabled={savingImageIndex === index}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {savingImageIndex === index ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Use Image
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
