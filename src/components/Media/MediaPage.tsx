
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';
import { MediaUploadModal } from './MediaUploadModal';
import { MediaStatsChart } from './MediaStatsChart';
import { MediaStatsCards } from './MediaStatsCards';
import { MediaMostViewedCard } from './MediaMostViewedCard';
import { MediaLibraryCard } from './MediaLibraryCard';
import { MediaEmptyState } from './MediaEmptyState';
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
    return <MediaEmptyState />;
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
        <MediaStatsCards totalItems={totalItems} currentPageItems={mediaItems.length} />
        <MediaMostViewedCard mostViewedImage={mostViewedImage} onViewImage={handleViewImage} />
        <MediaStatsChart />
      </div>

      {/* Media Library */}
      <MediaLibraryCard
        mediaTypeTab={mediaTypeTab}
        onMediaTypeTabChange={setMediaTypeTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        isLoading={isLoading}
        mediaItems={mediaItems}
        onViewImage={handleViewImage}
        onEditMedia={handleEditMedia}
        onDeleteImage={handleDeleteImage}
        onDownloadMedia={handleDownloadMedia}
        onSetAsCover={handleSetAsCover}
        currentPage={currentPage}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onPageChange={handlePageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      <MediaUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleMediaUpload} />
    </div>
  );
};
