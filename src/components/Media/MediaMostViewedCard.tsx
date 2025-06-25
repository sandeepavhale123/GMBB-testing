
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
  size: string;
  status: 'uploaded' | 'scheduled' | 'approved';
  category: string;
}

interface MediaMostViewedCardProps {
  mostViewedImage: MediaItem | undefined;
  onViewImage: (item: MediaItem) => void;
}

export const MediaMostViewedCard: React.FC<MediaMostViewedCardProps> = ({
  mostViewedImage,
  onViewImage
}) => {
  if (!mostViewedImage) return null;

  return (
    <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Most view Image</h3>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <div className="mb-4">
              <div className="text-3xl font-bold text-gray-900 mb-1">{mostViewedImage.views} views</div>
              <div className="text-sm text-gray-500">{mostViewedImage.name}</div>
            </div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-gray-800 text-white hover:bg-gray-700 px-6" 
              onClick={() => onViewImage(mostViewedImage)}
            >
              View Image
            </Button>
          </div>
          
          <div className="col-span-5">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src={mostViewedImage.url} 
                alt={mostViewedImage.name} 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
