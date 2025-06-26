
import React from 'react';
import { Button } from '../../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AIImagePreviewProps {
  images: string[];
  selectedIndex: number;
  prompt: string;
  style: string;
  onPreviousImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
}

export const AIImagePreview: React.FC<AIImagePreviewProps> = ({
  images,
  selectedIndex,
  prompt,
  style,
  onPreviousImage,
  onNextImage,
  onSelectImage
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Your AI-generated image{images.length > 1 ? 's' : ''}
        </h3>
        <p className="text-gray-600 text-sm">"{prompt}"</p>
        <p className="text-xs text-gray-500 mt-1">
          Style: {style.charAt(0).toUpperCase() + style.slice(1)} • Generated: {images.length} variant{images.length > 1 ? 's' : ''}
        </p>
        {images.length > 1 && (
          <p className="text-xs text-blue-600 mt-1">
            Viewing {selectedIndex + 1} of {images.length}
          </p>
        )}
      </div>

      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={images[selectedIndex]} 
          alt={prompt}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation arrows for multiple variants */}
        {images.length > 1 && (
          <>
            <Button
              onClick={onPreviousImage}
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full h-8 w-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              onClick={onNextImage}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full h-8 w-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Variant thumbnails for multiple images */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                selectedIndex === index 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img 
                src={imageUrl} 
                alt={`Variant ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
