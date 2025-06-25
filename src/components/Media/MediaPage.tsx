import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Upload, Eye, Trash2, MoreVertical, Play } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { MediaUploadModal } from './MediaUploadModal';
import { MediaStatsChart } from './MediaStatsChart';
import { MediaFilters } from './MediaFilters';
import { EnhancedMediaCard } from './EnhancedMediaCard';

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

export const MediaPage: React.FC = () => {
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [mediaTypeTab, setMediaTypeTab] = useState('all');
  
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'Digital Marketing Banner',
      views: '12.4k',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
      uploadDate: '2024-06-08',
      size: '2.4 MB',
      status: 'approved',
      category: 'marketing'
    },
    {
      id: '2',
      name: 'Coffee Shop Interior',
      views: '8.2k',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300',
      uploadDate: '2024-06-07',
      size: '1.8 MB',
      status: 'uploaded',
      category: 'products'
    },
    {
      id: '3',
      name: 'Fresh Bakery Products',
      views: '6.1k',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300',
      uploadDate: '2024-06-06',
      size: '15.2 MB',
      status: 'scheduled',
      category: 'products'
    },
    {
      id: '4',
      name: 'Restaurant Ambiance',
      views: '4.8k',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300',
      uploadDate: '2024-06-05',
      size: '1.2 MB',
      status: 'approved',
      category: 'products'
    },
    {
      id: '5',
      name: 'Team Meeting',
      views: '3.2k',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300',
      uploadDate: '2024-06-04',
      size: '1.5 MB',
      status: 'uploaded',
      category: 'events'
    },
    {
      id: '6',
      name: 'Product Showcase',
      views: '2.9k',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300',
      uploadDate: '2024-06-03',
      size: '2.0 MB',
      status: 'approved',
      category: 'products'
    },
    {
      id: '7',
      name: 'Office Space',
      views: '2.1k',
      type: 'video',
      url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300',
      uploadDate: '2024-06-02',
      size: '1.9 MB',
      status: 'scheduled',
      category: 'office'
    },
    {
      id: '8',
      name: 'Modern Architecture',
      views: '1.8k',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300',
      uploadDate: '2024-06-01',
      size: '1.7 MB',
      status: 'approved',
      category: 'architecture'
    }
  ]);

  const handleViewImage = (item: MediaItem) => {
    window.open(item.url, '_blank');
  };

  const handleEditMedia = (id: string) => {
    toast({
      title: "Edit Media",
      description: "Edit functionality will be implemented."
    });
  };

  const handleDeleteImage = (id: string) => {
    setMediaItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Media Deleted",
      description: "Media has been deleted successfully."
    });
  };

  const handleDownloadMedia = (item: MediaItem) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = item.url;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading ${item.name}...`
    });
  };

  const handleSetAsCover = (id: string) => {
    toast({
      title: "Cover Image Set",
      description: "Media has been set as cover image."
    });
  };

  const handleMediaUpload = (newMedia: any[]) => {
    const mediaItems: MediaItem[] = newMedia.map((file) => ({
      id: file.id,
      name: file.name,
      views: '0',
      type: file.type,
      url: file.url,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '2.1 MB',
      status: 'uploaded' as const,
      category: 'marketing'
    }));

    setMediaItems(prev => [...mediaItems, ...prev]);
    toast({
      title: "Media Uploaded",
      description: `${newMedia.length} media file(s) uploaded successfully.`
    });
  };

  // Filter media based on search, category, status, and media type tab
  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesMediaType = mediaTypeTab === 'all' || item.type === mediaTypeTab;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesMediaType;
  });

  const mostViewedImage = mediaItems[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Media</h2>
        <div className="flex items-center gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-md text-black mb-2">Total media uploaded</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">354</div>
              </div>
              <hr />
              <div>
                <div className="text-md text-black mb-2">Last month uploaded</div>
                <div className="text-3xl font-bold text-gray-900">04</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Most view Image</h3>
            </div>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-7">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">12.4k views</div>
                  <div className="text-sm text-gray-500">Image name</div>
                </div>
                <Button variant="default" size="sm" className="bg-gray-800 text-white hover:bg-gray-700 px-6" onClick={() => mostViewedImage && handleViewImage(mostViewedImage)}>
                  View Image
                </Button>
              </div>
              
              <div className="col-span-5">
                <div className="aspect-square rounded-lg overflow-hidden">
                  <img src={mostViewedImage?.url} alt={mostViewedImage?.name} className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Stats Chart */}
        <MediaStatsChart />
      </div>

      {/* Media Library */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-700">
              Media Library
            </CardTitle>
            <Tabs value={mediaTypeTab} onValueChange={setMediaTypeTab} className="w-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image">Images</TabsTrigger>
                <TabsTrigger value="video">Videos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <MediaFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            category={categoryFilter}
            onCategoryChange={setCategoryFilter}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-4">
            {filteredMedia.map(item => (
              <EnhancedMediaCard
                key={item.id}
                id={item.id}
                name={item.name}
                url={item.url}
                type={item.type}
                size={item.size}
                uploadDate={item.uploadDate}
                status={item.status}
                views={item.views}
                onView={() => handleViewImage(item)}
                onEdit={() => handleEditMedia(item.id)}
                onDelete={() => handleDeleteImage(item.id)}
                onDownload={() => handleDownloadMedia(item)}
                onSetAsCover={() => handleSetAsCover(item.id)}
              />
            ))}
          </div>
          
          {filteredMedia.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No media files match your current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <MediaUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleMediaUpload} />
    </div>
  );
};
