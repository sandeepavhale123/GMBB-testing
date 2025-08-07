import React, { useState, useEffect, memo, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useBulkPostDetails } from '@/hooks/useBulkPostDetails';
import { useDebounce } from '@/hooks/useDebounce';
import { format } from 'date-fns';

// Memoized Post Preview Component with deep comparison
const PostPreview = memo(({ bulkPost }: { bulkPost: any }) => {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

  if (!bulkPost) return null;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        {/* Image */}
        {bulkPost?.media?.images && (
          <div className="w-full">
            <img 
              src={bulkPost.media.images} 
              alt="Post media" 
              className="w-full h-48 object-cover rounded-lg border border-border" 
            />
          </div>
        )}

        {/* Title */}
        {bulkPost?.title && (
          <h3 className="text-xl font-bold text-foreground">{bulkPost.title}</h3>
        )}

        {/* Description */}
        {bulkPost?.content && (
          <div className="text-sm text-muted-foreground leading-relaxed">
            {bulkPost.content.replace(/<[^>]*>/g, '')}
          </div>
        )}

        {/* CTA Button */}
        {bulkPost?.actionType && bulkPost.actionType.trim() !== '' && (
          <Button 
            className="w-full" 
            onClick={() => bulkPost?.ctaUrl && window.open(bulkPost.ctaUrl, '_blank')}
          >
            {bulkPost.actionType}
          </Button>
        )}

        {/* Date */}
        {bulkPost?.publishDate && (
          <div className="text-sm text-muted-foreground">
            Posted on: {formatDateTime(bulkPost.publishDate)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function - only re-render if bulkPost data actually changes
  const prev = prevProps.bulkPost;
  const next = nextProps.bulkPost;
  
  if (prev === next) return true; // Same reference
  if (!prev || !next) return prev === next; // One is null/undefined
  
  // Deep comparison of relevant fields
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.content === next.content &&
    prev.actionType === next.actionType &&
    prev.ctaUrl === next.ctaUrl &&
    prev.publishDate === next.publishDate &&
    prev.media?.images === next.media?.images
  );
});

PostPreview.displayName = 'PostPreview';

// Memoized Table Component
const PostsTable = memo(({ 
  posts, 
  selectedPosts, 
  onSelectPost, 
  onSelectAll, 
  onViewPost, 
  onDeleteClick 
}: {
  posts: any[];
  selectedPosts: Set<string>;
  onSelectPost: (postId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onViewPost: (post: any) => void;
  onDeleteClick: (postId: string) => void;
}) => {
  const getStatusVariant = (status: string | null | undefined) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case "published":
      case "live":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={posts.length > 0 && selectedPosts.size === posts.length} 
                  onCheckedChange={onSelectAll} 
                  aria-label="Select all posts" 
                />
              </TableHead>
              <TableHead>Listing Name</TableHead>
              <TableHead>Zip Code</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32 text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No listings found.
                </TableCell>
              </TableRow>
            ) : (
              posts.map(post => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedPosts.has(post.id)} 
                      onCheckedChange={checked => onSelectPost(post.id, checked as boolean)} 
                      aria-label={`Select ${post.listingName || post.business || 'post'}`} 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{post.listingName || post.business || 'Unknown'}</div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{post.zipcode || 'N/A'}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(post.status)}>
                      {post.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 justify-end">
                      {post.status?.toLowerCase() === 'live' && (
                        <button 
                          onClick={() => onViewPost(post)} 
                          className="text-primary hover:bg-primary/10 p-1 rounded transition-colors" 
                          title="View Post"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => onDeleteClick(post.id)} 
                        className="text-destructive hover:bg-destructive/10 p-1 rounded transition-colors" 
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

PostsTable.displayName = 'PostsTable';

export const BulkPostDetails: React.FC = () => {
  // All hooks must be called first, before any conditional logic
  const {
    bulkId
  } = useParams<{
    bulkId: string;
  }>();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  
  const {
    bulkPost,
    posts,
    pagination,
    loading,
    error,
    deletePost,
    refresh,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    searchQuery,
    updateSearchQuery,
    statusFilter,
    updateStatusFilter
  } = useBulkPostDetails(bulkId || '');

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500);

  // Update search in hook when debounced value changes
  useEffect(() => {
    updateSearchQuery(debouncedSearch);
  }, [debouncedSearch, updateSearchQuery]);

  // Reset page when status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, setCurrentPage]);

  // All functions and computed values
  const handleBack = () => {
    navigate('/main-dashboard/bulk-post');
  };
  
  const getStatusVariant = (status: string | null | undefined) => {
    if (!status) return "secondary";
    switch (status.toLowerCase()) {
      case "published":
      case "live":
        return "default";
      case "draft":
        return "secondary";
      case "scheduled":
        return "outline";
      case "failed":
        return "destructive";
      default:
        return "secondary";
    }
  };
  
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM dd, yyyy • hh:mm a');
    } catch (error) {
      return dateString;
    }
  };

  // Use posts directly since filtering and pagination are handled server-side
  const paginatedPosts = posts;
  const totalPages = pagination?.pages || 1;
  
  const handleSelectPost = (postId: string, checked: boolean) => {
    const newSelectedPosts = new Set(selectedPosts);
    if (checked) {
      newSelectedPosts.add(postId);
    } else {
      newSelectedPosts.delete(postId);
    }
    setSelectedPosts(newSelectedPosts);
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(new Set(paginatedPosts.map(post => post.id)));
    } else {
      setSelectedPosts(new Set());
    }
  };
  
  const handleBulkDelete = () => {
    if (selectedPosts.size > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };
  
  const handleBulkDeleteConfirm = async () => {
    try {
      for (const postId of selectedPosts) {
        await deletePost(postId);
      }
      toast({
        title: "Success",
        description: `${selectedPosts.size} posts deleted successfully`
      });
      setSelectedPosts(new Set());
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some posts",
        variant: "destructive"
      });
    }
    setBulkDeleteDialogOpen(false);
  };
  
  const handleDeleteClick = (postId: string) => {
    setDeletingPostId(postId);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (deletingPostId) {
      try {
        await deletePost(deletingPostId);
        toast({
          title: "Success",
          description: "Post deleted successfully"
        });
        refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete post",
          variant: "destructive"
        });
      }
    }
    setDeleteDialogOpen(false);
    setDeletingPostId(null);
  };
  
  const handleViewPost = (post: any) => {
    if (post.searchUrl) {
      window.open(post.searchUrl, '_blank');
    }
  };

  // Early returns AFTER all hooks are called
  if (loading) {
    return <div className="animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-1/3"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-muted rounded"></div>
          <div className="lg:col-span-2 h-96 bg-muted rounded"></div>
        </div>
      </div>;
  }
  
  if (error) {
    return <div className="text-center py-12">
        <p className="text-muted-foreground">Error loading post details: {error}</p>
        <Button onClick={refresh} className="mt-4">
          Try Again
        </Button>
      </div>;
  }
  return <div className="space-y-0">
      {/* Page Header - Minimal spacing */}
      <div className="mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">View Details</h1>
          <p className="text-sm text-muted-foreground">View details of the selected bulk post</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Post Preview */}
        <div className="lg:col-span-1">
          <PostPreview bulkPost={bulkPost} />
        </div>

        {/* Right Column - Table and Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bulk Actions */}
          {selectedPosts.size > 0 && (
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">
                {selectedPosts.size} post{selectedPosts.size > 1 ? 's' : ''} selected
              </span>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="ml-auto">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Filters */}
          <div className="flex gap-4">
            <Input 
              placeholder="Search by listing name." 
              value={searchInput} 
              onChange={e => setSearchInput(e.target.value)} 
              className="flex-1" 
            />
            <Select value={statusFilter} onValueChange={updateStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="live">Live</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Posts Table */}
          <PostsTable
            posts={paginatedPosts}
            selectedPosts={selectedPosts}
            onSelectPost={handleSelectPost}
            onSelectAll={handleSelectAll}
            onViewPost={handleViewPost}
            onDeleteClick={handleDeleteClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, pagination?.total || 0)} of {pagination?.total || 0} entries
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Posts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPosts.size} selected post{selectedPosts.size > 1 ? 's' : ''}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post.
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