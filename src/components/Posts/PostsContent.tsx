import React, { useState } from 'react';
import { Button } from '../ui/button';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Trash2, Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { deletePost, fetchPosts, clearDeleteError } from '../../store/slices/postsSlice';
import { useListingContext } from '../../context/ListingContext';
import { toast } from '@/hooks/use-toast';
import { Post } from '../../types/postTypes';

interface PostsContentProps {
  posts: Post[];
  viewMode: 'grid' | 'list';
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  onPageChange: (page: number) => void;
  onClonePost: (post: Post) => void;
}
export const PostsContent: React.FC<PostsContentProps> = ({
  posts,
  viewMode,
  pagination,
  onPageChange,
  onClonePost
}) => {
  const dispatch = useAppDispatch();
  const { selectedListing } = useListingContext();
  const { deleteLoading, deleteError } = useAppSelector(state => state.posts);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleSelectPost = (postId: string, isSelected: boolean) => {
    const newSelectedPosts = new Set(selectedPosts);
    if (isSelected) {
      newSelectedPosts.add(postId);
    } else {
      newSelectedPosts.delete(postId);
    }
    setSelectedPosts(newSelectedPosts);
  };
  const handleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(posts.map(post => post.id)));
    }
  };
  const handleDeleteSelected = async () => {
    // Get listingId from context or URL
    const listingId = selectedListing?.id || parseInt(window.location.pathname.split('/')[2]) || 176832;
    
    if (!listingId) {
      toast({
        title: "Error",
        description: "No business listing selected. Please select a listing first.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPosts.size === 0) {
      toast({
        title: "No Posts Selected",
        description: "Please select posts to delete.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Clear any previous errors
      dispatch(clearDeleteError());

      const postIds = Array.from(selectedPosts).map(id => parseInt(id));

      await dispatch(deletePost({
        postId: postIds,
        listingId: parseInt(listingId.toString())
      })).unwrap();

      toast({
        title: "Posts Deleted",
        description: `${selectedPosts.size} post${selectedPosts.size > 1 ? 's' : ''} have been successfully deleted.`,
      });

      // Reset selection and exit selection mode
      setSelectedPosts(new Set());
      setIsSelectionMode(false);

      // Refresh posts list
      dispatch(fetchPosts({
        listingId: parseInt(listingId.toString()),
        filters: { status: 'all', search: '' },
        pagination: { page: 1, limit: 12 },
      }));

    } catch (error) {
      console.error('Error deleting posts:', error);
      toast({
        title: "Failed to Delete Posts",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show error toast if there's a delete error
  React.useEffect(() => {
    if (deleteError) {
      toast({
        title: "Error",
        description: deleteError,
        variant: "destructive",
      });
    }
  }, [deleteError]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedPosts(new Set());
  };

  return <>
      {/* Single Row Layout: Total Posts Count and Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600 ">
          Total Posts: {posts.length}
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={toggleSelectionMode} size="sm">
            {isSelectionMode ? 'Cancel Selection' : 'Select Posts'}
          </Button>
          
          {isSelectionMode && <>
              <Button variant="outline" onClick={handleSelectAll} size="sm">
                {selectedPosts.size === posts.length ? 'Deselect All' : 'Select All'}
              </Button>

              {selectedPosts.size > 0 && <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={deleteLoading}>
                      {deleteLoading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4 mr-2" />
                      )}
                      {deleteLoading ? "Deleting..." : `Delete Selected (${selectedPosts.size})`}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Posts</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedPosts.size} selected post{selectedPosts.size > 1 ? 's' : ''}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteSelected} disabled={deleteLoading}>
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>}
            </>}
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              isSelectionMode={isSelectionMode} 
              isSelected={selectedPosts.has(post.id)} 
              onSelect={handleSelectPost}
              onClonePost={onClonePost}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {posts.map(post => (
            <PostListItem 
              key={post.id} 
              post={post}
              onClonePost={onClonePost}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && <div className="flex items-center justify-center space-x-2 mt-8">
          <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevious}>
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <Button variant="outline" size="sm" onClick={() => onPageChange(pagination.currentPage + 1)} disabled={!pagination.hasNext}>
            Next
          </Button>
        </div>}
    </>;
};
