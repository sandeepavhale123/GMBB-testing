
import React from 'react';
import { X, Play, Eye } from 'lucide-react';
import { Button } from '../ui/button';

interface MediaFile {
  id: string;
  file?: File;
  url: string;
  type: 'image' | 'video';
  title?: string;
  altText?: string;
  category?: string;
  location?: string;
  selectedImage: 'local' | 'ai' | 'gallery';
  aiImageUrl?: string;
  galleryImageUrl?: string;
}

interface MediaPreviewProps {
  file: MediaFile;
  onRemove: () => void;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({ file, onRemove }) => {
  const handlePreview = () => {
    window.open(file.url, '_blank');
  };

  const getFileName = () => {
    if (file.selectedImage === 'ai') {
      return file.title || 'AI Generated Image';
    }
    if (file.selectedImage === 'gallery') {
      return file.title || 'Gallery Image';
    }
    return file.title || file.file?.name || 'Unknown';
  };

  const getFileSize = () => {
    if (file.selectedImage === 'ai') {
      return 'AI Generated';
    }
    if (file.selectedImage === 'gallery') {
      return 'From Gallery';
    }
    return file.file ? `${(file.file.size / 1024 / 1024).toFixed(1)}MB` : 'Unknown size';
  };

  return (
    <div className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Media Content */}
      {file.type === 'image' ? (
        <img 
          src={file.url} 
          alt={file.title || getFileName()}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="relative w-full h-full bg-gray-900 flex items-center justify-center">
          <video 
            src={file.url}
            className="w-full h-full object-cover"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        </div>
      )}

      {/* Overlay with Actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
        {/* Remove Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="absolute top-2 right-2 h-7 w-7 p-0 bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Preview Button */}
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePreview}
          className="absolute top-2 left-2 h-7 w-7 p-0 bg-white bg-opacity-90 hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* File Info */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="text-white text-xs">
          <p className="font-medium truncate">{getFileName()}</p>
          <p className="text-gray-300">
            {file.type} • {getFileSize()}
          </p>
        </div>
      </div>
    </div>
  );
};
