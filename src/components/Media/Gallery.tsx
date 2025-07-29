import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Upload, Eye, Trash2, Download, FileImage, Film, MoreVertical } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { AIImagePreview } from '@/components/Media/AIGeneration/AIImagePreview';
import { generateAIImage } from '@/api/mediaApi';

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  title: string;
  category: 'local' | 'ai-generated';
  date: string;
  width?: number;
  height?: number;
}

// Sample media data
const sampleMediaData: MediaItem[] = [{
  id: '1',
  url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Wooden Bowl',
  category: 'local',
  date: '2024-01-15',
  width: 400,
  height: 400
}, {
  id: '2',
  url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Modern Frame',
  category: 'local',
  date: '2024-01-14',
  width: 400,
  height: 300
}, {
  id: '3',
  url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=400&h=500&fit=crop',
  type: 'image',
  title: 'City Skyline',
  category: 'ai-generated',
  date: '2024-01-13',
  width: 400,
  height: 500
}, {
  id: '4',
  url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Portrait',
  category: 'ai-generated',
  date: '2024-01-12',
  width: 400,
  height: 400
}, {
  id: '5',
  url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Mountain Lake',
  category: 'local',
  date: '2024-01-11',
  width: 400,
  height: 300
}, {
  id: '6',
  url: 'https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=500&fit=crop',
  type: 'image',
  title: 'Forest Deer',
  category: 'local',
  date: '2024-01-10',
  width: 400,
  height: 500
}, {
  id: '7',
  url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Modern Architecture',
  category: 'ai-generated',
  date: '2024-01-09',
  width: 400,
  height: 400
}, {
  id: '8',
  url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Building Facade',
  category: 'local',
  date: '2024-01-08',
  width: 400,
  height: 300
}, {
  id: '9',
  url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Travel Book',
  category: 'ai-generated',
  date: '2024-01-07',
  width: 400,
  height: 400
}, {
  id: '10',
  url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop',
  type: 'image',
  title: 'Fashion Model',
  category: 'local',
  date: '2024-01-06',
  width: 400,
  height: 500
}, {
  id: '11',
  url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Coffee Art',
  category: 'local',
  date: '2024-01-05',
  width: 400,
  height: 400
}, {
  id: '12',
  url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Basketball',
  category: 'ai-generated',
  date: '2024-01-04',
  width: 400,
  height: 300
}, {
  id: '13',
  url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Laptop Setup',
  category: 'local',
  date: '2024-01-03',
  width: 400,
  height: 400
}, {
  id: '14',
  url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Office Space',
  category: 'ai-generated',
  date: '2024-01-02',
  width: 400,
  height: 300
}, {
  id: '15',
  url: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=400&h=500&fit=crop',
  type: 'image',
  title: 'Business Meeting',
  category: 'local',
  date: '2024-01-01',
  width: 400,
  height: 500
}, {
  id: '16',
  url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Team Work',
  category: 'ai-generated',
  date: '2023-12-31',
  width: 400,
  height: 400
}, {
  id: '17',
  url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Analytics',
  category: 'local',
  date: '2023-12-30',
  width: 400,
  height: 300
}, {
  id: '18',
  url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Food Photography',
  category: 'ai-generated',
  date: '2023-12-29',
  width: 400,
  height: 400
}, {
  id: '19',
  url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=500&fit=crop',
  type: 'image',
  title: 'Abstract Art',
  category: 'local',
  date: '2023-12-28',
  width: 400,
  height: 500
}, {
  id: '20',
  url: 'https://images.unsplash.com/photo-1464822759844-d150baec0151?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Workout',
  category: 'ai-generated',
  date: '2023-12-27',
  width: 400,
  height: 400
}, {
  id: '21',
  url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Healthy Food',
  category: 'local',
  date: '2023-12-26',
  width: 400,
  height: 300
}, {
  id: '22',
  url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Programming',
  category: 'ai-generated',
  date: '2023-12-25',
  width: 400,
  height: 400
}, {
  id: '23',
  url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=500&fit=crop',
  type: 'image',
  title: 'Web Development',
  category: 'local',
  date: '2023-12-24',
  width: 400,
  height: 500
}, {
  id: '24',
  url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Creative Design',
  category: 'ai-generated',
  date: '2023-12-23',
  width: 400,
  height: 400
}, {
  id: '25',
  url: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Music Studio',
  category: 'local',
  date: '2023-12-22',
  width: 400,
  height: 300
}, {
  id: '26',
  url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Audio Equipment',
  category: 'ai-generated',
  date: '2023-12-21',
  width: 400,
  height: 400
}, {
  id: '27',
  url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=500&fit=crop',
  type: 'image',
  title: 'Headphones',
  category: 'local',
  date: '2023-12-20',
  width: 400,
  height: 500
}, {
  id: '28',
  url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Digital Art',
  category: 'ai-generated',
  date: '2023-12-19',
  width: 400,
  height: 400
}, {
  id: '29',
  url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
  type: 'image',
  title: 'Smartphone',
  category: 'local',
  date: '2023-12-18',
  width: 400,
  height: 300
}, {
  id: '30',
  url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=400&fit=crop',
  type: 'image',
  title: 'Tech Gadgets',
  category: 'ai-generated',
  date: '2023-12-17',
  width: 400,
  height: 400
}];

interface GalleryProps {
  showTabs?: boolean;
  showHeader?: boolean;
  showUpload?: boolean;
  showAIGeneration?: boolean;
  showDeleteButton?: boolean;
  showSelectButton?: boolean;
  onSelectImage?: (imageUrl: string) => void;
  className?: string;
}

export const Gallery: React.FC<GalleryProps> = ({
  showTabs = true,
  showHeader = true,
  showUpload = true,
  showAIGeneration = true,
  showDeleteButton = true,
  showSelectButton = false,
  onSelectImage,
  className = ''
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('local');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [mediaData, setMediaData] = useState<MediaItem[]>(sampleMediaData);
  const {
    toast
  } = useToast();

  // Pagination state - Load More functionality
  const [localItemsToShow, setLocalItemsToShow] = useState(16);
  const [aiItemsToShow, setAiItemsToShow] = useState(16);
  const itemsPerLoad = 14; // Remaining images after initial 16

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
    Array.from(files).forEach(file => {
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
          height: 400
        };
        setMediaData(prev => [newMedia, ...prev]);
      }
    });
    toast({
      title: "Media Uploaded",
      description: `Successfully uploaded ${files.length} file(s).`
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

  // Load More calculations
  const itemsToShow = selectedTab === 'local' ? localItemsToShow : aiItemsToShow;
  const visibleMedia = filteredMedia.slice(0, itemsToShow);
  const hasMoreItems = filteredMedia.length > itemsToShow;
  const handleLoadMore = () => {
    if (selectedTab === 'local') {
      setLocalItemsToShow(prev => Math.min(prev + itemsPerLoad, filteredMedia.length));
    } else {
      setAiItemsToShow(prev => Math.min(prev + itemsPerLoad, filteredMedia.length));
    }
  };
  const handleViewMedia = (media: MediaItem) => {
    setSelectedMedia(media);
  };
  const handleDeleteMedia = (mediaId: string) => {
    console.log('Deleting media:', mediaId);
    toast({
      title: "Media Deleted",
      description: "The media item has been successfully deleted."
    });
  };
  const handleSelectMedia = (media: MediaItem) => {
    if (onSelectImage) {
      onSelectImage(media.url);
    }
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
          description: `Successfully generated ${imageUrls.length} image(s).`
        });
      }
    } catch (error) {
      console.error('AI generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handlePreviousImage = () => {
    setSelectedImageIndex(prev => prev > 0 ? prev - 1 : generatedImages.length - 1);
  };
  const handleNextImage = () => {
    setSelectedImageIndex(prev => prev < generatedImages.length - 1 ? prev + 1 : 0);
  };
  const handleSelectImageFromGenerated = (index: number) => {
    setSelectedImageIndex(index);
  };

  return <div className={`space-y-6 ${className}`}>
      {/* Header with tabs */}
      {showHeader && <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="font-bold text-foreground text-2xl">Gallery</h1>
          
          {showTabs && <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-fit">
              <TabsList className="grid w-fit grid-cols-2 bg-muted/50">
                <TabsTrigger value="local" className="data-[state=active]:bg-background">
                  Uploaded
                </TabsTrigger>
                <TabsTrigger value="ai-generated" className="data-[state=active]:bg-background">
                  AI Generated
                </TabsTrigger>
              </TabsList>
            </Tabs>}
        </div>}

      {/* Tab Content */}
      <div className="space-y-6">
        {selectedTab === 'local' && <div className="space-y-6">
            {/* Search and Upload */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Uploaded Images</h2>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="text" placeholder="Search media" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-background border-border" />
                </div>
                {showUpload && <>
                    <input type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 whitespace-nowrap" onClick={() => document.getElementById('file-upload')?.click()}>
                      <Upload className="h-4 w-4" />
                      Upload Media
                    </Button>
                  </>}
              </div>
            </div>

            {/* Media Filter Tabs */}
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="h-8">All</Button>
                <Button variant="ghost" size="sm" className="h-8">Images</Button>
                <Button variant="ghost" size="sm" className="h-8">Videos</Button>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredMedia.length} items
              </div>
            </div>

            {/* Media Grid */}
            <div className="flex gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 flex-1">
                {visibleMedia.map(item => <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <div className="aspect-square overflow-hidden">
                      <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                    </div>
                    
                    {/* Action Buttons Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <div className="flex items-center gap-2">
                        {/* Quick View */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" onClick={() => handleViewMedia(item)} className="h-8 w-8 p-0 bg-white/90 hover:bg-white" title="Quick View">
                              <Eye className="h-4 w-4 text-gray-700" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <div className="flex flex-col items-center space-y-4">
                              <img src={selectedMedia?.url} alt={selectedMedia?.title} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                              <div className="text-center">
                                <h3 className="text-lg font-semibold">{selectedMedia?.title}</h3>
                                <p className="text-sm text-muted-foreground">{selectedMedia?.date}</p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white" title="More Actions">
                              <MoreVertical className="h-4 w-4 text-gray-700" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg z-50" align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                const link = document.createElement('a');
                                link.href = item.url;
                                link.download = item.title || 'image';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <Download className="h-4 w-4" />
                              Download Image
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => {
                                console.log('Use for post:', item.id);
                                toast({
                                  title: "Image Selected",
                                  description: "Image ready to use for post creation",
                                });
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <FileImage className="h-4 w-4" />
                              Use for Post
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                              onClick={() => {
                                console.log('Use for media:', item.id);
                                toast({
                                  title: "Image Selected",
                                  description: "Image ready to use for media",
                                });
                              }}
                              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                              <Film className="h-4 w-4" />
                              Use for Media
                            </DropdownMenuItem>

                            {showSelectButton && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleSelectMedia(item)}
                                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-primary"
                                >
                                  Select
                                </DropdownMenuItem>
                              </>
                            )}

                            {showDeleteButton && (
                              <>
                                <DropdownMenuSeparator />
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()}
                                      className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </DropdownMenuItem>
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
                                      <AlertDialogAction onClick={() => handleDeleteMedia(item.id)} className="bg-red-600 hover:bg-red-700">
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Media Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <p className="font-medium text-xs text-white truncate">{item.title}</p>
                    </div>
                  </div>)}
              </div>
              
              {/* Load More Button - Right Side */}
              {hasMoreItems && <div className="flex items-start pt-2">
                  <Button onClick={handleLoadMore} variant="outline" className="px-6 whitespace-nowrap">
                    Load More ({filteredMedia.length - itemsToShow})
                  </Button>
                </div>}
            </div>
          </div>}

        {selectedTab === 'ai-generated' && <div className="space-y-6">
            {/* AI Generation Section */}
            {showAIGeneration && <div className="bg-card border border-border rounded-lg p-6 space-y-6">
                <h2 className="text-xl font-semibold text-foreground">Generate AI Images</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <Input type="text" placeholder="Describe the image you want to generate..." value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} maxLength={200} className="flex-1 h-10 bg-background border-border" />
                  
                  <select value={aiStyle} onChange={e => setAiStyle(e.target.value)} className="h-10 px-3 bg-background border border-border rounded-md text-sm min-w-[120px]">
                    <option value="" disabled>Select Style</option>
                    <option value="realistic">Realistic</option>
                    <option value="artistic">Artistic</option>
                    <option value="cartoon">Cartoon</option>
                    <option value="abstract">Abstract</option>
                    <option value="minimalist">Minimalist</option>
                    <option value="vintage">Vintage</option>
                    <option value="modern">Modern</option>
                  </select>
                  
                  <select value={aiVariants.toString()} onChange={e => setAiVariants(parseInt(e.target.value))} className="h-10 px-3 bg-background border border-border rounded-md text-sm min-w-[140px]">
                    <option value="" disabled>No. of Variants</option>
                    <option value="1">1 variant</option>
                    <option value="2">2 variants</option>
                    <option value="3">3 variants</option>
                    <option value="4">4 variants</option>
                  </select>
                  
                  <Button onClick={handleGenerate} disabled={!aiPrompt.trim() || isGenerating} className="h-10 px-6 bg-primary hover:bg-primary/90 whitespace-nowrap">
                    {isGenerating ? 'Generating...' : 'Generate'}
                  </Button>
                </div>

                {generatedImages.length > 0 && <div className="space-y-4">
                    <AIImagePreview images={generatedImages} selectedIndex={selectedImageIndex} prompt={aiPrompt} style={aiStyle} onPreviousImage={handlePreviousImage} onNextImage={handleNextImage} onSelectImage={handleSelectImageFromGenerated} />
                  </div>}
              </div>}

            {/* AI Generated Media Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {visibleMedia.map(item => <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <div className="aspect-square overflow-hidden">
                    <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105" />
                  </div>
                  
                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      {/* Quick View */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="secondary" onClick={() => handleViewMedia(item)} className="h-8 w-8 p-0 bg-white/90 hover:bg-white" title="Quick View">
                            <Eye className="h-4 w-4 text-gray-700" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <div className="flex flex-col items-center space-y-4">
                            <img src={selectedMedia?.url} alt={selectedMedia?.title} className="max-w-full object-contain rounded-lg" />
                            <div className="text-center">
                              <h3 className="text-lg font-semibold">{selectedMedia?.title}</h3>
                              <p className="text-sm text-muted-foreground">{selectedMedia?.date}</p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-white/90 hover:bg-white" title="More Actions">
                            <MoreVertical className="h-4 w-4 text-gray-700" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48 bg-white border border-gray-200 shadow-lg z-50" align="end">
                          <DropdownMenuItem 
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = item.url;
                              link.download = item.title || 'image';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                            Download Image
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => {
                              console.log('Use for post:', item.id);
                              toast({
                                title: "Image Selected",
                                description: "Image ready to use for post creation",
                              });
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <FileImage className="h-4 w-4" />
                            Use for Post
                          </DropdownMenuItem>
                          
                          <DropdownMenuItem 
                            onClick={() => {
                              console.log('Use for media:', item.id);
                              toast({
                                title: "Image Selected",
                                description: "Image ready to use for media",
                              });
                            }}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            <Film className="h-4 w-4" />
                            Use for Media
                          </DropdownMenuItem>

                          {showSelectButton && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleSelectMedia(item)}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-primary"
                              >
                                Select
                              </DropdownMenuItem>
                            </>
                          )}

                          {showDeleteButton && (
                            <>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 cursor-pointer text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
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
                                    <AlertDialogAction onClick={() => handleDeleteMedia(item.id)} className="bg-red-600 hover:bg-red-700">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Media Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="font-medium text-xs text-white truncate">{item.title}</p>
                  </div>
                </div>)}
            </div>

          </div>}

        {/* Empty State */}
        {visibleMedia.length === 0 && <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No media found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or generate new AI images.
            </p>
          </div>}
      </div>
    </div>;
};
