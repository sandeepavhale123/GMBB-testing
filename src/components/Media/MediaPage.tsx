
import React, { useState, useEffect } from 'react';
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
import { MediaPagination } from './MediaPagination';
import { getMediaList, MediaListItem } from '../../api/mediaApi';
import { useListingContext } from '../../context/ListingContext';

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
  const { selectedListing } = useListingContext();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [mediaTypeTab, setMediaTypeTab] = useState('all');
  const [sortBy, setSortBy] = useState('postdate');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);

  // Map API response to MediaItem format
  const mapApiToMediaItem = (apiItem: MediaListItem): MediaItem => {
    return {
      id: apiItem.id,
      name: apiItem.category.charAt(0).toUpperCase() + apiItem.category.slice(1).toLowerCase(),
      views: `${apiItem.insights || 0}`,
      type: apiItem.media_type === 'image' ? 'image' : 'video',
      url: apiItem.googleUrl,
      uploadDate: apiItem.postdate,
      size: '2.1 MB', // API doesn't provide size, using placeholder
      status: apiItem.status === 'Live' ? 'approved' : apiItem.status === 'Schedule' ? 'scheduled' : 'uploaded',
      category: apiItem.category.toLowerCase()
    };
  };

  // Fetch media list from API
  const fetchMediaList = async () => {
    if (!selectedListing) {
      console.log('No listing selected');
      return;
    }

    setIsLoading(true);
    try {
      const response = await getMediaList({
        listingId: selectedListing.id,
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery,
        category: categoryFilter,
        status: statusFilter,
        type: mediaTypeTab === 'all' ? '' : mediaTypeTab,
        sort_by: sortBy,
        sort_order: sortOrder
      });

      if (response.code === 200) {
        const mappedItems = response.data.media.map(mapApiToMediaItem);
        setMediaItems(mappedItems);
        setTotalItems(response.data.total);
        setTotalPages(response.data.pagination.total_pages);
        setHasNext(response.data.pagination.has_next);
        setHasPrev(response.data.pagination.has_prev);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to fetch media list",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching media list:', error);
      toast({
        title: "Error",
        description: "Failed to fetch media list. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch media list when dependencies change
  useEffect(() => {
    fetchMediaList();
  }, [selectedListing, currentPage, searchQuery, categoryFilter, statusFilter, mediaTypeTab, sortBy, sortOrder]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchQuery, categoryFilter, statusFilter, mediaTypeTab, sortBy, sortOrder]);

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
    // Refresh the media list after successful upload
    fetchMediaList();
    toast({
      title: "Media Uploaded",
      description: `${newMedia.length} media file(s) uploaded successfully.`
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const mostViewedImage = mediaItems.find(item => item.type === 'image') || mediaItems[0];

  if (!selectedListing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Your Media</h2>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-yellow-800">Please select a business listing to view media.</p>
        </div>
      </div>
    );
  }

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
                <div className="text-3xl font-bold text-gray-900 mb-1">{totalItems}</div>
              </div>
              <hr />
              <div>
                <div className="text-md text-black mb-2">Current page items</div>
                <div className="text-3xl font-bold text-gray-900">{mediaItems.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {mostViewedImage && (
          <Card className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Most view Image</h3>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900 mb-1">{mostViewedImage.views} views</div>
                    <div className="text-sm text-gray-500">{mostViewedImage.name}</div>
                  </div>
                  <Button variant="default" size="sm" className="bg-gray-800 text-white hover:bg-gray-700 px-6" onClick={() => handleViewImage(mostViewedImage)}>
                    View Image
                  </Button>
                </div>
                
                <div className="col-span-5">
                  <div className="aspect-square rounded-lg overflow-hidden">
                    <img src={mostViewedImage.url} alt={mostViewedImage.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
            sortBy={sortBy}
            onSortByChange={setSortBy}
            sortOrder={sortOrder}
            onSortOrderChange={setSortOrder}
          />

          {/* Loading State */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Loading media...</div>
            </div>
          ) : (
            <>
              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-6 gap-4">
                {mediaItems.map(item => (
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
              
              {/* Empty State */}
              {mediaItems.length === 0 && !isLoading && (
                <div className="text-center py-12 text-gray-500">
                  <p>No media files found.</p>
                </div>
              )}

              {/* Pagination */}
              <MediaPagination
                currentPage={currentPage}
                totalPages={totalPages}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>

      <MediaUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleMediaUpload} />
    </div>
  );
};
