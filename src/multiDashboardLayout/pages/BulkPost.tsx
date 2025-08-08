import React, { useState } from 'react';
import { Plus, Calendar, Send, FileText, ImageOff, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreatePostModal } from '@/components/Posts/CreatePostModal';
import { useBulkPostsOverview } from '@/hooks/useBulkPostsOverview';
import { format } from 'date-fns';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';
export const BulkPost: React.FC = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    bulkPosts,
    loading,
    error,
    pagination,
    refresh,
    goToPage,
    nextPage,
    prevPage,
    deleteBulk
  } = useBulkPostsOverview();
  const getStatusVariant = (status: string | null | undefined) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'published':
      case 'live':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatPublishDate = (dateString: string) => {
    try {
      // Parse the date format "12/03/2025 11:30 AM"
      const [datePart, timePart, period] = dateString.split(' ');
      const [month, day, year] = datePart.split('/');
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
  const handleDeleteClick = (bulkId: number) => {
    setDeletingPostId(bulkId);
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (deletingPostId) {
      setIsDeleting(true);
      try {
        await deleteBulk(deletingPostId);
        // Go to page 1 after successful deletion
        goToPage(1);
        toast({
          title: "Success",
          description: "Bulk post deleted successfully"
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete bulk post",
          variant: "destructive"
        });
      } finally {
        setIsDeleting(false);
      }
    }
    setDeleteDialogOpen(false);
    setDeletingPostId(null);
  };
  return <>
      <CreatePostModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onBulkPostCreated={refresh}
      />
      <div className="space-y-6">
      <div className="flex justify-start md:justify-between items-center mb-10 flex-col-reverse md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Bulk Post Management</h1>
          <p className="text-muted-foreground">Create and schedule posts across multiple listings</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="">
            
            
            {error && <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-800 text-sm">Error loading bulk posts: {error}</p>
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
                  </div>) : bulkPosts.length === 0 ?
              // Empty state
              <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-foreground mb-2">No bulk posts yet</h4>
                  <p className="text-muted-foreground mb-4">Create your first bulk post to get started</p>
                  <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Bulk Post
                  </Button>
                </div> :
              // Actual data
              bulkPosts.map(post => <div key={post.id} className=" mb-[20px]  ">
                    <div className="flex flex-col-reverse sm:flex-row items-start gap-4 sm:gap-6 pb-4 sm:pb-5 mb-4 sm:mb-6 border-b border-gray-200">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        {/* Status Information */}
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          {post.livePosts > 0 && <span className="font-medium text-sm text-slate-500">Posted on {post.livePosts} listings</span>}
                          {post.failedPosts > 0 && <span className="text-sm font-medium text-slate-500">Failed on {post.failedPosts} listings</span>}
                          {post.schedulePosts > 0 && <span className="text-sm font-medium text-slate-500">Scheduled on {post.schedulePosts} listings</span>}
                          {post.livePosts === 0 && post.failedPosts === 0 && post.schedulePosts === 0 && <span className="text-sm text-muted-foreground">No active posts</span>}
                        </div>
                        
                        {/* Title - using posttype */}
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-xl">
                          {post.posttype || "Untitled Post"}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-muted-foreground mb-4 line-clamp-2 text-base">
                          {post.posttext || "No description available"}
                        </p>
                        
                        {/* Meta Information */}
                        <div className="text-sm text-muted-foreground mb-4">
                          {post.location_count} total locations • {formatPublishDate(post.publishDate)}
                          {post.tags && <span> • {post.tags}</span>}
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/main-dashboard/bulk-post-details/${post.id}`)} className="flex-1 sm:flex-initial">
                            View Details
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(Number(post.id))} className="flex-shrink-0 flex items-center gap-2" disabled={isDeleting && deletingPostId === Number(post.id)}>
                            <Trash2 className="w-4 h-4" />
                            {isDeleting && deletingPostId === Number(post.id) ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </div>
                      
                      {/* Right Image */}
                      <div className="flex-shrink-0 w-60 max-h-[190px]">
  <div className="aspect-w-16 aspect-h-9 bg-muted rounded-lg overflow-hidden h-full max-h-[190px] h-[190px]">
    {post.image ? <img src={post.image} alt={post.posttype || 'Post image'} className="w-full h-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
              <div class='w-full h-full bg-muted rounded-lg flex items-center justify-center'>
                <span class='text-xs text-muted-foreground text-center px-2'>No image</span>
              </div>
            `;
                        }
                      }} /> : <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
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
                    Showing {(pagination.currentPage - 1) * 10 + 1} to {Math.min(pagination.currentPage * 10, pagination.totalItems)} of {pagination.totalItems} posts
                  </p>
                  
                  {pagination.totalPages > 1 && <Pagination className="mr-0 flex align-end justify-end ">
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
      </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the bulk post and all associated data.
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
    </>;
};