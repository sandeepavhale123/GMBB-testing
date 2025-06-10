import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Eye } from 'lucide-react';
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
  const {
    toast
  } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([{
    id: '1',
    name: 'Digital Marketing',
    views: '12.4k views',
    type: 'image',
    url: '/lovable-uploads/02f59897-014c-45f5-a518-c8d08dadba75.png',
    uploadDate: '2024-06-08'
  }]);
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      // Create a URL for the uploaded file
      const fileUrl = URL.createObjectURL(file);

      // Generate a random view count for demo
      const viewCount = Math.floor(Math.random() * 1000) + 100;
      const newMediaItem: MediaItem = {
        id: Date.now().toString(),
        name: file.name.replace(/\.[^/.]+$/, ""),
        // Remove file extension
        views: `${viewCount} views`,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        url: fileUrl,
        uploadDate: new Date().toISOString().split('T')[0]
      };
      setMediaItems(prev => [...prev, newMediaItem]);
      toast({
        title: "Media Uploaded",
        description: `${file.name} has been uploaded successfully.`
      });
    }
  };
  const handleViewImage = (item: MediaItem) => {
    // Open image in new tab or modal
    window.open(item.url, '_blank');
  };
  return <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Media</h1>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Most Viewed Image Cards */}
        {mediaItems.map(item => <Card key={item.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">
                Most view Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              {/* Views Count */}
              <div>
                <div className="text-2xl font-bold text-gray-900">{item.views}</div>
                <div className="text-sm text-gray-500">image name</div>
              </div>
              
              {/* View Button */}
              <Button variant="outline" className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-800" onClick={() => handleViewImage(item)}>
                <Eye className="w-4 h-4 mr-2" />
                View Image
              </Button>
            </CardContent>
          </Card>)}

        {/* Upload Media Card */}
        <Card className="overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Most view Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Area */}
            <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 mb-2">354</div>
                <div className="text-sm text-green-600 font-medium">+32 last month</div>
              </div>
            </div>
            
            {/* Upload Button */}
            <div className="relative">
              <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" id="file-upload" />
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
    </div>;
};