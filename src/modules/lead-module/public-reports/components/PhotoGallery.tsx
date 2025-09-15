import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  alt: string;
  category?: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  totalCount: number;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, totalCount }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          GMB photo ({totalCount} photos)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="aspect-square relative overflow-hidden rounded-lg border">
              <img 
                src={photo.url} 
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
              {photo.category && (
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {photo.category}
                </div>
              )}
            </div>
          ))}
          {photos.length < totalCount && (
            <div className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center">
                <Camera className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                <span className="text-xs text-gray-500">
                  +{totalCount - photos.length} more
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};