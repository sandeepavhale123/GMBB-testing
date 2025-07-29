
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Upload, Filter, Grid, List, Eye, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title: string;
  category: 'local' | 'ai-generated';
  date: string;
  width?: number;
  height?: number;
}

// Sample media data to match the screenshot
const sampleMediaData: MediaItem[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
    type: 'image',
    title: 'Wooden Bowl',
    category: 'local',
    date: '2024-01-15',
    width: 400,
    height: 400,
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    type: 'image',
    title: 'Modern Frame',
    category: 'local',
    date: '2024-01-14',
    width: 400,
    height: 300,
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=500&fit=crop',
    type: 'image',
    title: 'City Skyline',
    category: 'ai-generated',
    date: '2024-01-13',
    width: 400,
    height: 500,
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
    type: 'image',
    title: 'Portrait',
    category: 'ai-generated',
    date: '2024-01-12',
    width: 400,
    height: 400,
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    type: 'image',
    title: 'Mountain Lake',
    category: 'local',
    date: '2024-01-11',
    width: 400,
    height: 300,
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=500&fit=crop',
    type: 'image',
    title: 'Forest Deer',
    category: 'local',
    date: '2024-01-10',
    width: 400,
    height: 500,
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
    type: 'image',
    title: 'Modern Architecture',
    category: 'ai-generated',
    date: '2024-01-09',
    width: 400,
    height: 400,
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
    type: 'image',
    title: 'Building Facade',
    category: 'local',
    date: '2024-01-08',
    width: 400,
    height: 300,
  },
  {
    id: '9',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    type: 'image',
    title: 'Travel Book',
    category: 'ai-generated',
    date: '2024-01-07',
    width: 400,
    height: 400,
  },
  {
    id: '10',
    url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
    type: 'image',
    title: 'Fashion Model',
    category: 'local',
    date: '2024-01-06',
    width: 400,
    height: 500,
  },
  {
    id: '11',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
    type: 'image',
    title: 'Coffee Art',
    category: 'local',
    date: '2024-01-05',
    width: 400,
    height: 400,
  },
  {
    id: '12',
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    type: 'image',
    title: 'Basketball',
    category: 'ai-generated',
    date: '2024-01-04',
    width: 400,
    height: 300,
  },
];

const GalleryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('local');
  const [selectedFilter, setSelectedFilter] = useState('image');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteMediaId, setDeleteMediaId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredMedia = sampleMediaData.filter(item => {
    const matchesTab = selectedTab === 'all' || item.category === selectedTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    
    return matchesTab && matchesSearch && matchesFilter;
  });

  const handleViewMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    // Open media in a modal or new tab
    window.open(media.url, '_blank');
  };

  const handleDeleteMedia = (mediaId: string) => {
    // Here you would typically call an API to delete the media
    console.log('Deleting media:', mediaId);
    toast({
      title: "Media Deleted",
      description: "The media item has been successfully deleted.",
    });
    setDeleteMediaId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Media Gallery</h1>
        <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
          <Upload className="h-4 w-4" />
          Upload Media
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
          <TabsTrigger value="local" className="data-[state=active]:bg-background">
            Local
          </TabsTrigger>
          <TabsTrigger value="ai-generated" className="data-[state=active]:bg-background">
            AI Generated
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-6 mt-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search media"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background border-border"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedFilter === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('image')}
              className="h-8"
            >
              Image
            </Button>
            <Button
              variant={selectedFilter === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('video')}
              className="h-8"
            >
              Video
            </Button>
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className="h-8"
            >
              Date
            </Button>
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 auto-rows-max">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer",
                  // Masonry-style heights
                  item.id === '1' && "row-span-1",
                  item.id === '3' && "row-span-2",
                  item.id === '5' && "row-span-1", 
                  item.id === '6' && "row-span-2",
                  item.id === '10' && "row-span-2"
                )}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                
                {/* Action Buttons Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleViewMedia(item)}
                      className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                    >
                      <Eye className="h-4 w-4 text-gray-700" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Media</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{item.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteMedia(item.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* More Actions Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        >
                          <MoreVertical className="h-4 w-4 text-gray-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewMedia(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteMediaId(item.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Media Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <p className="font-medium text-sm text-white">{item.title}</p>
                  <p className="text-xs text-white/80 mt-1">{new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredMedia.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No media found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GalleryPage;
