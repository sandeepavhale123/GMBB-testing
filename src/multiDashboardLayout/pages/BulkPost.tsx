import React, { useState } from 'react';
import { Plus, Calendar, Send, FileText, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CreatePostModal } from '@/components/Posts/CreatePostModal';
import { useBulkPostsOverview } from '@/hooks/useBulkPostsOverview';
import { format } from 'date-fns';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
export const BulkPost: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    bulkPosts,
    loading,
    error,
    pagination,
    refresh,
    goToPage,
    nextPage,
    prevPage
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
  return <>
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <div className="space-y-6">
      <div className="flex justify-between items-center">
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
              bulkPosts.map(post => <div key={post.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-6">
                      {/* Left Content */}
                      <div className="flex-1 min-w-0">
                        {/* Status Information */}
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          {post.livePosts > 0 && <span className="text-sm text-green-600 font-medium">Posted on {post.livePosts} listings</span>}
                          {post.failedPosts > 0 && <span className="text-sm text-red-600 font-medium">Failed on {post.failedPosts} listings</span>}
                          {post.schedulePosts > 0 && <span className="text-sm text-blue-600 font-medium">Scheduled on {post.schedulePosts} listings</span>}
                          {post.livePosts === 0 && post.failedPosts === 0 && post.schedulePosts === 0 && <span className="text-sm text-muted-foreground">No active posts</span>}
                        </div>
                        
                        {/* Title - using posttype */}
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                          {post.posttype || "Untitled Post"}
                        </h3>
                        
                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-1">
                          {post.posttext || "No description available"}
                        </p>
                        
                        {/* Meta Information */}
                        <div className="text-xs text-muted-foreground mb-4">
                          {post.location_count} total locations • {formatPublishDate(post.publishDate)}
                          {post.tags && <span> • {post.tags}</span>}
                        </div>
                        
                        {/* Action Button */}
                        <Button variant="outline" size="sm" onClick={() => post.CTA_url && window.open(post.CTA_url, '_blank')} className="w-full sm:w-auto">
                          View Details
                        </Button>
                      </div>
                      
                      {/* Right Image */}
                      <div className="flex-shrink-0">
                        <div className="w-40 h-40 bg-muted rounded-lg overflow-hidden">
                          {post.image ? <img src={post.image} alt={post.posttype || 'Post image'} className="w-full h-full object-cover" onError={e => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = '<div class="w-full h-full bg-muted rounded-lg flex items-center justify-center"><span class="text-xs text-muted-foreground text-center px-2">No image</span></div>';
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
            {!loading && !error && pagination && (
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-muted-foreground sm:mr-auto">
                    Showing {((pagination.currentPage - 1) * 10) + 1} to {Math.min(pagination.currentPage * 10, pagination.totalItems)} of {pagination.totalItems} posts
                  </p>
                  
                  {pagination.totalPages > 1 && (
                    <Pagination className="w-auto">
                      <PaginationContent className="ml-auto">
                        <PaginationItem>
                          <PaginationPrevious 
                            onClick={prevPage}
                            className={!pagination.hasPrevious ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                          <PaginationItem key={pageNum}>
                            <PaginationLink
                              onClick={() => goToPage(pageNum)}
                              isActive={pageNum === pagination.currentPage}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            onClick={nextPage}
                            className={!pagination.hasNext ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </>;
};