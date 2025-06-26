
import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import { MoreVertical, Eye, Edit, Trash2, Download, Star, Play, FileImage } from 'lucide-react';

interface MediaCardProps {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size: string;
  uploadDate: string;
  status: 'Live' | 'Schedule' | 'Failed';
  views: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onSetAsCover: () => void;
}

const statusColors = {
  Live: 'bg-blue-100 text-blue-800',
  Schedule: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-red-100 text-red-800'
};

export const EnhancedMediaCard: React.FC<MediaCardProps> = ({
  id,
  name,
  url,
  type,
  size,
  uploadDate,
  status,
  views,
  onView,
  onEdit,
  onDelete,
  onDownload,
  onSetAsCover
}) => {
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleMenuItemClick = (action: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    action();
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-shadow">
      {/* Thumbnail */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden cursor-pointer" onClick={onView}>
        <img 
          src={url} 
          alt={name}
          className="w-full h-full object-cover transition-transform group-hover:scale-105"
        />
        
        {/* Video indicator */}
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
            <div className="bg-black bg-opacity-50 rounded-full p-2">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
          </div>
        )}

        {/* Views counter */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
          <Eye className="w-3 h-3" />
          {views}
        </div>

        {/* Status badge */}
        <div className="absolute top-2 right-2">
          <Badge className={`text-xs ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>

        {/* Action menu */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={handleDropdownClick}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost"ClassName="h-8 w-8 p-0 bg-white bg-opacity-90 hover:bg-white rounded-full">
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleMenuItemClick(onView)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMenuItemClick(onDownload)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleMenuItemClick(onDelete)} className="text-red-600">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Metadata */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          {type === 'image' ? (
            <FileImage className="w-4 h-4 text-gray-500" />
          ) : (
            <Play className="w-4 h-4 text-gray-500" />
          )}
          <h3 className="font-medium text-sm text-gray-900 truncate flex-1">{name}</h3>
        </div>
        
        <div className="text-xs text-gray-500 space-y-1">
          <div>Uploaded: {uploadDate}</div>
          <div>Size: {size}</div>
        </div>
      </div>
    </Card>
  );
};
