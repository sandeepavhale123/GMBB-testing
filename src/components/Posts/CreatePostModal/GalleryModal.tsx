import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Search, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
}

// Sample media data
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
];

export const GalleryModal: React.FC<GalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'local' | 'ai-generated'>('all');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Filter media by tab and search
  const filteredMedia = sampleMediaData.filter(item => {
    const matchesTab = selectedTab === 'all' || item.category === selectedTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleSelectImage = (imageUrl: string) => {
    onSelectImage(imageUrl);
    onClose();
  };

  const handleViewMedia = (media: MediaItem) => {
    setSelectedMedia(media);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Image from Gallery</DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search media"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Tab filters */}
            <div className="flex gap-2">
              <Button
                variant={selectedTab === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab('all')}
              >
                All
              </Button>
              <Button
                variant={selectedTab === 'local' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab('local')}
              >
                Local
              </Button>
              <Button
                variant={selectedTab === 'ai-generated' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab('ai-generated')}
              >
                AI Generated
              </Button>
            </div>
          </div>

          {/* Media Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
              {filteredMedia.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer"
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
                      
                      <Button
                        size="sm"
                        onClick={() => handleSelectImage(item.url)}
                        className="h-8 px-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Select
                      </Button>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="font-medium text-xs text-white truncate">{item.title}</p>
                    <p className="text-xs text-white/70">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {selectedMedia && (
          <Dialog open={!!selectedMedia} onOpenChange={() => setSelectedMedia(null)}>
            <DialogContent className="max-w-4xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <img
                    src={selectedMedia.url}
                    alt={selectedMedia.title}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleSelectImage(selectedMedia.url)}
                    className="absolute top-4 right-4 bg-primary hover:bg-primary/90"
                  >
                    Select This Image
                  </Button>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{selectedMedia.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedMedia.date}</p>
                  <p className="text-sm text-muted-foreground capitalize">{selectedMedia.category}</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
};