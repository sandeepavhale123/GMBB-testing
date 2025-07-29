
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((imageUrl, index) => (
        <div
          key={index}
          className="w-[200px] h-[200px] rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
        >
          <img 
            src={imageUrl} 
            alt={`AI generated image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};
