import React, { useState } from 'react';
import { Upload, Image, Video, FileText, Folder, Play, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useBulkMediaOverview } from '@/hooks/useBulkMediaOverview';
import { format } from 'date-fns';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { MediaUploadModal } from '@/components/Media/MediaUploadModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { deleteBulkMedia } from '@/api/mediaApi';
import { toast } from '@/hooks/use-toast';
export const BulkMedia: React.FC = () => {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    bulkMedia,
    loading,
    error,
    pagination,
    refresh,
    goToPage,
    nextPage,
    prevPage
  } = useBulkMediaOverview();
  const getStatusVariant = (status: string | null | undefined) => {
    if (!status) return 'secondary';
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'published':
      case 'live':
      case '1':
        return 'default';
      case 'scheduled':
        return 'secondary';
      case 'failed':
      case '0':
        return 'destructive';
      default:
        return 'secondary';
    }
  };
  const formatPublishDate = (dateString: string) => {
    try {
      // Parse the date format "05/09/2024 10:55 AM"
      const [datePart, timePart, period] = dateString.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hour24, parseInt(minutes));
      return format(date, 'MMM dd, yyyy • h:mm a');
    } catch {
      return dateString;
    }
  };
  const handleUploadSuccess = () => {
    refresh();
    setShowUploadModal(false);
  };
  const handleDeleteClick = (item: {
    id: string;
    category: string;
  }) => {
    setItemToDelete({
      id: item.id,
      title: item.category || 'Untitled'
    });
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setDeletingId(itemToDelete.id);
    try {
      const response = await deleteBulkMedia({
        bulkId: parseInt(itemToDelete.id)
      });
      if (response.code === 200) {
        toast({
          title: "Success",
          description: "Media deleted successfully"
        });
        refresh();
      } else {
        throw new Error(response.message || 'Failed to delete media');
      }
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Error",
        description: "Failed to delete media. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeletingId(null);
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };
  return <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Media Management</h1>
          <p className="text-muted-foreground">Upload and organize media across multiple listings.</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className='self-start sm:self-auto'>
          <Upload className="w-4 h-4 mr-2 " />
          Upload Media
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Area */}
        <div className="lg:col-span-3">
          {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
              <p className="text-red-800 text-sm">Error loading bulk media: {error}</p>
              <Button variant="outline" size="sm" onClick={refresh} className="mt-2">
                Try Again
              </Button>
            </div>}

          <div className="space-y-4">
            {loading ?
          // Loading skeleton
          Array.from({
            length: 3
          }).map((_, index) => <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                </div>) : bulkMedia.length === 0 ?
          // Empty state
          <div className="text-center py-12">
                <Image className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="text-lg font-medium text-foreground mb-2">No bulk media yet</h4>
                <p className="text-muted-foreground mb-4">Upload your first bulk media to get started</p>
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Media
                </Button>
              </div> :
          // Actual data
          bulkMedia.map(media => <div key={media.id} className="gap-6 pb-5 mb-6 border-b border-gray-200">
                  <div className="flex flex-col-reverse md:flex-row md:items-start gap-4 md:gap-6">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0">
                      {/* Status Information */}
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        {media.livePosts > 0 && <span className="text-sm font-medium text-slate-500">
                            Posted on {media.livePosts} listings
                          </span>}
                        {media.failedPosts > 0 && <span className="text-sm font-medium text-slate-500">
                            Failed on {media.failedPosts} listings
                          </span>}
                        {media.schedulePosts > 0 && <span className="text-sm font-medium text-slate-500">
                            Scheduled on {media.schedulePosts} listings
                          </span>}
                        {media.livePosts === 0 && media.failedPosts === 0 && media.schedulePosts === 0 && <span className="text-sm text-muted-foreground">No active posts</span>}
                      </div>
                      
                      {/* Category Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="font-semibold text-foreground mb-1 line-clamp-2 text-xl">
                          {media.category}
                        </div>
                        <Badge variant="outline" className="flex gap-2">{media.mediaType === 'video' ? <><Play className="w-3 h-3" /> Video</> : <><Image className="w-3 h-3" /> Photo</>}</Badge>
                      </div>
                      
                      {/* Meta Information */}
                      <div className="text-sm text-muted-foreground mb-4">
                        {media.location_count} total locations • {formatPublishDate(media.publishDate)}
                      </div>
                      
                       {/* Action Buttons */}
                       <div className="flex gap-2 w-full sm:w-auto">
                         <Button variant="outline" size="sm" className="flex-1 sm:flex-initial" onClick={() => navigate(`/main-dashboard/bulk-media-details/${media.id}`)}>
                           View Details
                         </Button>
                        <Button variant="destructive" size="sm" className="flex items-center gap-2" onClick={() => handleDeleteClick({
                    id: media.id,
                    category: media.category
                  })} disabled={deletingId === media.id}>
                          <Trash2 className="h-4 w-4" />
                          {deletingId === media.id ? 'Deleting...' : 'Delete'}
                        </Button>
                      </div>
                    </div>
                    
                    {/* Right Image */}
                    <div className="flex-shrink-0">
                      <div className="bg-muted rounded-lg overflow-hidden relative group" style={{ height: '190px', width: '337px' }}>
                        {media.url ? <>
                            <img 
                              src={media.url} 
                              alt={`${media.category} media`} 
                              className="w-full h-[190px] object-cover transition-all duration-300" 
                              style={{ aspectRatio: '16/9' }}
                              onError={e => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-muted rounded-lg flex items-center justify-center"><span class="text-xs text-muted-foreground text-center px-2">No image</span></div>';
                      }
                    }} />
                            {media.mediaType === 'video' && <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-black/50 rounded-full p-2">
                                  <Play className="w-6 h-6 text-white" />
                                </div>
                              </div>}
                          </> : <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                            <span className="text-xs text-muted-foreground text-center px-2">No image</span>
                          </div>}
                      </div>
                    </div>
                  </div>
                </div>)}
          </div>

          {/* Pagination */}
          {!loading && !error && pagination && <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
                <p className="text-sm text-muted-foreground sm:mr-auto">
                  Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} media
                </p>
                
                {pagination.totalPages > 1 && <Pagination className="mr-0 flex align-end justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious onClick={prevPage} className={!pagination.hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                      
                      {Array.from({
                  length: pagination.totalPages
                }, (_, i) => i + 1).map(pageNum => <PaginationItem key={pageNum}>
                          <PaginationLink onClick={() => goToPage(pageNum)} isActive={pageNum === pagination.currentPage} className="cursor-pointer">
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>)}
                      
                      <PaginationItem>
                        <PaginationNext onClick={nextPage} className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>}
              </div>
            </div>}
        </div>
      </div>

      {/* Upload Modal */}
      <MediaUploadModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} onUpload={handleUploadSuccess} isBulkUpload={true} />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone and will remove the media from all associated listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};