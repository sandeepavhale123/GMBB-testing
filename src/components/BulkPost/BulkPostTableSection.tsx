import React, { useState, useEffect, memo } from 'react';
import { Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { useBulkPostTable } from '@/hooks/useBulkPostTable';
import { useDebounce } from '@/hooks/useDebounce';

interface BulkPostTableSectionProps {
  bulkId: string;
}

const PostsTable = memo(({ 
  posts, 
  selectedPosts, 
  onSelectPost, 
  onSelectAll, 
  onViewPost, 
  onDeletePost 
}: any) => {
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
      case 'published':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'scheduled':
        return 'outline';
      case 'failed':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'live':
        return 'Published';
      case 'published':
        return 'Published';
      case 'draft':
        return 'Draft';
      case 'scheduled':
        return 'Scheduled';
      case 'failed':
        return 'Failed';
      default:
        return status || 'Unknown';
    }
  };

  const allSelected = posts.length > 0 && selectedPosts.size === posts.length;
  const someSelected = selectedPosts.size > 0 && selectedPosts.size < posts.length;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12">
                <Checkbox 
                checked={allSelected}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Listing Name</TableHead>
            <TableHead>Zip Code</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post: any) => (
            <TableRow 
              key={post.id} 
              className={selectedPosts.has(post.id) ? "bg-muted/30" : ""}
            >
              <TableCell>
                <Checkbox 
                  checked={selectedPosts.has(post.id)}
                  onCheckedChange={() => onSelectPost(post.id)}
                />
              </TableCell>
              <TableCell className="font-medium">
                {post.listingName || 'N/A'}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {post.zipcode || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(post.status)}>
                  {getStatusDisplay(post.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  {post.searchUrl && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewPost(post.searchUrl)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeletePost(post.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

export const BulkPostTableSection: React.FC<BulkPostTableSectionProps> = memo(({ bulkId }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const {
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
  } = useBulkPostTable(bulkId);

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

  const handleSelectPost = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allPostIds = new Set(posts.map((post: any) => post.id));
      setSelectedPosts(allPostIds);
    } else {
      setSelectedPosts(new Set());
    }
  };

  const handleDeletePost = (postId: string) => {
    setDeletingPostId(postId);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedPosts.size > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!deletingPostId) return;
    
    try {
      await deletePost(deletingPostId);
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDeletingPostId(null);
    }
  };

  const confirmBulkDelete = async () => {
    const deletePromises = Array.from(selectedPosts).map(postId => deletePost(postId));
    
    try {
      await Promise.all(deletePromises);
      toast({
        title: "Success",
        description: `${selectedPosts.size} posts deleted successfully`,
      });
      setSelectedPosts(new Set());
      refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some posts",
        variant: "destructive",
      });
    } finally {
      setBulkDeleteDialogOpen(false);
    }
  };

  const handleViewPost = (searchUrl: string) => {
    window.open(searchUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="lg:col-span-2 space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lg:col-span-2 space-y-4">
        <div className="text-center py-8">
          <p className="text-destructive">Error loading posts: {error}</p>
          <Button onClick={refresh} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-2 space-y-4">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-auto">
          <Input
            placeholder="Search posts..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={statusFilter} onValueChange={updateStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="live">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedPosts.size > 0 && (
          <Button 
            onClick={handleBulkDelete}
            variant="destructive"
            size="sm"
            className="whitespace-nowrap"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected ({selectedPosts.size})
          </Button>
        )}
      </div>

      {/* Table */}
      <PostsTable 
        posts={posts}
        selectedPosts={selectedPosts}
        onSelectPost={handleSelectPost}
        onSelectAll={handleSelectAll}
        onViewPost={handleViewPost}
        onDeletePost={handleDeletePost}
      />

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, pagination.total || 0)} of {pagination.total || 0} posts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {pagination.pages || 1}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= (pagination.pages || 1)}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialogs */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Multiple Posts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPosts.size} selected posts? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete {selectedPosts.size} Posts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});