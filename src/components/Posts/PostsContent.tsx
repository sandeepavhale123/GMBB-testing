
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Trash2 } from 'lucide-react';
import { PostCard } from './PostCard';
import { PostListItem } from './PostListItem';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface Post {
  id: string;
  title: string;
  content: string;
  status: 'published' | 'draft' | 'scheduled' | 'failed';
  business: string;
  publishDate: string;
  engagement: {
    views: number;
    clicks: number;
    shares: number;
  };
  searchUrl?: string;
  media?: {
    images: string;
  };
  tags?: string;
}

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
}

export const PostsContent: React.FC<PostsContentProps> = ({
  posts,
  viewMode,
  pagination,
  onPageChange
}) => {
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [showSelection, setShowSelection] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelectPost = (postId: string, selected: boolean) => {
    const newSelected = new Set(selectedPosts);
    if (selected) {
      newSelected.add(postId);
    } else {
      newSelected.delete(postId);
    }
    setSelectedPosts(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(new Set(posts.map(post => post.id)));
    } else {
      setSelectedPosts(new Set());
    }
  };

  const handleDeleteSelected = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    // Here you would implement the actual delete logic
    console.log('Deleting posts:', Array.from(selectedPosts));
    setSelectedPosts(new Set());
    setShowSelection(false);
    setShowDeleteDialog(false);
    // TODO: Implement actual delete API call
  };

  const handleSingleDelete = (postId: string) => {
    setSelectedPosts(new Set([postId]));
    setShowDeleteDialog(true);
  };

  const toggleSelectionMode = () => {
    setShowSelection(!showSelection);
    if (showSelection) {
      setSelectedPosts(new Set());
    }
  };

  const allSelected = posts.length > 0 && selectedPosts.size === posts.length;
  const someSelected = selectedPosts.size > 0 && selectedPosts.size < posts.length;

  return (
    <>
      {/* Selection Controls */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSelectionMode}
          >
            {showSelection ? 'Cancel Selection' : 'Select Posts'}
          </Button>
          
          {showSelection && posts.length > 0 && (
            <div className="flex items-center gap-2">
              <Checkbox
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected;
                }}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">
                Select All ({selectedPosts.size} selected)
              </span>
            </div>
          )}
        </div>

        {showSelection && selectedPosts.size > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDeleteSelected}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedPosts.size})
          </Button>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              isSelected={selectedPosts.has(post.id)}
              onSelect={handleSelectPost}
              onDelete={handleSingleDelete}
              showSelection={showSelection}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border divide-y">
          {posts.map(post => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevious}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Posts</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedPosts.size} post{selectedPosts.size !== 1 ? 's' : ''}? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
