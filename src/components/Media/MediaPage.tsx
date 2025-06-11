import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Eye, Trash2, ArrowUpRight, MoreVertical, Play, TrendingUp } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
interface MediaItem {
  id: string;
  name: string;
  views: string;
  type: 'image' | 'video';
  url: string;
  uploadDate: string;
}
export const MediaPage: React.FC = () => {
  const {
    toast
  } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([{
    id: '1',
    name: 'Digital Marketing Banner',
    views: '12.4k views',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
    uploadDate: '2024-06-08'
  }, {
    id: '2',
    name: 'Coffee Shop Interior',
    views: '8.2k views',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
    uploadDate: '2024-06-07'
  }, {
    id: '3',
    name: 'Fresh Bakery Products',
    views: '6.1k views',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
    uploadDate: '2024-06-06'
  }, {
    id: '4',
    name: 'Restaurant Ambiance',
    views: '4.8k views',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300',
    uploadDate: '2024-06-05'
  }, {
    id: '5',
    name: 'Team Meeting',
    views: '3.2k views',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300',
    uploadDate: '2024-06-04'
  }, {
    id: '6',
    name: 'Product Showcase',
    views: '2.9k views',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
    uploadDate: '2024-06-03'
  }, {
    id: '7',
    name: 'Office Space',
    views: '2.1k views',
    type: 'video',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
    uploadDate: '2024-06-02'
  }, {
    id: '8',
    name: 'Modern Architecture',
    views: '1.8k views',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300',
    uploadDate: '2024-06-01'
  }]);
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
      description: "Media has been deleted successfully."
    });
  };
  const mostViewedImage = mediaItems[0];
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="text-gray-600">
            Manage your photos
          </Button>
          <div className="relative">
            <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="add-photo-upload" />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
              <label htmlFor="add-photo-upload" className="cursor-pointer flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                Add a photo
              </label>
            </Button>
          </div>
        </div>
      </div>
      {/* Merged Overview Stats Card */}
      <Card className="overflow-hidden py-3">
        <CardContent>
          <div className="grid grid-cols-12 lg:grid-cols-2 gap-6">
            {/* Total Media Count Section */}
            <div className="space-y-4 col-span-5 ">
             <Card>
               <CardContent>
                  <div className="">
                    {/* Upload Stats */}
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Upload className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-gray-900">{mediaItems.length}</div>
                        <div className="text-sm text-black-600 font-medium">Total Uploaded Media</div>
                      </div>
                    </div>
                  </div>
               </CardContent>
             </Card>
            </div>
            {/* Most Viewed Media Section */}
            <div className="space-y-4 col-span-7 ">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Most Viewed</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column - Image Details */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">{mostViewedImage?.name}</h4>
                    <div className="text-xl font-bold text-gray-900 mb-1">{mostViewedImage?.views}</div>
                    <div className="text-xs text-gray-500">Uploaded {mostViewedImage?.uploadDate}</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-800 mt-2" onClick={() => mostViewedImage && handleViewImage(mostViewedImage)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
                
                {/* Right Column - Image Preview */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img src={mostViewedImage?.url} alt={mostViewedImage?.name} className="w-full h-full object-cover" />
                </div>
              </div>
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
          {/* Filter Tabs */}
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

          {/* Media Grid - 4 column layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {mediaItems.map(item => <div key={item.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                {/* Media Image */}
                <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" onClick={() => handleViewImage(item)} />
                
                {/* Video Overlay */}
                {item.type === 'video' && <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                    <div className="bg-black bg-opacity-50 rounded-full p-2">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      0:15
                    </div>
                  </div>}
                
                {/* Hover Overlay with Actions */}
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

                {/* Selection Checkbox (visible on hover) */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-5 h-5 border-2 border-white rounded bg-white bg-opacity-20 hover:bg-opacity-40 cursor-pointer"></div>
                </div>
              </div>)}
          </div>
        </CardContent>
      </Card>

      
    </div>;
};