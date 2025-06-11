
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Eye, Trash2, ArrowUpRight } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

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
      type: 'image',
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
    }
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const fileUrl = URL.createObjectURL(file);
      const viewCount = Math.floor(Math.random() * 1000) + 100;
      
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        views: `${viewCount} views`,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: fileUrl,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      
      setMediaItems(prev => [newMediaItem, ...prev]);
      toast({
        title: "Media Uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    }
  };

  const handleViewImage = (item: MediaItem) => {
    window.open(item.url, '_blank');
  };

  const handleDeleteImage = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Media Deleted",
      description: "Image has been deleted successfully."
    });
  };

  const mostViewedImage = mediaItems[0];
  const recentMediaItems = mediaItems.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media</h1>
      </div>

      {/* First Row - Most Viewed Image and Total Media Uploaded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Most Viewed Image Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Most Viewed Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 h-48">
              {/* Left Column - Image Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{mostViewedImage?.name}</h3>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{mostViewedImage?.views}</div>
                  <div className="text-sm text-gray-500">Uploaded {mostViewedImage?.uploadDate}</div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-800"
                  onClick={() => mostViewedImage && handleViewImage(mostViewedImage)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Image
                </Button>
              </div>
              
              {/* Right Column - Image Preview */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img 
                  src={mostViewedImage?.url} 
                  alt={mostViewedImage?.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Media Uploaded Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Total Media Uploaded
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-between h-48">
            {/* Upload Stats */}
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div className="text-4xl font-bold text-gray-900">{mediaItems.length}</div>
                <div className="text-sm text-green-600 font-medium">+{Math.floor(mediaItems.length * 0.15)} this week</div>
              </div>
            </div>
            
            {/* Upload Button */}
            <div className="relative">
              <input 
                type="file" 
                accept="image/*,video/*" 
                onChange={handleFileUpload} 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                id="file-upload" 
              />
              <Button className="w-full bg-blue-500 text-white hover:bg-blue-600" asChild>
                <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Media
                </label>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Recent Media Uploaded */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg font-semibold text-gray-700">
            Recent Media Uploaded
          </CardTitle>
          <Button variant="ghost" className="text-blue-600 hover:text-blue-700 p-0">
            View All
            <ArrowUpRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {recentMediaItems.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={item.url} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                </div>
                
                {/* Overlay with action buttons */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white hover:text-gray-900"
                    onClick={() => handleViewImage(item)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-white hover:bg-white hover:text-gray-900"
                    onClick={() => handleDeleteImage(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Image info */}
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.views}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
