
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
import { MediaPagination } from '@/components/Media/MediaPagination';
import { AIPromptInput } from '@/components/Media/AIGeneration/AIPromptInput';
import { AIParameters } from '@/components/Media/AIGeneration/AIParameters';
import { AIActionButtons } from '@/components/Media/AIGeneration/AIActionButtons';
import { AIImagePreview } from '@/components/Media/AIGeneration/AIImagePreview';
import { generateAIImage } from '@/api/mediaApi';

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
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaData, setMediaData] = useState<MediaItem[]>(sampleMediaData);
  const { toast } = useToast();

  // Pagination state
  const [localCurrentPage, setLocalCurrentPage] = useState(1);
  const [aiCurrentPage, setAiCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // AI Generation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiVariants, setAiVariants] = useState(1);
  const [aiStyle, setAiStyle] = useState('photographic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // File upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        const newMedia: MediaItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          title: file.name.split('.')[0],
          category: 'local',
          date: new Date().toISOString().split('T')[0],
          width: 400,
          height: 400,
        };
        
        setMediaData(prev => [newMedia, ...prev]);
      }
    });

    toast({
      title: "Media Uploaded",
      description: `Successfully uploaded ${files.length} file(s).`,
    });

    // Reset input
    event.target.value = '';
  };

  // Filter media by tab and search
  const filteredMedia = mediaData.filter(item => {
    const matchesTab = item.category === selectedTab;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Pagination calculations
  const currentPage = selectedTab === 'local' ? localCurrentPage : aiCurrentPage;
  const totalPages = Math.ceil(filteredMedia.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMedia = filteredMedia.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    if (selectedTab === 'local') {
      setLocalCurrentPage(page);
    } else {
      setAiCurrentPage(page);
    }
  };

  const handleViewMedia = (media: MediaItem) => {
    setSelectedMedia(media);
    window.open(media.url, '_blank');
  };

  const handleDeleteMedia = (mediaId: string) => {
    console.log('Deleting media:', mediaId);
    toast({
      title: "Media Deleted",
      description: "The media item has been successfully deleted.",
    });
  };

  // AI Generation handlers
  const handleGenerate = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await generateAIImage({
        prompt: aiPrompt,
        variants: aiVariants,
        style: aiStyle
      });

      if (response.code === 200 && response.data?.results) {
        const imageUrls = response.data.results.map(result => result.url);
        setGeneratedImages(imageUrls);
        setSelectedImageIndex(0);
        toast({
          title: "Images Generated",
          description: `Successfully generated ${imageUrls.length} image(s).`,
        });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedImages([]);
    setSelectedImageIndex(0);
    handleGenerate();
  };

  const handleUseMedia = () => {
    if (generatedImages.length > 0) {
      const selectedImage = generatedImages[selectedImageIndex];
      toast({
        title: "Image Added",
        description: "AI-generated image has been added to your media library.",
      });
      setGeneratedImages([]);
      setSelectedImageIndex(0);
    }
  };

  const handlePreviousImage = () => {
    setSelectedImageIndex(prev => 
      prev > 0 ? prev - 1 : generatedImages.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => 
      prev < generatedImages.length - 1 ? prev + 1 : 0
    );
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };

  return (
    <div className="space-y-6">
      {/* Header with tabs moved to right */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">Media Gallery</h1>
        
        {/* Tabs moved to top right */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-fit">
          <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
            <TabsTrigger value="local" className="data-[state=active]:bg-background">
              Local
            </TabsTrigger>
            <TabsTrigger value="ai-generated" className="data-[state=active]:bg-background">
              AI Generated
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      

      {/* Tab Content */}
      <div className="space-y-6">
        {selectedTab === 'local' && (
          <div className="space-y-6">
            {/* Local Media Grid */}
            {/* Search and Upload in single line */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1 ">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search media"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-border"
                  />
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Button 
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 whitespace-nowrap"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload Media
                </Button>
              </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {paginatedMedia.map((item) => (
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
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="font-medium text-xs text-white truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Local Tab Pagination */}
            {totalPages > 1 && (
              <MediaPagination
                currentPage={localCurrentPage}
                totalPages={totalPages}
                hasNext={localCurrentPage < totalPages}
                hasPrev={localCurrentPage > 1}
                onPageChange={handlePageChange}
                totalItems={filteredMedia.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        )}

        {selectedTab === 'ai-generated' && (
          <div className="space-y-6">
            {/* AI Generation Section */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Generate AI Images</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Input
                  type="text"
                  placeholder="Describe the image you want to generate..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  maxLength={200}
                  className="flex-1 h-10 bg-background border-border"
                />
                
                <select 
                  value={aiStyle} 
                  onChange={(e) => setAiStyle(e.target.value)}
                  className="h-10 px-3 bg-background border border-border rounded-md text-sm min-w-[120px]"
                >
                  <option value="" disabled>Select Style</option>
                  <option value="realistic">Realistic</option>
                  <option value="artistic">Artistic</option>
                  <option value="cartoon">Cartoon</option>
                  <option value="abstract">Abstract</option>
                  <option value="minimalist">Minimalist</option>
                  <option value="vintage">Vintage</option>
                  <option value="modern">Modern</option>
                  <option value="file-1">File-1</option>
                </select>
                
                <select 
                  value={aiVariants.toString()} 
                  onChange={(e) => setAiVariants(parseInt(e.target.value))}
                  className="h-10 px-3 bg-background border border-border rounded-md text-sm min-w-[140px]"
                >
                  <option value="" disabled>No. of Variants</option>
                  <option value="1">1 variant</option>
                  <option value="2">2 variants</option>
                  <option value="3">3 variants</option>
                  <option value="4">4 variants</option>
                </select>
                
                <Button
                  onClick={handleGenerate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="h-10 px-6 bg-primary hover:bg-primary/90 whitespace-nowrap"
                >
                  {isGenerating ? 'Generating...' : 'Generate Only'}
                </Button>
              </div>

                {generatedImages.length > 0 && (
                  <div className="space-y-4">
                    <AIImagePreview
                      images={generatedImages}
                      selectedIndex={selectedImageIndex}
                      prompt={aiPrompt}
                      style={aiStyle}
                      onPreviousImage={handlePreviousImage}
                      onNextImage={handleNextImage}
                      onSelectImage={handleSelectImage}
                    />
                  </div>
                )}
            </div>

            {/* AI Generated Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {paginatedMedia.map((item) => (
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
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="font-medium text-xs text-white truncate">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Tab Pagination */}
            {totalPages > 1 && (
              <MediaPagination
                currentPage={aiCurrentPage}
                totalPages={totalPages}
                hasNext={aiCurrentPage < totalPages}
                hasPrev={aiCurrentPage > 1}
                onPageChange={handlePageChange}
                totalItems={filteredMedia.length}
                itemsPerPage={itemsPerPage}
              />
            )}
          </div>
        )}

        {/* Empty State */}
        {paginatedMedia.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No media found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or generate new AI images.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
