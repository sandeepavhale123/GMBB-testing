import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Eye, Trash2, MoreVertical, Play, Image as ImageIcon, Video, FileImage, Calendar } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { MediaUploadModal } from './MediaUploadModal';

interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
}

export const MediaPage: React.FC = () => {
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'Digital Marketing Banner',
      views: '12.4k views',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
      uploadDate: '2024-06-08'
    },
    {
      id: '2',
      name: 'Coffee Shop Interior',
      views: '8.2k views',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
      uploadDate: '2024-06-07'
    },
    {
      id: '3',
      name: 'Fresh Bakery Products',
      views: '6.1k views',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      uploadDate: '2024-06-06'
    },
    {
      id: '4',
      name: 'Restaurant Ambiance',
      views: '4.8k views',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300',
      uploadDate: '2024-06-05'
    },
    {
      id: '5',
      name: 'Team Meeting',
      views: '3.2k views',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300',
      uploadDate: '2024-06-04'
    },
    {
      id: '6',
      name: 'Product Showcase',
      views: '2.9k views',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
      uploadDate: '2024-06-03'
    },
    {
      id: '7',
      name: 'Office Space',
      views: '2.1k views',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
      uploadDate: '2024-06-02'
    },
    {
      id: '8',
      name: 'Modern Architecture',
      views: '1.8k views',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300',
      uploadDate: '2024-06-01'
    }
  ]);

  // Calculate media statistics
  const mediaStats = useMemo(() => {
    const totalImages = mediaItems.filter(item => item.type === 'image').length;
    const totalVideos = mediaItems.filter(item => item.type === 'video').length;
    const totalMedia = mediaItems.length;
    
    // Calculate last month uploads (items from last 30 days)
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);
    const lastMonthUploads = mediaItems.filter(item => {
      const itemDate = new Date(item.uploadDate);
      return itemDate >= lastMonth;
    }).length;

    return {
      totalImages,
      totalVideos,
      totalMedia,
      lastMonthUploads
    };
  }, [mediaItems]);

  const handleViewImage = (item: MediaItem) => {
    window.open(item.url, '_blank');
  };

  const handleDeleteImage = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Media Deleted",
      description: "Media has been deleted successfully."
    });
  };

  const handleMediaUpload = (newMedia: MediaItem[]) => {
    setMediaItems(prev => [...newMedia, ...prev]);
    toast({
      title: "Media Uploaded",
      description: `${newMedia.length} media file(s) uploaded successfully.`
    });
  };

  const mostViewedImage = mediaItems[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media</h1>
        <div className="flex items-center gap-4">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Redesigned Overview Stats Card with New Layout */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Section - Summary Cards (col-span-2) */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Images Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-500 rounded-lg">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-blue-900">Total Images</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{mediaStats.totalImages}</div>
                  </CardContent>
                </Card>

                {/* Total Videos Card */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-500 rounded-lg">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-purple-900">Total Videos</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-purple-900">{mediaStats.totalVideos}</div>
                  </CardContent>
                </Card>

                {/* Total Media Card */}
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-500 rounded-lg">
                          <FileImage className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-green-900">Total Media</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-900">{mediaStats.totalMedia}</div>
                  </CardContent>
                </Card>

                {/* Last Month Uploads Card */}
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-orange-500 rounded-lg">
                          <Calendar className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-orange-900">Last Month</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-orange-900">{mediaStats.lastMonthUploads}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Right Section - Most Viewed Card (col-span-1) */}
            <div className="lg:col-span-1">
              <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Most Viewed Media</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-square rounded-lg overflow-hidden">
                      <img src={mostViewedImage?.url} alt={mostViewedImage?.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-gray-900">12.4k views</div>
                      <div className="text-sm text-gray-500">{mostViewedImage?.name}</div>
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-gray-800 text-white hover:bg-gray-700 w-full mt-3" 
                        onClick={() => mostViewedImage && handleViewImage(mostViewedImage)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Media
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Media Tabs and Grid Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Media Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
            <Button variant="ghost" size="sm" className="bg-white shadow-sm rounded-md px-4 py-2 text-sm font-medium">
              All
            </Button>
            <Button variant="ghost" size="sm" className="px-4 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-md">
              By owner
            </Button>
            <Button variant="ghost" size="sm" className="px-4 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-md">
              Street View & 360°
            </Button>
            <Button variant="ghost" size="sm" className="px-4 py-2 text-sm text-gray-600 hover:bg-white hover:shadow-sm rounded-md">
              Videos
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-8 gap-2">
            {mediaItems.map(item => (
              <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" onClick={() => handleViewImage(item)} />
                
                {item.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      0:15
                    </div>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200">
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 bg-white bg-opacity-90 hover:bg-white rounded-full">
                          <MoreVertical className="w-4 h-4 text-gray-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewImage(item)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteImage(item.id)} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-5 h-5 border-2 border-white rounded bg-white bg-opacity-20 hover:bg-opacity-40 cursor-pointer"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <MediaUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleMediaUpload}
      />
    </div>
  );
};
