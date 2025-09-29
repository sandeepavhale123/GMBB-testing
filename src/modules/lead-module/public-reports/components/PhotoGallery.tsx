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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {photos.slice(0, 4).map((photo) => (
            <div key={photo.id} className="aspect-square relative overflow-hidden rounded-lg border">
              <img 
                src={photo.url} 
                alt={photo.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
          {totalCount > 4 && (
            <div className="aspect-square flex items-center justify-center bg-muted rounded-lg border">
              <div className="text-center">
                <Camera className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
                <span className="text-sm font-medium text-muted-foreground">
                  +{totalCount - 4} more images
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};